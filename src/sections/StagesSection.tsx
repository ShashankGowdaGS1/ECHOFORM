import React, { useRef, useState, useEffect } from 'react';
import { STAGES_DATA, type Stage } from '../data/stages';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const StagesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { progress } = useScrollProgress(containerRef);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualStageId, setManualStageId] = useState<string>('core');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Active stage ID derived strictly from scroll progress
  let activeStageId = 'core';
  if (progress >= 0.34 && progress < 0.64) {
    activeStageId = 'void';
  } else if (progress >= 0.64) {
    activeStageId = 'signal';
  }

  // --------------------------------------------------------------------------
  // ARCHITECTURAL MONOLITH ROTATION CALCULATIONS (Local 0.0 -> 1.0 Progress)
  // --------------------------------------------------------------------------
  // CORE:   Hold 0.00-0.28, Exit Rotation 0.28-0.40 (rotY: 0 -> -16deg, tx: 0 -> -12vw)
  // VOID:   Enter Rotation 0.28-0.40 (rotY: +16deg -> 0, tx: +14vw -> 0), Hold 0.40-0.58, Exit Rotation 0.58-0.70
  // SIGNAL: Enter Rotation 0.58-0.70 (rotY: +16deg -> 0, tx: +14vw -> 0), Hold 0.70-0.96, Release 0.96-1.00

  const getStageState = (stageId: string) => {
    if (stageId === 'core') {
      if (progress < 0.28) {
        return { isVisible: true, opacity: 1, tx: 0, rotY: 0, tz: 0, scale: 1 };
      }
      if (progress >= 0.28 && progress < 0.40) {
        const t = (progress - 0.28) / 0.12;
        const E = 3 * t * t - 2 * t * t * t;
        return {
          isVisible: true,
          opacity: 1 - E,
          tx: -12 * E, // 0 -> -12vw
          rotY: -16 * E, // 0 -> -16deg
          tz: -80 * E, // 0 -> -80px
          scale: 1 - 0.06 * E,
        };
      }
      return { isVisible: false, opacity: 0, tx: -12, rotY: -16, tz: -80, scale: 0.94 };
    }

    if (stageId === 'void') {
      if (progress < 0.28) {
        return { isVisible: false, opacity: 0, tx: 14, rotY: 16, tz: -80, scale: 0.94 };
      }
      if (progress >= 0.28 && progress < 0.40) {
        const t = (progress - 0.28) / 0.12;
        const E = 3 * t * t - 2 * t * t * t;
        return {
          isVisible: true,
          opacity: E,
          tx: 14 * (1 - E), // +14vw -> 0
          rotY: 16 * (1 - E), // +16deg -> 0
          tz: -80 * (1 - E), // -80px -> 0
          scale: 0.94 + 0.06 * E,
        };
      }
      if (progress >= 0.40 && progress < 0.58) {
        return { isVisible: true, opacity: 1, tx: 0, rotY: 0, tz: 0, scale: 1 };
      }
      if (progress >= 0.58 && progress < 0.70) {
        const t = (progress - 0.58) / 0.12;
        const E = 3 * t * t - 2 * t * t * t;
        return {
          isVisible: true,
          opacity: 1 - E,
          tx: -12 * E, // 0 -> -12vw
          rotY: -16 * E, // 0 -> -16deg
          tz: -80 * E, // 0 -> -80px
          scale: 1 - 0.06 * E,
        };
      }
      return { isVisible: false, opacity: 0, tx: -12, rotY: -16, tz: -80, scale: 0.94 };
    }

    // SIGNAL
    if (progress < 0.58) {
      return { isVisible: false, opacity: 0, tx: 14, rotY: 16, tz: -80, scale: 0.94 };
    }
    if (progress >= 0.58 && progress < 0.70) {
      const t = (progress - 0.58) / 0.12;
      const E = 3 * t * t - 2 * t * t * t;
      return {
        isVisible: true,
        opacity: E,
        tx: 14 * (1 - E), // +14vw -> 0
        rotY: 16 * (1 - E), // +16deg -> 0
        tz: -80 * (1 - E), // -80px -> 0
        scale: 0.94 + 0.06 * E,
      };
    }
    // Final Hold
    return { isVisible: true, opacity: 1, tx: 0, rotY: 0, tz: 0, scale: 1 };
  };

  const handleTabClick = (stageId: string) => {
    if (prefersReducedMotion) {
      setManualStageId(stageId);
      return;
    }

    const targetProgress = stageId === 'core' ? 0.15 : stageId === 'void' ? 0.49 : 0.83;
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const scrollableDistance = rect.height - window.innerHeight;

    if (scrollableDistance > 0) {
      window.scrollTo({
        top: containerTop + scrollableDistance * targetProgress,
        behavior: 'smooth',
      });
    }
  };

  // --------------------------------------------------------------------------
  // REDUCED MOTION ACCESSIBLE FALLBACK
  // --------------------------------------------------------------------------
  if (prefersReducedMotion) {
    const currentStage: Stage =
      STAGES_DATA.find((s) => s.id === manualStageId) || STAGES_DATA[0];

    return (
      <section
        id="stages"
        aria-label="Stages Section"
        className="section-spacing"
        style={{ backgroundColor: 'var(--color-void)', borderBottom: '1px solid var(--color-graphite)' }}
      >
        <div className="container-12">
          {/* Section Header */}
          <div className="section-header">
            <div>
              <div className="section-label" style={{ color: 'var(--color-ion-blue)' }}>
                PERFORMANCE SPACES
              </div>
              <h2 className="section-title">THREE WORLDS.</h2>
            </div>

            {/* Stage Switcher Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {STAGES_DATA.map((stage, idx) => {
                const isActive = stage.id === manualStageId;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => handleTabClick(stage.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-meta)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      fontWeight: 700,
                      border: '1px solid',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: isActive ? 'var(--color-lunar-white)' : 'var(--color-carbon)',
                      color: isActive ? 'var(--color-dark-text)' : 'var(--color-muted-silver)',
                      borderColor: isActive ? 'var(--color-lunar-white)' : 'var(--color-graphite)',
                    }}
                  >
                    0{idx + 1} {stage.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dominant Stage Composition */}
          <div className="stages-grid-layout">
            <div className="stage-media-container">
              <img src={currentStage.image} alt={`${currentStage.name} Stage`} />
              <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta-xs)', color: 'var(--color-ion-blue)', letterSpacing: '0.14em', textTransform: 'uppercase', backgroundColor: 'rgba(5, 5, 6, 0.9)', border: '1px solid var(--color-graphite)', padding: '0.4rem 0.8rem' }}>
                {currentStage.type}
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-lunar-white)', backgroundColor: 'rgba(5, 5, 6, 0.92)', backdropFilter: 'blur(8px)', border: '1px solid var(--color-graphite)', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{currentStage.soundEngine}</span>
                <span style={{ color: 'var(--color-resonance-violet)' }}>{currentStage.capacity}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-resonance-violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {currentStage.code}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-artist)', lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--color-lunar-white)', marginTop: '0.5rem' }}>
                  {currentStage.name}
                </h3>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-ion-blue)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                  {currentStage.type}
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--color-muted-silver)', lineHeight: 1.6 }}>
                {currentStage.description}
              </p>

              <div className="stage-specs-box">
                <div className="stage-spec-row">
                  <span style={{ color: 'var(--color-dim-gray)' }}>DIMENSIONS:</span>
                  <span style={{ color: 'var(--color-lunar-white)' }}>{currentStage.dimensions}</span>
                </div>
                <div className="stage-spec-row">
                  <span style={{ color: 'var(--color-dim-gray)' }}>CAPACITY:</span>
                  <span style={{ color: 'var(--color-ion-blue)', fontWeight: 700 }}>{currentStage.capacity}</span>
                </div>
                <div className="stage-spec-row" style={{ borderBottom: 'none' }}>
                  <span style={{ color: 'var(--color-dim-gray)' }}>ACOUSTIC PROFILE:</span>
                  <span style={{ color: 'var(--color-resonance-violet)' }}>{currentStage.acousticProfile}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // PRIMARY 320VH MONOLITH SCROLL ROTATION EXPERIENCE
  // --------------------------------------------------------------------------
  return (
    <section
      id="stages"
      ref={containerRef}
      aria-label="Stages Section"
      style={{
        position: 'relative',
        height: '320vh',
        backgroundColor: 'var(--color-void)',
        borderBottom: '1px solid var(--color-graphite)',
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
        <div className="container-12" style={{ width: '100%' }}>
          {/* Section Header with Synchronized Tabs */}
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <div>
              <div className="section-label" style={{ color: 'var(--color-ion-blue)' }}>
                PERFORMANCE SPACES
              </div>
              <h2 className="section-title">THREE WORLDS.</h2>
            </div>

            {/* Stage Switcher Tabs (Derived from Scroll Progress + Click-to-Scroll) */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {STAGES_DATA.map((stage, idx) => {
                const isActive = stage.id === activeStageId;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => handleTabClick(stage.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-meta)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      fontWeight: 700,
                      border: '1px solid',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      backgroundColor: isActive ? 'var(--color-lunar-white)' : 'var(--color-carbon)',
                      color: isActive ? 'var(--color-dark-text)' : 'var(--color-muted-silver)',
                      borderColor: isActive ? 'var(--color-lunar-white)' : 'var(--color-graphite)',
                    }}
                  >
                    0{idx + 1} {stage.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monolith 3D Perspective Stage */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '460px',
              perspective: '1500px',
              transformStyle: 'preserve-3d',
            }}
          >
            {STAGES_DATA.map((stage) => {
              const state = getStageState(stage.id);

              return (
                <div
                  key={stage.id}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: state.opacity,
                    visibility: state.isVisible ? 'visible' : 'hidden',
                    transform: `translateX(${state.tx}vw) translateZ(${state.tz}px) rotateY(${state.rotY}deg) scale(${state.scale})`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform, opacity',
                    pointerEvents: state.opacity > 0.5 ? 'auto' : 'none',
                    zIndex: state.opacity > 0.1 ? 5 : 0,
                    transition: 'opacity 0.08s linear, transform 0.08s linear',
                  }}
                >
                  {/* Background Architectural Stage Name Typography */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-3rem',
                      left: '-2rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'clamp(7rem, 20vw, 18rem)',
                      lineHeight: 0.75,
                      color: 'rgba(240, 240, 236, 0.045)',
                      letterSpacing: '-0.05em',
                      textTransform: 'uppercase',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      zIndex: 0,
                    }}
                  >
                    {stage.name}
                  </div>

                  {/* Dominant Stage Composition */}
                  <div className="stages-grid-layout" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
                    {/* Main Wide Media Container */}
                    <div className="stage-media-container">
                      <img src={stage.image} alt={`${stage.name} Stage`} />

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
                        {stage.type}
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          bottom: '1.5rem',
                          left: '1.5rem',
                          right: '1.5rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-meta)',
                          color: 'var(--color-lunar-white)',
                          backgroundColor: 'rgba(5, 5, 6, 0.92)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid var(--color-graphite)',
                          padding: '0.75rem 1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{stage.soundEngine}</span>
                        <span style={{ color: 'var(--color-resonance-violet)' }}>{stage.capacity}</span>
                      </div>
                    </div>

                    {/* Right Column: Stage Description */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-resonance-violet)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                          {stage.code}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-artist)', lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--color-lunar-white)', marginTop: '0.5rem' }}>
                          {stage.name}
                        </h3>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-ion-blue)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                          {stage.type}
                        </div>
                      </div>

                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--color-muted-silver)', lineHeight: 1.6 }}>
                        {stage.description}
                      </p>

                      <div className="stage-specs-box">
                        <div className="stage-spec-row">
                          <span style={{ color: 'var(--color-dim-gray)' }}>DIMENSIONS:</span>
                          <span style={{ color: 'var(--color-lunar-white)' }}>{stage.dimensions}</span>
                        </div>
                        <div className="stage-spec-row">
                          <span style={{ color: 'var(--color-dim-gray)' }}>CAPACITY:</span>
                          <span style={{ color: 'var(--color-ion-blue)', fontWeight: 700 }}>{stage.capacity}</span>
                        </div>
                        <div className="stage-spec-row" style={{ borderBottom: 'none' }}>
                          <span style={{ color: 'var(--color-dim-gray)' }}>ACOUSTIC PROFILE:</span>
                          <span style={{ color: 'var(--color-resonance-violet)' }}>{stage.acousticProfile}</span>
                        </div>
                      </div>
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
