export const RESONANCE_FRAME_COUNT = 128;

export const RESONANCE_FRAME_URLS: string[] = Array.from(
  { length: RESONANCE_FRAME_COUNT },
  (_, i) => `/assets/frames/resonance-gate/frame_${String(i + 1).padStart(4, '0')}.webp`
);
