import type { SchoolCode } from '../data/nustData';

export type LightingPresetId = 'morning' | 'golden' | 'dusk';

export interface CampusLandmarkSpec {
  id: string;
  shortLabel: string;
  name: string;
  zone: string;
  description: string;
  highlights: string;
  /** World center position [x, y, z] in campus coordinates (1 unit ≈ 12m) */
  position: [number, number, number];
  /** Proxy bounding box size [w, h, d] for raycasting & ground ring */
  bounds: [number, number, number];
  /** Ideal camera eye position when inspecting this landmark */
  cameraPos: [number, number, number];
  /** OrbitControls lookAt target */
  targetPos: [number, number, number];
  /** Optional school filter link to jump directly to #programs */
  linkedSchool?: SchoolCode;
}

export const OVERVIEW_PRESET = {
  id: 'overview',
  shortLabel: 'Whole H-12',
  cameraPos: [46, 21, 52] as [number, number, number],
  targetPos: [0, 2.8, -6] as [number, number, number],
};

export const CAMPUS_LANDMARKS: CampusLandmarkSpec[] = [
  {
    id: 'main-office',
    shortLabel: 'Main Office',
    name: 'NUST Main Office & Rectorate',
    zone: 'Central Axis · Sector H-12',
    description:
      'Iconic glazed dome secretariat, ceremonial forecourt fountain, and central academic administration.',
    highlights: 'Rectorate Dome · Convocation Steps · Flag Plaza',
    position: [0, 0, -14],
    bounds: [12, 7.5, 9],
    cameraPos: [13, 10.5, 4],
    targetPos: [0, 2.5, -14],
  },
  {
    id: 'seecs',
    shortLabel: 'SEECS',
    name: 'School of Electrical Engg. & Computer Science (SEECS)',
    zone: 'Computing & AI Academic Zone',
    description:
      'Multi-wing courtyard complex housing Computer Science, Software Engineering, AI, and the National Centre of AI.',
    highlights: 'NCAI Cluster · Cloud & Systems Labs · Innovation Quad',
    position: [-19, 0, -6],
    bounds: [11, 5.2, 10],
    cameraPos: [-32, 11, 10],
    targetPos: [-19, 1.8, -6],
    linkedSchool: 'SEECS',
  },
  {
    id: 'smme',
    shortLabel: 'SMME',
    name: 'School of Mechanical & Manufacturing Engg. (SMME)',
    zone: 'Engineering & Robotics Quadrant',
    description:
      'North-light sawtooth engineering bays, wind tunnel, CNC labs, and the National Centre of Robotics & Automation.',
    highlights: 'NCRA Robotics Arena · Formula Racing Bay · Thermofluids',
    position: [-21, 0, 11],
    bounds: [11.5, 4.8, 9.5],
    cameraPos: [-34, 11, 24],
    targetPos: [-21, 1.6, 11],
    linkedSchool: 'SMME',
  },
  {
    id: 'nbs',
    shortLabel: 'NBS & S3H',
    name: 'NUST Business School (NBS) & Social Sciences (S3H)',
    zone: 'Eastern Academic Quadrangle',
    description:
      'Twin landscaped courtyard blocks hosting BBA/MBA finance labs alongside Economics, Policy, and Humanities.',
    highlights: 'Bloomberg Finance Lab · Policy Roundtables · Atrium Tower',
    position: [18, 0, -6],
    bounds: [12, 5.2, 9.5],
    cameraPos: [31, 11, 10],
    targetPos: [18, 1.8, -6],
    linkedSchool: 'NBS',
  },
  {
    id: 'sada',
    shortLabel: 'SADA',
    name: 'School of Art, Design & Architecture (SADA)',
    zone: 'Eastern Studio Terrace',
    description:
      'Cantilevered modernist studio decks, north-facing skylights, timber fabrication shops, and exhibition courtyard.',
    highlights: '5-Year B.Arch Studios · Fabrication Yard · Gallery Deck',
    position: [20, 0, 10],
    bounds: [10.5, 5.4, 9],
    cameraPos: [33, 11, 22],
    targetPos: [20, 1.8, 10],
    linkedSchool: 'SADA',
  },
  {
    id: 'uspcas',
    shortLabel: 'USPCAS-E',
    name: 'U.S.-Pakistan Center for Advanced Studies in Energy',
    zone: 'Northern Research Ridge',
    description:
      'Flagship clean-energy research complex crowned with angled photovoltaic arrays and smart-grid micro-inverter labs.',
    highlights: 'Solar Rooftop Array · Hydrogen & Storage Labs · Grid Testbed',
    position: [-14, 0, -24],
    bounds: [10, 4.6, 8],
    cameraPos: [-24, 10, -10],
    targetPos: [-14, 1.8, -24],
  },
  {
    id: 'nstp',
    shortLabel: 'NSTP',
    name: 'National Science & Technology Park (NSTP)',
    zone: 'Southern Innovation Corridor',
    description:
      'Pakistan’s first university-hosted IASP Special Technology Zone with 110+ tech firms, Cube 8, and multinational R&D.',
    highlights: 'Twin Innovation Towers · Hatch 8 · 110+ Tech Firms',
    position: [15, 0, 24],
    bounds: [14, 7.2, 9.5],
    cameraPos: [28, 13, 39],
    targetPos: [15, 2.5, 24],
  },
  {
    id: 'library',
    shortLabel: 'Central Library',
    name: 'Central Library & Jinnah Auditorium Precinct',
    zone: 'Academic Spine',
    description:
      'Glass-louvered knowledge rotunda and Jinnah Auditorium hosting national convocations and international symposia.',
    highlights: 'Jinnah Auditorium · Digital Archive · Convocation Lawn',
    position: [0, 0, 2],
    bounds: [10, 5.0, 9.5],
    cameraPos: [12, 10, 17],
    targetPos: [0, 1.8, 2],
  },
  {
    id: 'lake',
    shortLabel: 'NUST Lake',
    name: 'NUST Lake, Sports Complex & Hostels',
    zone: 'Western Residential & Ecological Zone',
    description:
      'Scenic campus lake, cricket oval, athletic track, and student residential hostels framed by the Margalla Hills.',
    highlights: 'NUST Lake · Cricket Oval · Razi & Fatima Hostels',
    position: [-33, 0, -14],
    bounds: [14, 3.5, 13],
    cameraPos: [-45, 13, 4],
    targetPos: [-32, 0.5, -13],
  },
];

export interface LightingPresetConfig {
  id: LightingPresetId;
  label: string;
  skyHex: number;
  fogHex: number;
  fogDensity: number;
  sunColor: number;
  sunIntensity: number;
  sunPos: [number, number, number];
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  environmentIntensity: number;
  exposure: number;
  windowEmissiveIntensity: number;
  streetLampIntensity: number;
}

export const LIGHTING_PRESETS: Record<LightingPresetId, LightingPresetConfig> = {
  morning: {
    id: 'morning',
    label: 'Islamabad Morning',
    skyHex: 0xd4e6f7,
    fogHex: 0xd4e6f7,
    fogDensity: 0.0072,
    sunColor: 0xfff5e4,
    sunIntensity: 2.35,
    sunPos: [48, 56, 36],
    hemiSky: 0xbfe0ff,
    hemiGround: 0x4b6248,
    hemiIntensity: 0.9,
    environmentIntensity: 0.88,
    exposure: 1.06,
    windowEmissiveIntensity: 0.1,
    streetLampIntensity: 0.05,
  },
  golden: {
    id: 'golden',
    label: 'Golden Hour',
    skyHex: 0xf2c99c,
    fogHex: 0xefc9a2,
    fogDensity: 0.0082,
    sunColor: 0xffa756,
    sunIntensity: 2.6,
    sunPos: [-58, 22, 28],
    hemiSky: 0xffcfa1,
    hemiGround: 0x3b4438,
    hemiIntensity: 0.72,
    environmentIntensity: 0.58,
    exposure: 1.02,
    windowEmissiveIntensity: 0.52,
    streetLampIntensity: 0.65,
  },
  dusk: {
    id: 'dusk',
    label: 'Margalla Dusk',
    skyHex: 0x0c1b33,
    fogHex: 0x0e203d,
    fogDensity: 0.0102,
    sunColor: 0x6f9ad8,
    sunIntensity: 0.62,
    sunPos: [-40, 30, -30],
    hemiSky: 0x2a4e7d,
    hemiGround: 0x0c1524,
    hemiIntensity: 0.38,
    environmentIntensity: 0.2,
    exposure: 0.95,
    windowEmissiveIntensity: 1.65,
    streetLampIntensity: 1.8,
  },
};
