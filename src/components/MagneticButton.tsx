import React from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: string;
  target?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  icon = '↗',
  target,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  const baseStyles: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 'var(--text-body-sm)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.65rem',
    padding: '0 1.75rem',
    height: '52px',
    borderRadius: '0px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    textDecoration: 'none',
    userSelect: 'none',
  };

  const primaryStyles: React.CSSProperties = {
    ...baseStyles,
    backgroundColor: 'var(--color-lunar-white)',
    color: 'var(--color-dark-text)',
    border: '1px solid var(--color-lunar-white)',
  };

  const secondaryStyles: React.CSSProperties = {
    ...baseStyles,
    backgroundColor: 'transparent',
    color: 'var(--color-lunar-white)',
    border: '1px solid var(--color-border-strong)',
  };

  const ghostStyles: React.CSSProperties = {
    ...baseStyles,
    backgroundColor: 'transparent',
    color: 'var(--color-muted-silver)',
    border: 'none',
    padding: '0 0.5rem',
    height: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-meta)',
  };

  const currentStyles = isPrimary
    ? primaryStyles
    : isSecondary
    ? secondaryStyles
    : ghostStyles;

  const content = (
    <>
      <span className="relative z-10 font-bold">{children}</span>
      {icon && (
        <span
          className="relative z-10 transition-transform duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.1em',
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      )}
      {isPrimary && (
        <span
          className="absolute inset-0 bg-[#72E4FF] transform -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 z-0 opacity-90"
          style={{ pointerEvents: 'none' }}
        />
      )}
      {isSecondary && (
        <span
          className="absolute inset-0 bg-[#17171B] transform opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        style={currentStyles}
        className={`group ${className}`}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      style={currentStyles}
      className={`group ${className}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
};
