import React from 'react';

interface ResonanceRingSymbolProps {
  size?: number | string;
  className?: string;
  glow?: boolean;
}

export const ResonanceRingSymbol: React.FC<ResonanceRingSymbolProps> = ({
  size = 36,
  className = '',
  glow = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'filter drop-shadow-[0_0_12px_rgba(120,103,255,0.6)]' : ''}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Outer Ring 1: Fragmented Titanium */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="#F0F0EC"
        strokeWidth="2"
        strokeDasharray="180 96"
        strokeLinecap="square"
        opacity="0.85"
      />
      {/* Middle Ring 2: Resonance Violet Conduit */}
      <circle
        cx="50"
        cy="50"
        r="34"
        stroke="#7867FF"
        strokeWidth="2.5"
        strokeDasharray="130 84"
        strokeLinecap="square"
      />
      {/* Inner Ring 3: Ion Blue Edge */}
      <circle
        cx="50"
        cy="50"
        r="24"
        stroke="#72E4FF"
        strokeWidth="2"
        strokeDasharray="90 60"
        strokeLinecap="square"
      />
      {/* Core Ring 4: Precision Hairline */}
      <circle
        cx="50"
        cy="50"
        r="14"
        stroke="#F0F0EC"
        strokeWidth="1.5"
        strokeDasharray="45 42"
        opacity="0.9"
      />
      {/* Central Singularity Point */}
      <circle cx="50" cy="50" r="3.5" fill="#72E4FF" />
    </svg>
  );
};
