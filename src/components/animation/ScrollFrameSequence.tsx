import React, { useRef } from 'react';
import { useFramePreloader } from '../../hooks/useFramePreloader';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';

export interface ScrollFrameSequenceProps {
  progress: number;
  frameUrls: string[];
  fallbackPoster?: string;
  dprCap?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ScrollFrameSequence: React.FC<ScrollFrameSequenceProps> = ({
  progress,
  frameUrls,
  fallbackPoster = '/assets/images/resonance-gate-hero.jpg',
  dprCap = 2,
  className = '',
  style = {},
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preload and cache all frames
  const { isReady, getFrame } = useFramePreloader(frameUrls);

  // Map normalized progress (0..1) to frame index (0..total-1)
  const totalFrames = frameUrls.length;
  const targetIndex = totalFrames > 0
    ? Math.min(Math.max(0, Math.floor(progress * (totalFrames - 1))), totalFrames - 1)
    : 0;

  const currentImage = getFrame(targetIndex);

  // High-DPI canvas rendering
  useCanvasRenderer(canvasRef, currentImage, { dprCap });

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-[#050506] select-none ${className}`}
      style={style}
    >
      {/* Fallback poster image until canvas frame 1 is decoded */}
      {(!isReady || !currentImage) && fallbackPoster && (
        <img
          src={fallbackPoster}
          alt="Resonance Gate Visual"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="eager"
        />
      )}

      {/* Main High-DPI Canvas Renderer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isReady && currentImage ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Subtle Noise / Depth Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(5, 5, 6, 0.75) 95%)',
        }}
        aria-hidden="true"
      />

      {/* Overlays / Narrative Choreography Layer */}
      {children}
    </div>
  );
};
