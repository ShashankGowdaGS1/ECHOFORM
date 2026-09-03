import React, { useRef, useState, useEffect } from 'react';

interface FrequencyChargeButtonProps {
  href: string;
  label?: string;
  arrow?: string;
  intensity?: 'hero' | 'nav';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const FrequencyChargeButton: React.FC<FrequencyChargeButtonProps> = ({
  href,
  label = 'GET PASSES',
  arrow = '↗',
  intensity = 'hero',
  className = '',
  style = {},
  onClick,
}) => {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const maxMagnetic = intensity === 'hero' ? 4 : 2;
  const textOffset = intensity === 'hero' ? 3 : 1.5;
  const arrowDiagonal = intensity === 'hero' ? 5 : 2.5;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const relX = (e.clientX - centerX) / (rect.width / 2);
    const relY = (e.clientY - centerY) / (rect.height / 2);

    setOffset({
      x: Math.max(-maxMagnetic, Math.min(maxMagnetic, relX * maxMagnetic)),
      y: Math.max(-maxMagnetic, Math.min(maxMagnetic, relY * maxMagnetic)),
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (!prefersReducedMotion) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 180);
    }
    if (onClick) onClick();
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`btn-primary ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        transform: prefersReducedMotion
          ? 'none'
          : `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${isClicked ? 0.982 : 1})`,
        transition: isHovered
          ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
        boxShadow: isHovered
          ? '0 0 25px rgba(120, 103, 255, 0.3), 0 0 10px rgba(114, 228, 255, 0.4)'
          : '0 0 0 rgba(0,0,0,0)',
        ...style,
      }}
    >
      {/* Frequency Charge Line Sweep */}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, #7867FF 0%, #72E4FF 50%, #7867FF 100%)',
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* Label with micro horizontal shift */}
      <span
        style={{
          display: 'inline-block',
          transform: prefersReducedMotion
            ? 'none'
            : `translateX(${isHovered ? textOffset : 0}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          letterSpacing: '0.14em',
        }}
      >
        {label}
      </span>

      {/* Arrow with micro diagonal shift */}
      <span
        style={{
          display: 'inline-block',
          transform: prefersReducedMotion
            ? 'none'
            : `translate(${isHovered ? arrowDiagonal : 0}px, ${isHovered ? -arrowDiagonal : 0}px)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          color: isHovered ? 'var(--color-resonance-violet)' : 'inherit',
        }}
      >
        {arrow}
      </span>
    </a>
  );
};
