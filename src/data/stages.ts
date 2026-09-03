export interface Stage {
  id: string;
  name: string;
  code: string;
  type: string;
  acousticProfile: string;
  dimensions: string;
  capacity: string;
  soundEngine: string;
  image: string;
  description: string;
  features: string[];
}

export const STAGES_DATA: Stage[] = [
  {
    id: 'core',
    name: 'CORE',
    code: 'STAGE_01 // MONOLITH',
    type: 'Main Audiovisual Arena',
    acousticProfile: 'Volumetric 64.4 Spatial Soundfield',
    dimensions: '75m x 48m x 18m Cathedral Span',
    capacity: '4,500 Capacitance',
    soundEngine: 'Meyer Sound SpaceMap Go + L-ISA Immersive Hyperdense Arrays',
    image: '/assets/images/stage-core.jpg',
    description: 'The monumental epicenter of ECHOFORM. A massive concrete & blackened titanium cathedral dominated by a 24-meter suspended concentric acoustic ring and horizontal violet/cyan laser matrices.',
    features: [
      '24m Suspended Kinetic Acoustic Ring',
      '64-Channel Spatialized Audio Matrix',
      'Dual-Wavelength Solid-State Laser Rig',
      'Anisotropic Sound Damping Baffles',
    ],
  },
  {
    id: 'void',
    name: 'VOID',
    code: 'STAGE_02 // SUBTERRANEAN',
    type: 'Dark Experimental Chamber',
    acousticProfile: 'Sub-Bass & Infrasonic Pressure Field',
    dimensions: '42m x 32m x 12m Underground Vault',
    capacity: '1,800 Capacitance',
    soundEngine: 'Custom Danley Sound Labs Infrasonic Sub-Grid (< 20Hz Response)',
    image: '/assets/images/stage-void.jpg',
    description: 'A subterranean cast-concrete vault stripped of all decorative lighting. Monolithic concrete pillars house hidden transducer arrays that vibrate the floor and body at fundamental resonant frequencies.',
    features: [
      'Infrasonic Floor-Transducer Grid',
      'Zero-Ambient Light Architecture',
      'Single Monolithic Slit Laser Column',
      'Near-Zero Reverberation Acoustic Treatment',
    ],
  },
  {
    id: 'signal',
    name: 'SIGNAL',
    code: 'STAGE_03 // CANOPY',
    type: 'Open-Air Performance Amphitheater',
    acousticProfile: 'Wide-Field Geometric Projection',
    dimensions: 'Open Amphitheater / 60m Cantilever Span',
    capacity: '3,200 Capacitance',
    soundEngine: 'd&b audiotechnik Soundscape Open-Air Precision Arrays',
    image: '/assets/images/stage-signal.jpg',
    description: 'An open-air amphitheater sheltered by a monumental geometric titanium cantilever canopy. Laser projections trace structural vertices into the midnight sky above Bengaluru.',
    features: [
      '60m Cantilever Geometric Canopy',
      'Volumetric Ground Mist Distribution',
      'Stellar Sky Alignment Architecture',
      'Open-Air Spatial Projection Arrays',
    ],
  },
];
