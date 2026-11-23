import * as THREE from 'three';

export interface CampusTextureSet {
  facadeAcademic: THREE.CanvasTexture;
  facadeGlass: THREE.CanvasTexture;
  facadeSolar: THREE.CanvasTexture;
  roadAsphalt: THREE.CanvasTexture;
  lawnGrass: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  waterNormal: THREE.CanvasTexture;
  dispose: () => void;
}

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context unavailable');
  }
  return [canvas, ctx];
}

function configureColorTexture(
  canvas: HTMLCanvasElement,
  repeatX: number,
  repeatY: number,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createCampusTextures(maxAnisotropy: number): CampusTextureSet {
  // 1. Academic limestone + recessed window grid facade
  const [acadCanvas, acadCtx] = createCanvas(256, 256);
  acadCtx.fillStyle = '#e7e2d6';
  acadCtx.fillRect(0, 0, 256, 256);
  // Concrete spandrel bands
  for (let row = 0; row < 4; row++) {
    const y = row * 64;
    acadCtx.fillStyle = '#d3cdc0';
    acadCtx.fillRect(0, y, 256, 12);
    // Window bays
    for (let col = 0; col < 6; col++) {
      const x = col * 42 + 6;
      acadCtx.fillStyle = '#1c4068';
      acadCtx.fillRect(x, y + 18, 30, 38);
      // Mullion highlight
      acadCtx.fillStyle = '#5f87b0';
      acadCtx.fillRect(x + 2, y + 20, 12, 34);
    }
  }
  const facadeAcademic = configureColorTexture(acadCanvas, 2, 1, maxAnisotropy);

  // 2. Modern NUST / NSTP curtain-wall glass texture
  const [glassCanvas, glassCtx] = createCanvas(256, 256);
  glassCtx.fillStyle = '#0c2c4f';
  glassCtx.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const shade = (row + col) % 3 === 0 ? '#1b4e80' : '#133b66';
      glassCtx.fillStyle = shade;
      glassCtx.fillRect(col * 32 + 2, row * 32 + 2, 28, 28);
    }
  }
  glassCtx.strokeStyle = '#7098be';
  glassCtx.lineWidth = 2;
  for (let i = 0; i <= 256; i += 32) {
    glassCtx.beginPath();
    glassCtx.moveTo(i, 0);
    glassCtx.lineTo(i, 256);
    glassCtx.stroke();
    glassCtx.beginPath();
    glassCtx.moveTo(0, i);
    glassCtx.lineTo(256, i);
    glassCtx.stroke();
  }
  const facadeGlass = configureColorTexture(glassCanvas, 2, 2, maxAnisotropy);

  // 3. Photovoltaic solar panel grid for USPCAS-E & SEECS canopies
  const [solarCanvas, solarCtx] = createCanvas(256, 256);
  solarCtx.fillStyle = '#0f284a';
  solarCtx.fillRect(0, 0, 256, 256);
  solarCtx.strokeStyle = '#89b4e3';
  solarCtx.lineWidth = 2;
  for (let i = 0; i <= 256; i += 32) {
    solarCtx.beginPath();
    solarCtx.moveTo(i, 0);
    solarCtx.lineTo(i, 256);
    solarCtx.stroke();
    solarCtx.beginPath();
    solarCtx.moveTo(0, i);
    solarCtx.lineTo(256, i);
    solarCtx.stroke();
  }
  const facadeSolar = configureColorTexture(solarCanvas, 2, 1, maxAnisotropy);

  // 4. Asphalt boulevard road with center dashed markings
  const [roadCanvas, roadCtx] = createCanvas(256, 256);
  roadCtx.fillStyle = '#333b44';
  roadCtx.fillRect(0, 0, 256, 256);
  // Subtle aggregate grain
  for (let i = 0; i < 900; i++) {
    roadCtx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.08)';
    roadCtx.fillRect((i * 73) % 256, (i * 41) % 256, 2, 2);
  }
  // Edge curbs & center dashes
  roadCtx.fillStyle = '#d4dae2';
  roadCtx.fillRect(6, 0, 4, 256);
  roadCtx.fillRect(246, 0, 4, 256);
  roadCtx.fillStyle = '#f0c75e';
  for (let y = 12; y < 256; y += 48) {
    roadCtx.fillRect(126, y, 4, 24);
  }
  const roadAsphalt = configureColorTexture(roadCanvas, 1, 14, maxAnisotropy);

  // 5. H-12 manicured campus lawn texture
  const [lawnCanvas, lawnCtx] = createCanvas(256, 256);
  lawnCtx.fillStyle = '#5c844a';
  lawnCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1400; i++) {
    const x = (i * 59) % 256;
    const y = (i * 97) % 256;
    lawnCtx.fillStyle = i % 3 === 0 ? '#689354' : i % 3 === 1 ? '#4f753e' : '#739e5d';
    lawnCtx.fillRect(x, y, 4, 4);
  }
  const lawnGrass = configureColorTexture(lawnCanvas, 28, 28, maxAnisotropy);

  // 6. Soft radial contact shadow
  const [shadowCanvas, shadowCtx] = createCanvas(128, 128);
  const grad = shadowCtx.createRadialGradient(64, 64, 8, 64, 64, 62);
  grad.addColorStop(0, 'rgba(0, 18, 38, 0.48)');
  grad.addColorStop(0.55, 'rgba(0, 18, 38, 0.18)');
  grad.addColorStop(1, 'rgba(0, 18, 38, 0)');
  shadowCtx.fillStyle = grad;
  shadowCtx.fillRect(0, 0, 128, 128);
  const contactShadow = new THREE.CanvasTexture(shadowCanvas);
  contactShadow.colorSpace = THREE.SRGBColorSpace;
  contactShadow.needsUpdate = true;

  // 7. Linear normal map for NUST Lake water shimmer (NoColorSpace)
  const [waterCanvas, waterCtx] = createCanvas(128, 128);
  waterCtx.fillStyle = 'rgb(128, 128, 255)';
  waterCtx.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 4) {
    for (let x = 0; x < 128; x += 4) {
      const nx = Math.floor(128 + Math.sin(x * 0.25 + y * 0.12) * 18);
      const ny = Math.floor(128 + Math.cos(y * 0.28 - x * 0.1) * 18);
      waterCtx.fillStyle = `rgb(${nx}, ${ny}, 255)`;
      waterCtx.fillRect(x, y, 4, 4);
    }
  }
  const waterNormal = new THREE.CanvasTexture(waterCanvas);
  waterNormal.colorSpace = THREE.NoColorSpace;
  waterNormal.wrapS = THREE.RepeatWrapping;
  waterNormal.wrapT = THREE.RepeatWrapping;
  waterNormal.repeat.set(4, 4);
  waterNormal.needsUpdate = true;

  return {
    facadeAcademic,
    facadeGlass,
    facadeSolar,
    roadAsphalt,
    lawnGrass,
    contactShadow,
    waterNormal,
    dispose: () => {
      facadeAcademic.dispose();
      facadeGlass.dispose();
      facadeSolar.dispose();
      roadAsphalt.dispose();
      lawnGrass.dispose();
      contactShadow.dispose();
      waterNormal.dispose();
    },
  };
}
