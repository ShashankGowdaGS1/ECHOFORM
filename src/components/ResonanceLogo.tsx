import React from 'react';
import { ResonanceRingSymbol } from './ResonanceRingSymbol';

interface ResonanceLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ResonanceLogo: React.FC<ResonanceLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const textSizeClass =
    size === 'sm'
      ? 'text-xl tracking-tight'
      : size === 'lg'
      ? 'text-4xl md:text-5xl tracking-tighter'
      : 'text-2xl tracking-tighter';

  const ringSize = size === 'sm' ? 18 : size === 'lg' ? 36 : 22;

  return (
    <a
      href="#hero"
      className={`inline-flex items-center gap-2 group select-none ${className}`}
      aria-label="ECHOFORM Home"
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: 'var(--color-lunar-white)',
          letterSpacing: '-0.03em',
        }}
        className={`${textSizeClass} flex items-center`}
      >
        ECH
        <span className="inline-flex items-center justify-center mx-[2px] transition-transform duration-500 group-hover:rotate-90">
          <ResonanceRingSymbol size={ringSize} glow />
        </span>
        FORM
      </span>
    </a>
  );
};
