import React, { useState, useEffect } from 'react';
import { ResonanceRingSymbol } from './ResonanceRingSymbol';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Elegant, fast preloader sequence (~300ms + 350ms fade)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 25;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFading(true);
            setTimeout(() => {
              setIsUnmounted(true);
              if (onComplete) onComplete();
            }, 350);
          }, 100);
          return 100;
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isUnmounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] bg-[#050506] flex flex-col items-center justify-center p-8 transition-opacity duration-500 pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="animate-spin-slow">
          <ResonanceRingSymbol size={80} glow />
        </div>

        <div className="space-y-2">
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
            className="text-2xl sm:text-3xl text-[#F0F0EC] uppercase tracking-tighter"
          >
            ECHOFORM
          </div>
          <div className="font-mono text-[11px] text-[#72E4FF] tracking-[0.25em] uppercase">
            INITIALIZING {progress}%
          </div>
        </div>
      </div>
    </div>
  );
};
