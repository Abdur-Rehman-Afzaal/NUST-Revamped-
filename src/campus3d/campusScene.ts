import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  CAMPUS_LANDMARKS,
  LIGHTING_PRESETS,
  OVERVIEW_PRESET,
  type CampusLandmarkSpec,
  type LightingPresetId,
} from './nustCampusLayout';
import { createCampusTextures } from './textures';

export interface Campus3DCallbacks {
  onHoverLandmark?: (landmark: CampusLandmarkSpec | null) => void;
  onSelectLandmark?: (landmark: CampusLandmarkSpec | null) => void;
}

export interface Campus3DController {
  focusLandmark: (landmarkId: string | 'overview') => void;
  setLightingPreset: (presetId: LightingPresetId) => void;
  setAutoOrbit: (enabled: boolean) => void;
  dispose: () => void;
}

// Pre-allocated scratch math helpers (zero GC inside animation loop)
const _targetCam = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _targetColor = new THREE.Color();
const _busPos = new THREE.Vector3();
const _busTangent = new THREE.Vector3();
const _busLook = new THREE.Vector3();
const _dummy = new THREE.Object3D();

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function mountCampus3DScene(
  container: HTMLElement,
  callbacks: Campus3DCallbacks
): Campus3DController {
  const isSoftwareGl = detectSoftwareWebGL();
  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 320);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const initialLighting = LIGHTING_PRESETS.morning;
  scene.background = new THREE.Color(initialLighting.skyHex);
  scene.fog = new THREE.FogExp2(initialLighting.fogHex, initialLighting.fogDensity);

  // Studio PBR environment reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
  scene.environment = envRenderTarget.texture;
  scene.environmentIntensity = initialLighting.environmentIntensity;
  renderer.toneMappingExposure = initialLighting.exposure;
  roomEnv.dispose();
  pmremGenerator.dispose();

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 420);
  camera.position.set(...OVERVIEW_PRESET.cameraPos);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...OVERVIEW_PRESET.targetPos);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.06;
  controls.minDistance = 11;
  controls.maxDistance = 95;
  controls.minPolarAngle = 0.16;
  controls.maxPolarAngle = Math.PI / 2 - 0.06;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.45;
  controls.update();

  // Lighting rig (warm sun key + cool sky/ground hemisphere + subtle rim)
  const hemiLight = new THREE.HemisphereLight(
    initialLighting.hemiSky,
    initialLighting.hemiGround,
    initialLighting.hemiIntensity
  );
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(
    initialLighting.sunColor,
    initialLighting.sunIntensity
  );
  sunLight.position.set(...initialLighting.sunPos);
  sunLight.castShadow = !isSoftwareGl;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = -56;
  sunLight.shadow.camera.right = 56;
  sunLight.shadow.camera.top = 56;
  sunLight.shadow.camera.bottom = -56;
  sunLight.shadow.camera.near = 5;
  sunLight.shadow.camera.far = 165;
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x8ec5ff, 0.45);
  rimLight.position.set(-40, 22, -45);
  scene.add(rimLight);

  // Track resources for clean unmount disposal
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materialsToDispose.push(m);
    return m;
  };

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const textures = createCampusTextures(maxAniso);

  // Shared PBR Materials with deliberate roughness/metalness contrast
  const matLimestone = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xebe6db,
      roughness: 0.78,
      metalness: 0.04,
      map: textures.facadeAcademic,
    })
  );
  const matConcrete = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd9dde2,
      roughness: 0.85,
      metalness: 0.05,
    })
  );
  const matSandstone = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd8c3a5,
      roughness: 0.8,
      metalness: 0.04,
      map: textures.facadeAcademic,
    })
  );
  const matTerracotta = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb85d3b,
      roughness: 0.74,
      metalness: 0.05,
    })
  );
  const matNustBlue = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x00447c,
      roughness: 0.34,
      metalness: 0.35,
    })
  );
  const matDomeTeal = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0c5987,
      roughness: 0.22,
      metalness: 0.55,
    })
  );
  const matWindowGlass = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e4d7a,
      roughness: 0.14,
      metalness: 0.65,
      map: textures.facadeGlass,
      emissive: new THREE.Color(0xffdfa8),
      emissiveIntensity: initialLighting.windowEmissiveIntensity,
    })
  );
  const matSolar = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x163963,
      roughness: 0.22,
      metalness: 0.55,
      map: textures.facadeSolar,
    })
  );
  const matBrushedMetal = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xbac4d0,
      roughness: 0.26,
      metalness: 0.82,
    })
  );
  const matGoldTrim = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd49a35,
      roughness: 0.24,
      metalness: 0.88,
    })
  );
  const matAsphalt = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x424a54,
      roughness: 0.9,
      metalness: 0.03,
      map: textures.roadAsphalt,
    })
  );
  const matPlazaStone = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd7d2c8,
      roughness: 0.82,
      metalness: 0.04,
    })
  );
  const matWater = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1a5f82,
      roughness: 0.12,
      metalness: 0.45,
      normalMap: textures.waterNormal,
      normalScale: new THREE.Vector2(0.45, 0.45),
    })
  );

  const shadowize = (obj: THREE.Object3D, cast = true, receive = true) => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = cast;
        child.receiveShadow = receive;
      }
    });
  };

  // =========================================================
  // 1. EXPANSIVE H-12 TERRAIN & NORTHERN MARGALLA HILLS
  // =========================================================
  const terrainGeo = trackGeo(new THREE.PlaneGeometry(340, 340, 96, 96));
  terrainGeo.rotateX(-Math.PI / 2);
  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    let y = 0;
    // Margalla Hills rising naturally along the northern border (z < -42)
    if (z < -42) {
      const dist = Math.abs(z + 42);
      const ridge =
        Math.sin(x * 0.045) * 3.8 +
        Math.cos(x * 0.09 + z * 0.05) * 2.4 +
        Math.sin(x * 0.018) * 5.0;
      y = Math.min(26, Math.pow(dist * 0.15, 1.32) * 3.2 + Math.max(0, ridge) * (dist / 45));
    }
    // Gentle outer foothills on far east/west beyond campus perimeter
    const radial = Math.hypot(x, z);
    if (radial > 78 && z >= -42) {
      y += Math.sin(x * 0.06) * Math.cos(z * 0.06) * 1.4 + (radial - 78) * 0.04;
    }
    posAttr.setY(i, y);
  }
  terrainGeo.computeVertexNormals();
  const matTerrain = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x628b4f,
      roughness: 0.92,
      metalness: 0.02,
      map: textures.lawnGrass,
    })
  );
  const terrainMesh = new THREE.Mesh(terrainGeo, matTerrain);
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // =========================================================
  // 2. H-12 BOULEVARD NETWORK & RING ROAD (Offset >= 0.04 on Y)
  // =========================================================
  const roadGroup = new THREE.Group();
  const addRoadSegment = (w: number, d: number, x: number, z: number, rotY = 0) => {
    const geo = trackGeo(new THREE.BoxGeometry(w, 0.06, d));
    const mesh = new THREE.Mesh(geo, matAsphalt);
    mesh.position.set(x, 0.03, z);
    mesh.rotation.y = rotY;
    mesh.receiveShadow = true;
    roadGroup.add(mesh);
  };
  // Central Srinagar Highway to Main Office Spine
  addRoadSegment(3.6, 56, 0, 14);
  // Outer Campus Ring Loop (North, South, East, West)
  addRoadSegment(70, 3.0, 0, -29);
  addRoadSegment(70, 3.0, 0, 31);
  addRoadSegment(3.0, 62, -31, 1);
  addRoadSegment(3.0, 62, 31, 1);
  // Cross Academic Ave
  addRoadSegment(62, 2.6, 0, 3.5);
  // NSTP Service Spur
  addRoadSegment(2.6, 18, 15, 22);
  scene.add(roadGroup);

  // Central Ceremonial Forecourt Promenade
  const promenade = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(10, 0.08, 30)),
    matPlazaStone
  );
  promenade.position.set(0, 0.04, -3);
  promenade.receiveShadow = true;
  scene.add(promenade);

  // =========================================================
  // 3. COMPOSITE LANDMARK BUILDINGS (3–12 PARTS EACH)
  // =========================================================
  const addContactShadow = (parent: THREE.Group, sx: number, sz: number) => {
    const shadowPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(sx, sz)),
      trackMat(
        new THREE.MeshBasicMaterial({
          map: textures.contactShadow,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        })
      )
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.05;
    parent.add(shadowPlane);
  };

  // A. MAIN OFFICE & RECTORATE (Signature NUST H-12 Dome & Colonnade)
  const animatedFlags: THREE.Mesh[] = [];
  let fountainWaterRing: THREE.Mesh | null = null;
  {
    const g = new THREE.Group();
    g.position.set(0, 0, -14);
    addContactShadow(g, 18, 13);

    // 1. Ceremonial stepped plinth
    const plinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(13.2, 0.55, 8.6)), matPlazaStone);
    plinth.position.y = 0.275;
    g.add(plinth);
    const steps = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(6.4, 0.28, 2.2)), matPlazaStone);
    steps.position.set(0, 0.14, 5.1);
    g.add(steps);

    // 2. Symmetrical East & West Rectorate Wings
    const wingGeo = trackGeo(new THREE.BoxGeometry(11.6, 2.9, 5.8));
    const wings = new THREE.Mesh(wingGeo, matLimestone);
    wings.position.y = 0.55 + 1.45;
    g.add(wings);

    // 3. Wing roof cornices
    const cornice = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(12.1, 0.28, 6.2)), matConcrete);
    cornice.position.y = 3.55;
    g.add(cornice);

    // 4. Central Octagonal Secretariat Rotunda & Glazed Drum
    const rotunda = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.6, 2.8, 3.6, 8)),
      matLimestone
    );
    rotunda.position.y = 0.55 + 1.8;
    g.add(rotunda);

    const glassDrum = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.2, 2.2, 1.35, 16)),
      matWindowGlass
    );
    glassDrum.position.y = 4.65;
    g.add(glassDrum);

    // 5. Iconic NUST Glazed Blue Dome (LatheGeometry) & Spire Finial
    const domePts: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = (i / 12) * (Math.PI / 2);
      domePts.push(new THREE.Vector2(Math.cos(t) * 2.25, Math.sin(t) * 1.95));
    }
    const dome = new THREE.Mesh(trackGeo(new THREE.LatheGeometry(domePts, 24)), matDomeTeal);
    dome.position.y = 5.3;
    g.add(dome);

    const spire = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.16, 1.1, 8)), matGoldTrim);
    spire.position.y = 7.45;
    g.add(spire);

    // 6. Front Portico Columns
    for (let i = -2; i <= 2; i++) {
      const col = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.16, 0.19, 2.9, 10)), matConcrete);
      col.position.set(i * 1.05, 0.55 + 1.45, 3.35);
      g.add(col);
    }
    const porticoRoof = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.6, 0.35, 1.7)), matNustBlue);
    porticoRoof.position.set(0, 3.62, 3.35);
    g.add(porticoRoof);

    // 7. Forecourt Reflecting Fountain
    const basinOuter = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(1.75, 1.85, 0.32, 24)), matConcrete);
    basinOuter.position.set(0, 0.16, 7.6);
    g.add(basinOuter);
    fountainWaterRing = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(1.45, 1.45, 0.36, 24)), matWater);
    fountainWaterRing.position.set(0, 0.18, 7.6);
    g.add(fountainWaterRing);

    // 8. Ceremonial Flagpoles with Animated Banner Mesh
    [-4.2, 4.2].forEach((fx, idx) => {
      const pole = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.04, 0.05, 4.6, 8)), matBrushedMetal);
      pole.position.set(fx, 2.3, 6.4);
      g.add(pole);
      const flag = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(1.1, 0.65, 6, 2)),
        trackMat(
          new THREE.MeshStandardMaterial({
            color: idx === 0 ? 0x115740 : 0x00447c,
            roughness: 0.65,
            side: THREE.DoubleSide,
          })
        )
      );
      flag.position.set(fx + 0.55, 4.2, 6.4);
      g.add(flag);
      animatedFlags.push(flag);
    });

    shadowize(g);
    scene.add(g);
  }

  // B. SEECS — School of Electrical Engg. & Computer Science (4-Wing Courtyard Quad)
  {
    const g = new THREE.Group();
    g.position.set(-19, 0, -6);
    addContactShadow(g, 14, 13);

    const base = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.8, 0.4, 9.6)), matPlazaStone);
    base.position.y = 0.2;
    g.add(base);

    // 4 courtyard perimeter wings
    const nWing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.2, 3.3, 2.4)), matSandstone);
    nWing.position.set(0, 2.05, -3.2);
    const sWing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.2, 3.0, 2.2)), matSandstone);
    sWing.position.set(0, 1.9, 3.2);
    const wWing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.4, 3.1, 5.0)), matLimestone);
    wWing.position.set(-3.9, 1.95, 0);
    const eWing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.4, 3.1, 5.0)), matLimestone);
    eWing.position.set(3.9, 1.95, 0);
    g.add(nWing, sWing, wWing, eWing);

    // Glazed NCAI Bridge Atrium
    const atrium = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 3.7, 2.6)), matWindowGlass);
    atrium.position.set(0, 2.25, -3.25);
    g.add(atrium);

    // NUST-Blue Roof Parapets + Solar Roof Canopy
    const roofCap = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.5, 0.22, 2.7)), matNustBlue);
    roofCap.position.set(0, 3.8, -3.2);
    g.add(roofCap);

    const solarRack = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.6, 0.12, 1.8)), matSolar);
    solarRack.position.set(-1.5, 4.1, -3.2);
    solarRack.rotation.x = 0.24;
    g.add(solarRack);

    // Roof Telemetry Comms Mast
    const mast = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.05, 0.1, 1.6, 8)), matBrushedMetal);
    mast.position.set(3.5, 4.6, -3.2);
    g.add(mast);

    shadowize(g);
    scene.add(g);
  }

  // C. SMME — Mechanical & Manufacturing Engg. (Sawtooth Bays + Robotics Arena)
  {
    const g = new THREE.Group();
    g.position.set(-21, 0, 11);
    addContactShadow(g, 14, 12);

    const plinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(11.4, 0.35, 9.2)), matPlazaStone);
    plinth.position.y = 0.175;
    g.add(plinth);

    // Academic Front Wing
    const frontBlock = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.6, 3.0, 3.4)), matLimestone);
    frontBlock.position.set(0, 1.85, 2.4);
    g.add(frontBlock);

    const glassBand = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(8.2, 1.6, 3.55)), matWindowGlass);
    glassBand.position.set(0, 2.0, 2.4);
    g.add(glassBand);

    // Heavy Mechanical Sawtooth Workshop Bays
    const workshop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.4, 2.4, 4.4)), matConcrete);
    workshop.position.set(0, 1.55, -1.7);
    g.add(workshop);

    const sawShape = new THREE.Shape();
    sawShape.moveTo(0, 0);
    sawShape.lineTo(1.8, 0.95);
    sawShape.lineTo(1.8, 0);
    sawShape.closePath();
    const sawGeo = trackGeo(
      new THREE.ExtrudeGeometry(sawShape, { depth: 4.2, bevelEnabled: false })
    );
    sawGeo.rotateY(Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const bay = new THREE.Mesh(sawGeo, matBrushedMetal);
      bay.position.set(-4.6 + i * 2.2, 2.75, -1.7 + 2.1);
      g.add(bay);
    }

    // NCRA Robotics Cylindrical Flight Test Dome
    const roboticsAnnex = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.7, 1.8, 2.9, 16)),
      matNustBlue
    );
    roboticsAnnex.position.set(4.1, 1.8, -2.0);
    g.add(roboticsAnnex);

    shadowize(g);
    scene.add(g);
  }

  // D. NBS & S3H — Twin Business & Social Sciences Quadrangle
  {
    const g = new THREE.Group();
    g.position.set(18, 0, -6);
    addContactShadow(g, 15, 13);

    const plinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(12.2, 0.4, 9.6)), matPlazaStone);
    plinth.position.y = 0.2;
    g.add(plinth);

    // NBS Main Block (West) & S3H Policy Block (East)
    const nbsWing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 3.3, 8.2)), matLimestone);
    nbsWing.position.set(-3.4, 2.05, 0);
    const s3hWing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 3.0, 8.2)), matSandstone);
    s3hWing.position.set(3.4, 1.9, 0);
    g.add(nbsWing, s3hWing);

    // Connecting Bridge Atrium & Terracotta Feature Louvers
    const bridge = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 2.4, 2.8)), matWindowGlass);
    bridge.position.set(0, 2.5, -2.5);
    g.add(bridge);

    const tower = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.2, 4.6, 2.2)), matNustBlue);
    tower.position.set(-3.4, 2.7, 2.6);
    g.add(tower);

    const atriumCrown = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.5, 0.25, 2.5)), matGoldTrim);
    atriumCrown.position.set(-3.4, 5.1, 2.6);
    g.add(atriumCrown);

    // Courtyard Garden Lawn Strip
    const garden = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(2.4, 0.14, 4.6)),
      matTerrain
    );
    garden.position.set(0, 0.45, 1.3);
    g.add(garden);

    shadowize(g);
    scene.add(g);
  }

  // E. SADA — Art, Design & Architecture (Cantilevered Studios + Skylights)
  {
    const g = new THREE.Group();
    g.position.set(20, 0, 10);
    addContactShadow(g, 13, 12);

    const terrace = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.6, 0.45, 9.0)), matPlazaStone);
    terrace.position.y = 0.225;
    g.add(terrace);

    const baseStudio = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(8.8, 2.2, 6.8)), matConcrete);
    baseStudio.position.set(-0.4, 1.55, 0);
    g.add(baseStudio);

    // Iconic Cantilevered Upper Studio Slab
    const cantilever = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(9.6, 1.7, 4.0)), matLimestone);
    cantilever.position.set(0.7, 3.4, -1.0);
    g.add(cantilever);

    // Terracotta Brutalist Core Wall + Glazed Studio Curtain
    const brickWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.4, 4.7, 2.2)), matTerracotta);
    brickWall.position.set(-3.6, 2.8, 1.8);
    g.add(brickWall);

    const studioGlass = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.8, 1.35, 4.15)), matWindowGlass);
    studioGlass.position.set(0.7, 3.4, -1.0);
    g.add(studioGlass);

    // Skylight Ribs
    for (let i = -1; i <= 1; i++) {
      const skylight = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.8, 0.55, 2.2)), matBrushedMetal);
      skylight.position.set(i * 2.5 + 0.6, 4.5, -1.0);
      skylight.rotation.z = 0.16;
      g.add(skylight);
    }

    shadowize(g);
    scene.add(g);
  }

  // F. USPCAS-E — Energy Research Complex (Matching real H-12 building + Solar Arrays)
  {
    const g = new THREE.Group();
    g.position.set(-14, 0, -24);
    addContactShadow(g, 13, 10);

    const plinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.2, 0.35, 7.6)), matPlazaStone);
    plinth.position.y = 0.175;
    g.add(plinth);

    const mainHall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(9.2, 3.2, 5.8)), matLimestone);
    mainHall.position.y = 1.95;
    g.add(mainHall);

    const glassCurtain = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(6.8, 2.4, 6.0)), matWindowGlass);
    glassCurtain.position.y = 2.0;
    g.add(glassCurtain);

    // Rooftop Angled Photovoltaic Solar Panels
    for (let row = 0; row < 2; row++) {
      const solar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(8.2, 0.12, 1.8)), matSolar);
      solar.position.set(0, 3.85, -1.3 + row * 2.4);
      solar.rotation.x = 0.32;
      g.add(solar);
    }

    // Vertical Louver Shading Fins
    for (let i = -3; i <= 3; i++) {
      const fin = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 2.8, 0.35)), matBrushedMetal);
      fin.position.set(i * 1.1, 1.95, 3.05);
      g.add(fin);
    }

    shadowize(g);
    scene.add(g);
  }

  // G. CENTRAL LIBRARY & JINNAH AUDITORIUM PRECINCT
  {
    const g = new THREE.Group();
    g.position.set(0, 0, 2);
    addContactShadow(g, 13, 12);

    const plaza = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.6, 0.4, 9.2)), matPlazaStone);
    plaza.position.y = 0.2;
    g.add(plaza);

    // Octagonal Stepped Glass Reading Rotunda
    const libLower = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(3.4, 3.6, 2.2, 8)), matWindowGlass);
    libLower.position.set(-2.2, 1.5, 0);
    const libUpper = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(2.6, 2.8, 1.6, 8)), matLimestone);
    libUpper.position.set(-2.2, 3.4, 0);
    const libCrown = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.9, 2.6, 0.65, 8)), matNustBlue);
    libCrown.position.set(-2.2, 4.5, 0);
    g.add(libLower, libUpper, libCrown);

    // Jinnah Auditorium Monolith
    const audiBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.6, 3.2, 6.2)), matSandstone);
    audiBase.position.set(2.6, 2.0, 0);
    const audiRoof = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.9, 0.4, 6.5)), matNustBlue);
    audiRoof.position.set(2.6, 3.75, 0);
    audiRoof.rotation.x = -0.08;
    g.add(audiBase, audiRoof);

    shadowize(g);
    scene.add(g);
  }

  // H. NSTP — National Science & Technology Park (Twin Dark-Glass Innovation Towers)
  {
    const g = new THREE.Group();
    g.position.set(15, 0, 24);
    addContactShadow(g, 17, 13);

    const techDeck = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(14.4, 0.45, 9.6)), matPlazaStone);
    techDeck.position.y = 0.225;
    g.add(techDeck);

    // Tower 1 (Hatch 8 / Cube 8) & Tower 2 (R&D Center)
    const tower1 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.0, 5.4, 4.4)), matWindowGlass);
    tower1.position.set(-3.6, 3.15, -0.4);
    const tower2 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.4, 4.4, 4.6)), matWindowGlass);
    tower2.position.set(3.6, 2.65, 0.4);
    g.add(tower1, tower2);

    // Aluminum Exoskeleton Frames + Skybridge
    const frame1 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.3, 0.32, 4.7)), matBrushedMetal);
    frame1.position.set(-3.6, 5.95, -0.4);
    const frame2 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.7, 0.3, 4.9)), matBrushedMetal);
    frame2.position.set(3.6, 4.95, 0.4);
    const skybridge = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.4, 1.4, 2.2)), matBrushedMetal);
    skybridge.position.set(0, 3.5, 0);
    g.add(frame1, frame2, skybridge);

    // NSTP Emerald-Gold Tech Accent Beacon Strip
    const accent = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(5.35, 0.18, 0.2)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.45 }))
    );
    accent.position.set(-3.6, 5.65, 1.85);
    g.add(accent);

    shadowize(g);
    scene.add(g);
  }

  // I. NUST LAKE, SPORTS COMPLEX & RESIDENTIAL HOSTELS
  {
    const g = new THREE.Group();
    g.position.set(-33, 0, -14);

    // Scenic Organic NUST Lake Basin (ExtrudeGeometry)
    const lakeShape = new THREE.Shape();
    lakeShape.moveTo(-6, -3);
    lakeShape.bezierCurveTo(-7, 2, -2, 5.5, 4, 4);
    lakeShape.bezierCurveTo(7.5, 2.5, 6.5, -3.5, 2, -4.5);
    lakeShape.bezierCurveTo(-2, -5.5, -5, -5, -6, -3);
    const lakeGeo = trackGeo(new THREE.ShapeGeometry(lakeShape, 24));
    lakeGeo.rotateX(-Math.PI / 2);
    const lakeMesh = new THREE.Mesh(lakeGeo, matWater);
    lakeMesh.position.set(2, 0.08, 2);
    lakeMesh.receiveShadow = true;
    g.add(lakeMesh);

    // Lakefront Timber Walk & Viewing Gazebo
    const deck = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 0.25, 1.8)), matTerracotta);
    deck.position.set(6.5, 0.16, 1.2);
    g.add(deck);

    // Residential Hostels (Razi / Ghazali / Fatima Blocks)
    [
      [-7.5, -6.5],
      [-7.5, -2.2],
      [-2.0, -7.8],
    ].forEach(([hx, hz]) => {
      const hostel = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.8, 2.6, 2.1)), matSandstone);
      hostel.position.set(hx, 1.3, hz);
      const roof = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.0, 0.22, 2.3)), matTerracotta);
      roof.position.set(hx, 2.7, hz);
      g.add(hostel, roof);
    });

    shadowize(g);
    scene.add(g);
  }

  // Secondary Campus Context: H-12 Mosque, Cricket Oval & Srinagar Gatehouse
  {
    // Mosque (between Main Office & Hostels)
    const mosque = new THREE.Group();
    mosque.position.set(-9, 0, 15);
    const mBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.6, 2.2, 5.6)), matLimestone);
    mBase.position.y = 1.1;
    const mDome = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(1.75, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2)),
      matDomeTeal
    );
    mDome.position.y = 2.2;
    const minaret = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.22, 0.3, 6.2, 10)), matLimestone);
    minaret.position.set(2.5, 3.1, 2.5);
    mosque.add(mBase, mDome, minaret);
    shadowize(mosque);
    scene.add(mosque);

    // Sports Cricket Oval (South-West)
    const oval = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(8.5, 8.5, 0.08, 32)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0x4b8f42, roughness: 0.88 }))
    );
    oval.scale.set(1.25, 1, 0.9);
    oval.position.set(-22, 0.04, 24);
    oval.receiveShadow = true;
    scene.add(oval);

    // Srinagar Highway Main Gate Arch
    const gate = new THREE.Group();
    gate.position.set(0, 0, 32.5);
    const pillarL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.1, 3.4, 1.2)), matLimestone);
    pillarL.position.set(-2.6, 1.7, 0);
    const pillarR = pillarL.clone();
    pillarR.position.set(2.6, 1.7, 0);
    const archBeam = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.0, 0.9, 1.5)), matNustBlue);
    archBeam.position.set(0, 3.6, 0);
    gate.add(pillarL, pillarR, archBeam);
    shadowize(gate);
    scene.add(gate);
  }

  // =========================================================
  // 4. INSTANCED MARGALLA TREES & CAMPUS STREETLAMPS
  // =========================================================
  const treePositions: [number, number][] = [];
  for (let i = 0; i < 240; i++) {
    // Deterministic golden-angle campus & foothill distribution
    const angle = i * 2.39996;
    const radius = 12 + ((i * 19.7) % 52);
    const tx = Math.cos(angle) * radius * 1.15;
    const tz = Math.sin(angle) * radius * 0.95 - 4;
    // Skip roads & building footprints cleanly
    const onMainRoad = Math.abs(tx) < 4.5 || Math.abs(tz - 3.5) < 3.2;
    const nearBuilding = CAMPUS_LANDMARKS.some(
      (b) =>
        Math.abs(tx - b.position[0]) < b.bounds[0] * 0.62 &&
        Math.abs(tz - b.position[2]) < b.bounds[2] * 0.65
    );
    if (!onMainRoad && !nearBuilding) {
      treePositions.push([tx, tz]);
    }
  }

  const trunkMesh = new THREE.InstancedMesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.18, 1.0, 6)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x6b4f3a, roughness: 0.9 })),
    treePositions.length
  );
  const canopyMesh = new THREE.InstancedMesh(
    trackGeo(new THREE.DodecahedronGeometry(0.85, 1)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x3b6e3c, roughness: 0.85 })),
    treePositions.length
  );
  treePositions.forEach(([tx, tz], idx) => {
    const scale = 0.85 + ((idx * 37) % 30) / 100; // ±15% natural size variation
    _dummy.position.set(tx, 0.5 * scale, tz);
    _dummy.rotation.set(0, (idx * 1.1) % Math.PI, 0);
    _dummy.scale.set(scale, scale, scale);
    _dummy.updateMatrix();
    trunkMesh.setMatrixAt(idx, _dummy.matrix);

    _dummy.position.set(tx, 1.35 * scale, tz);
    _dummy.scale.set(scale * 1.05, scale * 1.25, scale * 1.05);
    _dummy.updateMatrix();
    canopyMesh.setMatrixAt(idx, _dummy.matrix);

    _targetColor.setHSL(0.31 + ((idx % 7) - 3) * 0.012, 0.38, 0.3 + (idx % 5) * 0.025);
    canopyMesh.setColorAt(idx, _targetColor);
  });
  trunkMesh.instanceMatrix.needsUpdate = true;
  canopyMesh.instanceMatrix.needsUpdate = true;
  if (canopyMesh.instanceColor) canopyMesh.instanceColor.needsUpdate = true;
  trunkMesh.computeBoundingSphere();
  canopyMesh.computeBoundingSphere();
  trunkMesh.castShadow = !isSoftwareGl;
  canopyMesh.castShadow = !isSoftwareGl;
  canopyMesh.receiveShadow = true;
  scene.add(trunkMesh, canopyMesh);

  // Boulevard Streetlamps along Srinagar Spine & Ring Road
  const lampPositions: [number, number][] = [];
  for (let lz = -8; lz <= 28; lz += 6) {
    lampPositions.push([-2.4, lz], [2.4, lz]);
  }
  for (let lx = -24; lx <= 24; lx += 8) {
    if (Math.abs(lx) > 3) {
      lampPositions.push([lx, -27], [lx, 29]);
    }
  }
  const lampPostMesh = new THREE.InstancedMesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.06, 1.85, 6)),
    matBrushedMetal,
    lampPositions.length
  );
  const lampMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfff3d1,
      emissive: 0xffc864,
      emissiveIntensity: initialLighting.streetLampIntensity,
      roughness: 0.25,
    })
  );
  const lampGlobeMesh = new THREE.InstancedMesh(
    trackGeo(new THREE.SphereGeometry(0.16, 8, 8)),
    lampMat,
    lampPositions.length
  );
  lampPositions.forEach(([lx, lz], idx) => {
    _dummy.position.set(lx, 0.92, lz);
    _dummy.rotation.set(0, 0, 0);
    _dummy.scale.set(1, 1, 1);
    _dummy.updateMatrix();
    lampPostMesh.setMatrixAt(idx, _dummy.matrix);

    _dummy.position.set(lx, 1.9, lz);
    _dummy.updateMatrix();
    lampGlobeMesh.setMatrixAt(idx, _dummy.matrix);
  });
  lampPostMesh.instanceMatrix.needsUpdate = true;
  lampGlobeMesh.instanceMatrix.needsUpdate = true;
  lampPostMesh.computeBoundingSphere();
  lampGlobeMesh.computeBoundingSphere();
  scene.add(lampPostMesh, lampGlobeMesh);

  // =========================================================
  // 5. ANIMATED NUST CAMPUS SHUTTLES ON H-12 RING ROAD
  // =========================================================
  const shuttleCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-31, 0.08, -29),
      new THREE.Vector3(0, 0.08, -29),
      new THREE.Vector3(31, 0.08, -29),
      new THREE.Vector3(31, 0.08, 3.5),
      new THREE.Vector3(31, 0.08, 31),
      new THREE.Vector3(0, 0.08, 31),
      new THREE.Vector3(-31, 0.08, 31),
      new THREE.Vector3(-31, 0.08, 3.5),
    ],
    true
  );

  const shuttles: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const bus = new THREE.Group();
    const chassis = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.95, 0.65, 2.2)), matLimestone);
    chassis.position.y = 0.42;
    const stripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.98, 0.18, 2.22)), matNustBlue);
    stripe.position.y = 0.36;
    const windshield = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.88, 0.28, 2.24)), matWindowGlass);
    windshield.position.y = 0.56;
    bus.add(chassis, stripe, windshield);
    shadowize(bus, !isSoftwareGl, false);
    scene.add(bus);
    shuttles.push(bus);
  }

  // =========================================================
  // 6. DEDICATED RAYCAST PROXY LAYER (layers.set(1)) & SELECTION RING
  // =========================================================
  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(1);
  const pointerNdc = new THREE.Vector2();
  const proxyMeshes: THREE.Mesh[] = [];
  const proxyMat = trackMat(new THREE.MeshBasicMaterial({ visible: false }));

  CAMPUS_LANDMARKS.forEach((landmark) => {
    const proxy = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(...landmark.bounds)),
      proxyMat
    );
    proxy.position.set(
      landmark.position[0],
      landmark.bounds[1] / 2,
      landmark.position[2]
    );
    proxy.layers.set(1);
    proxy.userData.landmark = landmark;
    scene.add(proxy);
    proxyMeshes.push(proxy);
  });

  // Crisp Architectural Selection Ring on ground
  const selectionRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xd49a35,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
  );
  const selectionRing = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(0.92, 1.0, 48)),
    selectionRingMat
  );
  selectionRing.rotation.x = -Math.PI / 2;
  selectionRing.position.y = 0.09;
  selectionRing.visible = false;
  scene.add(selectionRing);

  // =========================================================
  // 7. CAMERA DAMPING, LIGHTING TRANSITIONS & INTERACTION LOOP
  // =========================================================
  let flyActive = false;
  _targetCam.set(...OVERVIEW_PRESET.cameraPos);
  _targetLook.set(...OVERVIEW_PRESET.targetPos);

  let activePreset = LIGHTING_PRESETS.morning;
  let hoveredId: string | null = null;
  let selectedId: string | null = null;
  let lastHoverCheck = 0;

  const stopFly = () => {
    flyActive = false;
  };
  controls.addEventListener('start', stopFly);

  const updateSelectionRing = (landmark: CampusLandmarkSpec | null) => {
    if (!landmark) {
      selectionRing.visible = false;
      return;
    }
    const radius = Math.max(landmark.bounds[0], landmark.bounds[2]) * 0.65;
    selectionRing.position.set(landmark.position[0], 0.09, landmark.position[2]);
    selectionRing.scale.set(radius, radius, 1);
    selectionRing.visible = true;
  };

  const getLandmarkUnderPointer = (e: PointerEvent): CampusLandmarkSpec | null => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(proxyMeshes, false);
    if (hits.length > 0) {
      return (hits[0].object.userData.landmark as CampusLandmarkSpec) ?? null;
    }
    return null;
  };

  let downX = 0;
  let downY = 0;
  const onPointerDown = (e: PointerEvent) => {
    downX = e.clientX;
    downY = e.clientY;
  };
  const onPointerMove = (e: PointerEvent) => {
    const now = performance.now();
    if (now - lastHoverCheck < 50) return;
    lastHoverCheck = now;
    const hit = getLandmarkUnderPointer(e);
    const nextId = hit?.id ?? null;
    if (nextId !== hoveredId) {
      hoveredId = nextId;
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
      callbacks.onHoverLandmark?.(hit);
    }
  };
  const onPointerUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return; // Dragged camera
    const hit = getLandmarkUnderPointer(e);
    if (hit) {
      selectedId = hit.id;
      updateSelectionRing(hit);
      _targetCam.set(...hit.cameraPos);
      _targetLook.set(...hit.targetPos);
      flyActive = true;
      callbacks.onSelectLandmark?.(hit);
    }
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(container.clientWidth, 240);
    const h = Math.max(container.clientHeight, 240);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  if (!isSoftwareGl) {
    renderer.compile(scene, camera);
  }

  // Paced animation loop (software WebGL uses fenceSync + afterDraw pacing)
  let disposed = false;
  let frameId = 0;
  let lastTime = performance.now();
  let elapsed = 0;

  function afterDraw(cb: () => void) {
    const gl = renderer.getContext() as WebGL2RenderingContext;
    if (typeof gl.fenceSync !== 'function') {
      frameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (disposed) return;
      const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
      if (status === gl.UNSIGNALED) {
        frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        frameId = window.setTimeout(cb, 80);
      }
    };
    frameId = window.setTimeout(poll, 5);
  }

  function tick() {
    if (disposed) return;
    const now = performance.now();
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    elapsed += delta;

    // 1. Exponential camera fly-to damping
    if (flyActive) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCam.x, 4.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCam.y, 4.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCam.z, 4.5, delta);
      controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, 5.0, delta);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, 5.0, delta);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, 5.0, delta);
      if (
        camera.position.distanceTo(_targetCam) < 0.08 &&
        controls.target.distanceTo(_targetLook) < 0.08
      ) {
        flyActive = false;
      }
    }

    // 2. Smooth lighting, environment intensity, exposure & fog interpolation
    const lightLerpSpeed = isSoftwareGl ? 10 : 5.5;
    const colorLerpFactor = 1 - Math.exp(-lightLerpSpeed * delta);
    _targetColor.setHex(activePreset.skyHex);
    (scene.background as THREE.Color).lerp(_targetColor, colorLerpFactor);
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(scene.background as THREE.Color);
      scene.fog.density = THREE.MathUtils.damp(
        scene.fog.density,
        activePreset.fogDensity,
        lightLerpSpeed,
        delta
      );
    }
    sunLight.position.x = THREE.MathUtils.damp(sunLight.position.x, activePreset.sunPos[0], lightLerpSpeed, delta);
    sunLight.position.y = THREE.MathUtils.damp(sunLight.position.y, activePreset.sunPos[1], lightLerpSpeed, delta);
    sunLight.position.z = THREE.MathUtils.damp(sunLight.position.z, activePreset.sunPos[2], lightLerpSpeed, delta);
    sunLight.intensity = THREE.MathUtils.damp(sunLight.intensity, activePreset.sunIntensity, lightLerpSpeed, delta);
    _targetColor.setHex(activePreset.sunColor);
    sunLight.color.lerp(_targetColor, colorLerpFactor);

    hemiLight.intensity = THREE.MathUtils.damp(hemiLight.intensity, activePreset.hemiIntensity, lightLerpSpeed, delta);
    _targetColor.setHex(activePreset.hemiSky);
    hemiLight.color.lerp(_targetColor, colorLerpFactor);
    _targetColor.setHex(activePreset.hemiGround);
    hemiLight.groundColor.lerp(_targetColor, colorLerpFactor);

    scene.environmentIntensity = THREE.MathUtils.damp(
      scene.environmentIntensity,
      activePreset.environmentIntensity,
      lightLerpSpeed,
      delta
    );
    renderer.toneMappingExposure = THREE.MathUtils.damp(
      renderer.toneMappingExposure,
      activePreset.exposure,
      lightLerpSpeed,
      delta
    );
    matWindowGlass.emissiveIntensity = THREE.MathUtils.damp(
      matWindowGlass.emissiveIntensity,
      activePreset.windowEmissiveIntensity,
      lightLerpSpeed,
      delta
    );
    lampMat.emissiveIntensity = THREE.MathUtils.damp(
      lampMat.emissiveIntensity,
      activePreset.streetLampIntensity,
      lightLerpSpeed,
      delta
    );

    // Subtle selection ring breath
    if (selectionRing.visible) {
      selectionRingMat.opacity = 0.72 + Math.sin(elapsed * 3.0) * 0.2;
    }

    // 3. Living Campus Shuttles on H-12 Ring Road
    for (let i = 0; i < shuttles.length; i++) {
      const t = (elapsed * 0.022 + i / shuttles.length) % 1;
      shuttleCurve.getPointAt(t, _busPos);
      shuttleCurve.getTangentAt(t, _busTangent);
      shuttles[i].position.copy(_busPos);
      _busLook.copy(_busPos).add(_busTangent);
      shuttles[i].lookAt(_busLook);
    }

    // 4. Water shimmer & flag flutter
    textures.waterNormal.offset.x = (elapsed * 0.03) % 1;
    textures.waterNormal.offset.y = (elapsed * 0.02) % 1;
    for (let i = 0; i < animatedFlags.length; i++) {
      animatedFlags[i].rotation.y = Math.sin(elapsed * 3.2 + i) * 0.16;
    }
    if (fountainWaterRing) {
      fountainWaterRing.rotation.y = elapsed * 0.25;
    }

    controls.update();
    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }
  }

  frameId = requestAnimationFrame(tick);

  return {
    focusLandmark(landmarkId: string | 'overview') {
      if (landmarkId === 'overview') {
        selectedId = null;
        updateSelectionRing(null);
        _targetCam.set(...OVERVIEW_PRESET.cameraPos);
        _targetLook.set(...OVERVIEW_PRESET.targetPos);
        flyActive = true;
        callbacks.onSelectLandmark?.(null);
        return;
      }
      const lm = CAMPUS_LANDMARKS.find((item) => item.id === landmarkId);
      if (!lm) return;
      selectedId = lm.id;
      updateSelectionRing(lm);
      _targetCam.set(...lm.cameraPos);
      _targetLook.set(...lm.targetPos);
      flyActive = true;
      callbacks.onSelectLandmark?.(lm);
    },
    setLightingPreset(presetId: LightingPresetId) {
      activePreset = LIGHTING_PRESETS[presetId];
    },
    setAutoOrbit(enabled: boolean) {
      controls.autoRotate = !isSoftwareGl && enabled;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', stopFly);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      textures.dispose();
      envRenderTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
