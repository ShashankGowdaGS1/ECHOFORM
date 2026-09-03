import React, { useState } from 'react';
import { ResonanceLogo } from './ResonanceLogo';
import { Menu, X } from 'lucide-react';
import { FrequencyChargeButton } from './FrequencyChargeButton';

export const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'LINEUP', href: '#lineup' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'STAGES', href: '#stages' },
    { label: 'SCHEDULE', href: '#schedule' },
    { label: 'VENUE', href: '#venue' },
  ];

  return (
    <header className="site-header" role="banner">
      <div className="container-12 nav-container">
        {/* Left: Brand Logo + Location Tag */}
        <div className="nav-left">
          <ResonanceLogo size="md" />
          <span className="nav-tag">
            18—19 SEP 2027 // BENGALURU
          </span>
        </div>

        {/* Center: Main Navigation */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: CTA & Mobile Button */}
        <div className="nav-right">
          <FrequencyChargeButton
            href="#passes"
            label="GET PASSES"
            arrow="↗"
            intensity="nav"
            style={{ padding: '0.65rem 1.4rem' }}
          />

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 72px)',
            backgroundColor: '#050506',
            zIndex: 99,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '1px solid #17171B',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#F0F0EC',
                  borderBottom: '1px solid #17171B',
                  paddingBottom: '0.75rem',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#A4A4A6' }}>
              18—19 SEP 2027 // BENGALURU, INDIA
            </div>
            <a
              href="#passes"
              className="btn-primary"
              onClick={() => setMobileOpen(false)}
              style={{ textAlign: 'center', justifyContent: 'center' }}
            >
              GET PASSES ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
