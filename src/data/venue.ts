export interface VenueZone {
  id: string;
  name: string;
  code: string;
  coordinates: string;
  soundPressure: string;
  description: string;
  specs: string;
}

export const VENUE_ZONES: VenueZone[] = [
  {
    id: 'entry',
    name: 'RESONANCE ENTRY GATE',
    code: 'ZONE_00',
    coordinates: '12.9712° N, 77.5938° E',
    soundPressure: '75 dB // CALIBRATED AMBIENT',
    description: 'The monumental physical aperture where sound frequency calibration begins. Concentric architectural arches guide arrivals through acoustic ionization.',
    specs: 'RFID Token Validation & Decompression Corridor',
  },
  {
    id: 'core-arena',
    name: 'STAGE: CORE ARENA',
    code: 'ZONE_01',
    coordinates: '12.9724° N, 77.5952° E',
    soundPressure: '106 dB // 64.4 SPATIAL FIELD',
    description: 'Cathedral-scale monolithic warehouse with 24-meter suspended concentric kinetic sound ring and full 360-degree laser matrix.',
    specs: 'Meyer Sound SpaceMap 64-Channel Surround Field',
  },
  {
    id: 'void-bunker',
    name: 'STAGE: VOID BUNKER',
    code: 'ZONE_02',
    coordinates: '12.9708° N, 77.5961° E',
    soundPressure: '112 dB // INFRASONIC BASS',
    description: 'Subterranean cast-concrete vault engineered for ultra-low frequency exploration. Absolute zero light pollution with single laser altar.',
    specs: 'Underground Infrasonic Transducer System (<20Hz)',
  },
  {
    id: 'signal-canopy',
    name: 'STAGE: SIGNAL CANOPY',
    code: 'ZONE_03',
    coordinates: '12.9731° N, 77.5935° E',
    soundPressure: '102 dB // OPEN-AIR FIELD',
    description: '60-meter geometric titanium cantilever canopy over an open natural bowl under Bengaluru night skies.',
    specs: 'd&b Soundscape Wide-Angle Array',
  },
  {
    id: 'art-district',
    name: 'DIGITAL ARTS PAVILIONS',
    code: 'ZONE_04',
    coordinates: '12.9719° N, 77.5944° E',
    soundPressure: '82 dB // GENERATIVE AUDIO',
    description: 'Seven interconnected architectural pavilions housing generative light installations, cymatic sculptures, and interactive spatial rooms.',
    specs: 'Laser Volumetric Projection & Touch Reactive Panels',
  },
  {
    id: 'rest-commons',
    name: 'ACOUSTIC RECOVERY COMMONS',
    code: 'ZONE_05',
    coordinates: '12.9702° N, 77.5949° E',
    soundPressure: '55 dB // ISO-CHRONIC PINK NOISE',
    description: 'Engineered quiet recovery zone with local artisanal cuisine, clean hydration stations, and low-frequency pink noise relaxation pads.',
    specs: 'Acoustically Isolated Architectural Domes',
  },
];
