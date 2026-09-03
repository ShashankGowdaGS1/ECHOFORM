import React, { useRef, useState, useEffect } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const ExperienceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { progress } = useScrollProgress(containerRef);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const experiences = [
    {
      id: 'hear',
      glyph: '01',
      title: 'HEAR',
      subtitle: '64-CHANNEL SPATIAL AUDIO FIELD',
      description: 'Sound as physical architecture. Custom 64-channel spatial speaker arrays project sound objects through three-dimensional space, vibrating through the human body.',
      image: '/assets/images/experience-hear.jpg',
      tag: 'ACOUSTIC FIELD',
      direction: 'right', // Enters from RIGHT (+95vw -> 0)
    },
    {
      id: 'see',
      glyph: '02',
      title: 'SEE',
      subtitle: 'VOLUMETRIC GENERATIVE LASERS',
      description: 'Spaces sculpted by coherent laser planes and generative visual systems reacting in real-time microsecond lockstep to audio synthesizers.',
      image: '/assets/images/experience-see.jpg',
      tag: 'VOLUMETRIC OPTICS',
      direction: 'left', // Enters from LEFT (-95vw -> 0)
    },
    {
      id: 'enter',
      glyph: '03',
      title: 'ENTER',
      subtitle: 'TACTILE ARCHITECTURAL PAVILIONS',
      description: 'Seven standalone architectural environments where audience movement alters acoustic parameters and light reflections.',
      image: '/assets/images/experience-enter.jpg',
      tag: 'INTERACTIVE SENSORY',
      direction: 'right', // Enters from RIGHT (+95vw -> 0)
    },
  ];

  // --------------------------------------------------------------------------
  // CHAPTER TRANSFORMS CALCULATIONS (Local 0.0 -> 1.0 progress across 340vh)
  // --------------------------------------------------------------------------
  // Chapter 0 (HEAR): Enter 0.00-0.22 (from +95vw), Hold 0.22-0.32, Exit 0.32-0.40 (to -15vw)
  // Chapter 1 (SEE):  Enter 0.32-0.52 (from -95vw), Hold 0.52-0.62, Exit 0.62-0.70 (to +15vw)
  // Chapter 2 (ENTER): Enter 0.62-0.82 (from +95vw), Hold 0.82-0.96, Release 0.96-1.00

  const getChapterState = (idx: number) => {
    if (idx === 0) {
      // HEAR (Enters from Right)
      if (progress < 0.22) {
        const t = Math.min(progress / 0.22, 1);
        const E = 3 * t * t - 2 * t * t * t;
        return {
          isVisible: true,
          opacity: Math.min(1, t * 1.3),
          tx: (1 - E) * 95, // +95vw -> 0
          bgTx: (1 - E) * 65, // +65vw -> 0
          scale: 1 + 0.04 * (1 - E),
        };
      }
      if (progress >= 0.22 && progress < 0.32) {
        return { isVisible: true, opacity: 1, tx: 0, bgTx: 0, scale: 1 };
      }
      if (progress >= 0.32 && progress < 0.40) {
        const t = (progress - 0.32) / 0.08;
        const E = 3 * t * t - 2 * t * t * t;
        return {
          isVisible: true,
          opacity: 1 - E,
          tx: -15 * E, // 0 -> -15vw
          bgTx: -10 * E,
          scale: 1 - 0.04 * E,
        };
      }
      return { isVisible: false, opacity: 0, tx: -15, bgTx: -10, scale: 0.96 };
    }

    if (idx === 1) {
      // SEE (Enters from Left)
      if (progress < 0.32) {
        return { isVisible: false, opacity: 0, tx: -95, bgTx: -65, scale: 1.04 };
      }
      if (progress >= 0.32 && progress < 0.52) {
        const t = (progress - 0.32) / 0.20;
        const E = 3 * t * t - 2 * t * t * t;
        return {
          isVisible: true,
          opacity: Math.min(1, t * 1.3),
          tx: -(1 - E) * 95, // -95vw -> 0
          bgTx: -(1 - E) * 65, // -65vw -> 0
          scale: 1 + 0.04 * (1 - E),
        };
      }
      if (progress >= 0.52 && progress < 0.62) {
        return { isVisible: true, opacity: 1, tx: 0, bgTx: 0, scale: 1 };
      }
      if (progress >= 0.62 && progress < 0.70) {
        const t = (progress - 0.62) / 0.08;
        const E = 3 * t * t - 2 * t * t * t;
        return {
          isVisible: true,
          opacity: 1 - E,
          tx: 15 * E, // 0 -> +15vw
          bgTx: 10 * E,
          scale: 1 - 0.04 * E,
        };
      }
      return { isVisible: false, opacity: 0, tx: 15, bgTx: 10, scale: 0.96 };
    }

    // ENTER (Enters from Right)
    if (progress < 0.62) {
      return { isVisible: false, opacity: 0, tx: 95, bgTx: 65, scale: 1.04 };
    }
    if (progress >= 0.62 && progress < 0.82) {
      const t = (progress - 0.62) / 0.20;
      const E = 3 * t * t - 2 * t * t * t;
      return {
        isVisible: true,
        opacity: Math.min(1, t * 1.3),
        tx: (1 - E) * 95, // +95vw -> 0
        bgTx: (1 - E) * 65, // +65vw -> 0
        scale: 1 + 0.04 * (1 - E),
      };
    }
    // Final Hold (0.82 -> 1.00, holds full opacity and position for natural release)
    return { isVisible: true, opacity: 1, tx: 0, bgTx: 0, scale: 1 };
  };

  // Active sensory dimension indicator
  let activeDim = '01';
  if (progress >= 0.36 && progress < 0.66) activeDim = '02';
  else if (progress >= 0.66) activeDim = '03';

  // --------------------------------------------------------------------------
  // REDUCED MOTION ACCESSIBLE FALLBACK
  // --------------------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <section
        id="experience"
        aria-label="Experience Section"
        className="section-spacing"
        style={{ backgroundColor: 'var(--color-void)', borderBottom: '1px solid var(--color-graphite)' }}
      >
        <div className="container-12">
          {/* Section Header */}
          <div className="section-header">
            <div>
              <div className="section-label">SENSORY DIMENSIONS</div>
              <h2 className="section-title">HEAR. SEE. ENTER.</h2>
            </div>
            <p className="section-intro-text">
              Three interconnected dimensions transforming acoustic vibrations into monumental physical structures and visceral sensation.
            </p>
          </div>

          {/* Chapters in static normal flow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
            {experiences.map((exp, idx) => {
              const isReversed = idx % 2 === 1;
              return (
                <div key={exp.id} className={`experience-chapter ${isReversed ? 'reversed' : ''}`}>
                  <div
                    className="experience-bg-word"
                    style={{
                      [isReversed ? 'right' : 'left']: '-1.5rem',
                      textAlign: isReversed ? 'right' : 'left',
                    }}
                  >
                    {exp.title}
                  </div>

                  <div className="experience-media-card">
                    <img src={exp.image} alt={`${exp.title} Dimension`} />
                    <div
                      style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-meta-xs)',
                        color: 'var(--color-ion-blue)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        backgroundColor: 'rgba(5, 5, 6, 0.9)',
                        border: '1px solid var(--color-graphite)',
                        padding: '0.4rem 0.8rem',
                      }}
                    >
                      {exp.tag} // {exp.glyph}
                    </div>
                  </div>

                  <div className="experience-copy">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-resonance-violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      DIMENSION {exp.glyph}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-artist)', lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--color-lunar-white)' }}>
                      {exp.title}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-ion-blue)', textTransform: 'uppercase' }}>
                      {exp.subtitle}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--color-muted-silver)', lineHeight: 1.6 }}>
                      {exp.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // PRIMARY STICKY SENSORY DIMENSIONS SCROLL SEQUENCE
  // --------------------------------------------------------------------------
  return (
    <section
      id="experience"
      aria-label="Experience Section"
      style={{
        backgroundColor: 'var(--color-void)',
        borderBottom: '1px solid var(--color-graphite)',
      }}
    >
      {/* Intro Block in Normal Document Flow */}
      <div
        className="section-spacing"
        style={{
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--color-graphite)',
        }}
      >
        <div className="container-12">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <div>
              <div className="section-label">SENSORY DIMENSIONS</div>
              <h2 className="section-title">HEAR. SEE. ENTER.</h2>
            </div>
            <p className="section-intro-text">
              Three interconnected dimensions transforming acoustic vibrations into monumental physical structures and visceral sensation.
            </p>
          </div>
        </div>
      </div>

      {/* 340vh Sticky Scroll Container for HEAR / SEE / ENTER */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '340vh',
        }}
      >
        {/* Sticky Visual Stage (Accounts for 72px Navbar Height) */}
        <div
          style={{
            position: 'sticky',
            top: '72px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 72px)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-void)',
          }}
        >
          <div
            className="container-12"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '480px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Top Right Live Dimension Indicator */}
            <div
              style={{
                position: 'absolute',
                top: '-2.5rem',
                right: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--color-ion-blue)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(5, 5, 6, 0.85)',
                border: '1px solid var(--color-graphite)',
                padding: '0.3rem 0.75rem',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              DIMENSION // {activeDim} OF 03
            </div>

            {/* Layered Chapters: HEAR (Right), SEE (Left), ENTER (Right) */}
            {experiences.map((exp, idx) => {
              const isReversed = idx % 2 === 1;
              const state = getChapterState(idx);

              return (
                <div
                  key={exp.id}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: state.opacity,
                    visibility: state.isVisible ? 'visible' : 'hidden',
                    pointerEvents: state.opacity > 0.5 ? 'auto' : 'none',
                    zIndex: state.opacity > 0.1 ? 5 + idx : 0,
                    transition: 'opacity 0.08s linear',
                  }}
                >
                  <div
                    className={`experience-chapter ${isReversed ? 'reversed' : ''}`}
                    style={{
                      width: '100%',
                      margin: 0,
                      transform: `translateX(${state.tx}vw) scale(${state.scale})`,
                      transformOrigin: isReversed ? 'left center' : 'right center',
                      transition: 'transform 0.08s linear',
                    }}
                  >
                    {/* Background Giant Display Word with differential parallax */}
                    <div
                      className="experience-bg-word"
                      style={{
                        [isReversed ? 'right' : 'left']: '-1.5rem',
                        textAlign: isReversed ? 'right' : 'left',
                        transform: `translateX(${state.bgTx}vw)`,
                        transition: 'transform 0.08s linear',
                      }}
                    >
                      {exp.title}
                    </div>

                    {/* Media Card */}
                    <div className="experience-media-card">
                      <img src={exp.image} alt={`${exp.title} Dimension`} />

                      <div
                        style={{
                          position: 'absolute',
                          top: '1.5rem',
                          left: '1.5rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-meta-xs)',
                          color: 'var(--color-ion-blue)',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          backgroundColor: 'rgba(5, 5, 6, 0.9)',
                          border: '1px solid var(--color-graphite)',
                          padding: '0.4rem 0.8rem',
                        }}
                      >
                        {exp.tag} // {exp.glyph}
                      </div>
                    </div>

                    {/* Copy Box */}
                    <div className="experience-copy">
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-meta)',
                          color: 'var(--color-resonance-violet)',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                        }}
                      >
                        DIMENSION {exp.glyph}
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: 'var(--text-artist)',
                          lineHeight: 0.95,
                          textTransform: 'uppercase',
                          color: 'var(--color-lunar-white)',
                          margin: 0,
                        }}
                      >
                        {exp.title}
                      </h3>

                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: '1.15rem',
                          color: 'var(--color-ion-blue)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {exp.subtitle}
                      </div>

                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '1.05rem',
                          color: 'var(--color-muted-silver)',
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
