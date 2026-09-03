export interface ScheduleItem {
  id: string;
  day: 'SEP 18' | 'SEP 19';
  time: string;
  artist: string;
  stage: 'CORE' | 'VOID' | 'SIGNAL';
  frequency: string;
  genre: string;
  isHeadliner?: boolean;
}

export const SCHEDULE_DATA: ScheduleItem[] = [
  // DAY 1 — SEP 18
  { id: 's1-1', day: 'SEP 18', time: '18:00', artist: 'NIMA', stage: 'SIGNAL', frequency: '174 Hz', genre: 'Downtempo Ambient' },
  { id: 's1-2', day: 'SEP 18', time: '18:30', artist: 'ZERO/G', stage: 'VOID', frequency: '55 Hz', genre: 'Subharmonic Drone' },
  { id: 's1-3', day: 'SEP 18', time: '19:00', artist: 'KALLISTI', stage: 'CORE', frequency: '285 Hz', genre: 'Audiovisual Intro' },
  { id: 's1-4', day: 'SEP 18', time: '19:30', artist: 'VARA', stage: 'SIGNAL', frequency: '216 Hz', genre: 'Modular Hypnotic', isHeadliner: true },
  { id: 's1-5', day: 'SEP 18', time: '20:45', artist: 'CATENARY', stage: 'CORE', frequency: '396 Hz', genre: 'Deconstructed Spatial' },
  { id: 's1-6', day: 'SEP 18', time: '21:00', artist: 'OMNI FLUX', stage: 'SIGNAL', frequency: '432 Hz', genre: 'Generative Electro' },
  { id: 's1-7', day: 'SEP 18', time: '21:30', artist: 'MONO/FORM', stage: 'VOID', frequency: '108 Hz', genre: 'Analog Monolith Live', isHeadliner: true },
  { id: 's1-8', day: 'SEP 18', time: '22:30', artist: 'ECHOPLEX 9', stage: 'CORE', frequency: '528 Hz', genre: 'Spatial Breaks' },
  { id: 's1-9', day: 'SEP 18', time: '22:45', artist: 'PHASE SHIFT', stage: 'SIGNAL', frequency: '312 Hz', genre: 'Laser Modular' },
  { id: 's1-10', day: 'SEP 18', time: '23:00', artist: 'AERA', stage: 'CORE', frequency: '432 Hz', genre: 'Spatial Techno Keynote', isHeadliner: true },
  { id: 's1-11', day: 'SEP 18', time: '00:00', artist: 'LUMINA', stage: 'SIGNAL', frequency: '639 Hz', genre: 'Midnight Canopy Set' },
  { id: 's1-12', day: 'SEP 18', time: '00:15', artist: 'D_VOID', stage: 'VOID', frequency: '42 Hz', genre: 'Late-Night Subpressure' },

  // DAY 2 — SEP 19
  { id: 's2-1', day: 'SEP 19', time: '18:00', artist: 'TENSOR', stage: 'CORE', frequency: '174 Hz', genre: 'Spatial Opening' },
  { id: 's2-2', day: 'SEP 19', time: '19:00', artist: 'ANODE', stage: 'VOID', frequency: '62 Hz', genre: 'Industrial Texture' },
  { id: 's2-3', day: 'SEP 19', time: '19:30', artist: 'SURFACE MESH', stage: 'SIGNAL', frequency: '285 Hz', genre: 'Polyrhythmic Modular' },
  { id: 's2-4', day: 'SEP 19', time: '19:45', artist: 'MOD/NULL', stage: 'CORE', frequency: '396 Hz', genre: 'Volumetric Pulse' },
  { id: 's2-5', day: 'SEP 19', time: '20:00', artist: 'RESONANT', stage: 'VOID', frequency: '43.6 Hz', genre: 'Infrasonic Cymatics', isHeadliner: true },
  { id: 's2-6', day: 'SEP 19', time: '21:00', artist: 'VECTOR-H', stage: 'CORE', frequency: '528 Hz', genre: 'Spatial Audio Matrix' },
  { id: 's2-7', day: 'SEP 19', time: '21:15', artist: 'SPECTRAL GRID', stage: 'SIGNAL', frequency: '432 Hz', genre: 'Generative AV Live' },
  { id: 's2-8', day: 'SEP 19', time: '22:00', artist: 'IX', stage: 'VOID', frequency: '88 Hz', genre: 'Hardware Brutalism', isHeadliner: true },
  { id: 's2-9', day: 'SEP 19', time: '23:00', artist: 'KNOTWORK', stage: 'SIGNAL', frequency: '316 Hz', genre: 'Complex Percussive Live' },
  { id: 's2-10', day: 'SEP 19', time: '23:45', artist: 'SUB:ZERO', stage: 'VOID', frequency: '36 Hz', genre: 'Deep Cavern Sub' },
  { id: 's2-11', day: 'SEP 19', time: '00:30', artist: 'NOVA KAI', stage: 'CORE', frequency: '528 Hz', genre: 'Volumetric Laser AV Finale', isHeadliner: true },
  { id: 's2-12', day: 'SEP 19', time: '02:00', artist: 'FINAL SIGNAL', stage: 'CORE', frequency: '963 Hz', genre: 'All-Stage Spatial Closing Convergence' },
];
