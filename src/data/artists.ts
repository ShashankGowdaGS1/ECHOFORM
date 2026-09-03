export interface Artist {
  id: string;
  name: string;
  tagline: string;
  genre: string;
  stage: 'CORE' | 'VOID' | 'SIGNAL';
  day: 'SEP 18' | 'SEP 19';
  time: string;
  frequency: string;
  country: string;
  image: string;
  featured: boolean;
  statement: string;
  specs: {
    format: string;
    spatialChannels: string;
    bpmRange: string;
  };
}

export const FEATURED_ARTISTS: Artist[] = [
  {
    id: 'aera',
    name: 'AERA',
    tagline: 'Deconstructed Spatial Techno & Volumetric Frequency',
    genre: 'Spatial Techno / Deconstructed Rhythm',
    stage: 'CORE',
    day: 'SEP 18',
    time: '23:00 — 01:00',
    frequency: '432 Hz // SUB-OCTAVE',
    country: 'BER / DE',
    image: '/assets/images/artist-aera.jpg',
    featured: true,
    statement: 'Acoustic architecture collapses into high-velocity sub-bass geometry.',
    specs: {
      format: 'Live 64-Channel Spatial Audio',
      spatialChannels: '64.4 Meyer Sound L-Acoustics',
      bpmRange: '136 — 144 BPM',
    },
  },
  {
    id: 'mono-form',
    name: 'MONO/FORM',
    tagline: 'Analog Monolith & Industrial Waveform Synthesis',
    genre: 'Architectural Ambient / Minimal Drone',
    stage: 'VOID',
    day: 'SEP 18',
    time: '21:30 — 23:00',
    frequency: '108 Hz // MONOLITHIC',
    country: 'TKO / JP',
    image: '/assets/images/artist-monoform.jpg',
    featured: true,
    statement: 'Slow-moving acoustic density carving physical mass out of the void.',
    specs: {
      format: 'Quadraphonic Modular Synthesis',
      spatialChannels: '32.2 Point Source Arrays',
      bpmRange: '90 — 115 BPM',
    },
  },
  {
    id: 'nova-kai',
    name: 'NOVA KAI',
    tagline: 'Kinetic Light Translation & Hyper-dimensional Club',
    genre: 'Audiovisual Live / Hyper-Breakbeat',
    stage: 'CORE',
    day: 'SEP 19',
    time: '00:30 — 02:30',
    frequency: '528 Hz // VOLUMETRIC',
    country: 'LDN / UK',
    image: '/assets/images/artist-novakai.jpg',
    featured: true,
    statement: 'High-frequency laser projection linked directly to micro-tonal synthesizer voltage.',
    specs: {
      format: 'Realtime Laser Reactive AV',
      spatialChannels: '64.4 Spatial Surround',
      bpmRange: '140 — 160 BPM',
    },
  },
  {
    id: 'resonant',
    name: 'RESONANT',
    tagline: 'Cymatic Sound Sculpture & Deep Subharmonic Fields',
    genre: 'Subharmonic Ambient / Micro-Sound',
    stage: 'VOID',
    day: 'SEP 19',
    time: '20:00 — 21:45',
    frequency: '43.6 Hz // INFRA-SONIC',
    country: 'BLR / IN',
    image: '/assets/images/artist-resonant.jpg',
    featured: true,
    statement: 'Exploring tactile sound resonance beneath the threshold of human hearing.',
    specs: {
      format: 'Infrasonic Sub-Bass System',
      spatialChannels: '16.8 Sub-transducer Grid',
      bpmRange: 'Free Tempo / Drone',
    },
  },
  {
    id: 'vara',
    name: 'VARA',
    tagline: 'Modular Polyphony & Hypnotic Percussive Rhythms',
    genre: 'Modular Hypnotic / Experimental Polyphony',
    stage: 'SIGNAL',
    day: 'SEP 18',
    time: '19:30 — 21:00',
    frequency: '216 Hz // HARMONIC',
    country: 'CPH / DK',
    image: '/assets/images/artist-vara.jpg',
    featured: true,
    statement: 'Intricate clock-divider rhythms propagating through an open-air canopy.',
    specs: {
      format: 'Live Patch Modular Performance',
      spatialChannels: '24.2 Wide Field Line Array',
      bpmRange: '128 — 134 BPM',
    },
  },
  {
    id: 'ix',
    name: 'IX',
    tagline: 'Hardware Brutalism & Heavy Darkwave Dynamics',
    genre: 'Hardware Industrial / Raw Signal',
    stage: 'VOID',
    day: 'SEP 19',
    time: '22:00 — 23:45',
    frequency: '88 Hz // INDUSTRIAL',
    country: 'NYC / US',
    image: '/assets/images/artist-ix.jpg',
    featured: true,
    statement: 'Pure hardware feedback loops tearing through cavernous concrete chambers.',
    specs: {
      format: 'Pure Analog Drum Machine & Synth Rig',
      spatialChannels: '32.2 Monolithic Rig',
      bpmRange: '138 — 146 BPM',
    },
  },
];

export const ALL_ARTISTS: { id: string; name: string; stage: string; origin: string; time: string; day: string }[] = [
  { id: 'aera', name: 'AERA', stage: 'CORE', origin: 'BER', time: '23:00', day: 'SEP 18' },
  { id: 'mono-form', name: 'MONO/FORM', stage: 'VOID', origin: 'TKO', time: '21:30', day: 'SEP 18' },
  { id: 'nova-kai', name: 'NOVA KAI', stage: 'CORE', origin: 'LDN', time: '00:30', day: 'SEP 19' },
  { id: 'resonant', name: 'RESONANT', stage: 'VOID', origin: 'BLR', time: '20:00', day: 'SEP 19' },
  { id: 'vara', name: 'VARA', stage: 'SIGNAL', origin: 'CPH', time: '19:30', day: 'SEP 18' },
  { id: 'ix', name: 'IX', stage: 'VOID', origin: 'NYC', time: '22:00', day: 'SEP 19' },
  { id: 'nima', name: 'NIMA', stage: 'SIGNAL', origin: 'PAR', time: '18:00', day: 'SEP 18' },
  { id: 'kallisti', name: 'KALLISTI', stage: 'CORE', origin: 'ATH', time: '19:00', day: 'SEP 18' },
  { id: 'omni-flux', name: 'OMNI FLUX', stage: 'SIGNAL', origin: 'BLR', time: '21:00', day: 'SEP 18' },
  { id: 'zero-g', name: 'ZERO/G', stage: 'VOID', origin: 'STO', time: '18:30', day: 'SEP 18' },
  { id: 'catenary', name: 'CATENARY', stage: 'CORE', origin: 'SEO', time: '20:45', day: 'SEP 18' },
  { id: 'phase-shift', name: 'PHASE SHIFT', stage: 'SIGNAL', origin: 'AMS', time: '22:45', day: 'SEP 18' },
  { id: 'tensor', name: 'TENSOR', stage: 'CORE', origin: 'ZRH', time: '18:00', day: 'SEP 19' },
  { id: 'anode', name: 'ANODE', stage: 'VOID', origin: 'OSL', time: '19:00', day: 'SEP 19' },
  { id: 'surface-mesh', name: 'SURFACE MESH', stage: 'SIGNAL', origin: 'MUM', time: '19:30', day: 'SEP 19' },
  { id: 'vector-h', name: 'VECTOR-H', stage: 'CORE', origin: 'TYO', time: '21:00', day: 'SEP 19' },
  { id: 'spectral-grid', name: 'SPECTRAL GRID', stage: 'SIGNAL', origin: 'BLR', time: '21:15', day: 'SEP 19' },
  { id: 'sub-zero', name: 'SUB:ZERO', stage: 'VOID', origin: 'BER', time: '23:45', day: 'SEP 19' },
  { id: 'echo-plex', name: 'ECHOPLEX 9', stage: 'CORE', origin: 'MEL', time: '22:30', day: 'SEP 18' },
  { id: 'd-void', name: 'D_VOID', stage: 'VOID', origin: 'VIE', time: '00:15', day: 'SEP 18' },
  { id: 'lumina', name: 'LUMINA', stage: 'SIGNAL', origin: 'BLR', time: '00:00', day: 'SEP 18' },
  { id: 'knot-work', name: 'KNOTWORK', stage: 'SIGNAL', origin: 'HEL', time: '23:00', day: 'SEP 19' },
  { id: 'mod-null', name: 'MOD/NULL', stage: 'CORE', origin: 'BOG', time: '19:45', day: 'SEP 19' },
  { id: 'final-signal', name: 'FINAL SIGNAL', stage: 'ALL', origin: 'GLOBAL', time: '02:00', day: 'SEP 19' },
];
