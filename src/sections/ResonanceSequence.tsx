import React, { useRef, useState, useEffect } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { ScrollFrameSequence } from '../components/animation/ScrollFrameSequence';
import { RESONANCE_FRAME_URLS } from '../data/resonanceFrames';

export const ResonanceSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { progress } = useScrollProgress(containerRef);

  // Check for prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Frame progress mapping: progress 0..0.92 maps to frames 0..127; 0.92..1.0 holds the settled CORE stage
  const frameProgress = progress < 0.92 ? progress / 0.92 : 1.0;

  // Early Overlay Progress Calculations (Progress 0.08 to 0.28)
  const isEarlyActive = progress >= 0.08 && progress <= 0.29;

  const getStagger = (p: number, s: number, e: number) => {
    if (p <= s) return 0;
    if (p >= e) return 1;
    return (p - s) / (e - s);
  };

  // Exit progress: gradual drift leftward and fade out between 0.22 and 0.28
  const exitT = getStagger(progress, 0.22, 0.28);
  const earlyContainerOpacity = progress < 0.22 ? 1 : 1 - exitT;
  const earlyContainerTranslateX = -35 * exitT;

  // Staggered line reveal progress
  const metaEnter = getStagger(progress, 0.08, 0.13);
  const line1Enter = getStagger(progress, 0.09, 0.14);
  const line2Enter = getStagger(progress, 0.10, 0.15);
  const line3Enter = getStagger(progress, 0.11, 0.16);
  const descEnter = getStagger(progress, 0.12, 0.17);

  // Milestones Overlay: appears smoothly around 0.90+
  let milestonesOpacity = 0;
  let milestonesTranslateY = 30;
  if (progress >= 0.90) {
    const t = Math.min((progress - 0.90) / 0.05, 1);
    milestonesOpacity = t;
    milestonesTranslateY = 30 * (1 - t);
  }

  // Count-up numbers state for milestones
  const isMilestonesVisible = progress >= 0.91;
  const [countNights, setCountNights] = useState(0);
  const [countStages, setCountStages] = useState(0);
  const [countArtists, setCountArtists] = useState(0);

  useEffect(() => {
    if (isMilestonesVisible) {
      // Smooth count-up animation
      let startTime: number | null = null;
      const duration = 650;

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const p = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - p, 3);

        setCountNights(Math.round(easeOut * 2));
        setCountStages(Math.round(easeOut * 3));
        setCountArtists(Math.round(easeOut * 24));

        if (p < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setCountNights(0);
      setCountStages(0);
      setCountArtists(0);
    }
  }, [isMilestonesVisible]);

  // Reduced motion accessible fallback
  if (prefersReducedMotion) {
    return (
      <section
        id="resonance"
        aria-label="The Resonance Gate"
        className="section-spacing"
        style={{ backgroundColor: 'var(--color-void)', borderBottom: '1px solid var(--color-graphite)' }}
      >
        <div className="container-12">
          <div className="section-header">
            <div>
              <div className="section-label">THE CENTRAL MONUMENT</div>
              <h2 className="section-title" style={{ maxWidth: '700px' }}>
                A NEW FREQUENCY IS FORMING.
              </h2>
            </div>
            <p className="section-intro-text">
              Sound becomes structure. Frequency becomes space. Concentric blackened titanium rings vibrate at infrasonic thresholds, focusing sound into physical geometry.
            </p>
          </div>

          <div className="gate-cinematic-card">
            <img src="/assets/images/resonance-gate-hero.jpg" alt="The Resonance Gate Sculpture" />
            <div className="gate-overlay-tag" style={{ top: '1.5rem', left: '1.5rem', color: 'var(--color-ion-blue)' }}>
              02 // THE CENTRAL MONUMENT
            </div>
          </div>

          <div className="milestones-grid">
            <div className="milestone-item">
              <div className="milestone-value">2 NIGHTS</div>
              <div className="milestone-label">18—19 SEP 2027</div>
            </div>
            <div className="milestone-item">
              <div className="milestone-value" style={{ color: 'var(--color-resonance-violet)' }}>3 STAGES</div>
              <div className="milestone-label">CORE / VOID / SIGNAL</div>
            </div>
            <div className="milestone-item">
              <div className="milestone-value" style={{ color: 'var(--color-ion-blue)' }}>24 ARTISTS</div>
              <div className="milestone-label">GLOBAL EXPERIMENTAL</div>
            </div>
            <div className="milestone-item">
              <div className="milestone-value">ONE FREQ</div>
              <div className="milestone-label">432 HZ CONVERGENCE</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="resonance"
      ref={containerRef}
      aria-label="The Resonance Gate"
      style={{
        position: 'relative',
        height: '500vh',
        backgroundColor: 'var(--color-void)',
      }}
    >
      {/* Sticky Visual Stage (Full Viewport Height) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'var(--color-void)',
        }}
      >
        <ScrollFrameSequence
          progress={frameProgress}
          frameUrls={RESONANCE_FRAME_URLS}
          fallbackPoster="/assets/images/resonance-gate-hero.jpg"
          dprCap={2}
        >
          {/* Invisible Soft Local Scrim (Left-Side Gradient Only) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '60vw',
              background: 'linear-gradient(90deg, rgba(5, 5, 6, 0.75) 0%, rgba(5, 5, 6, 0.45) 50%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
            aria-hidden="true"
          />

          {/* Top Subtle Telemetry (Left-Only, Clean) */}
          <div
            style={{
              position: 'absolute',
              top: '88px',
              left: 'clamp(24px, 5vw, 64px)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-resonance-violet)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(5, 5, 6, 0.65)',
                backdropFilter: 'blur(8px)',
                padding: '0.35rem 0.75rem',
                border: '1px solid var(--color-graphite)',
              }}
            >
              02 // THE CENTRAL MONUMENT
            </div>
          </div>

          {/* Early Editorial Statement Overlay (Progress 0.08 - 0.28) */}
          {isEarlyActive && (
            <div
              style={{
                position: 'absolute',
                top: '53%',
                left: 'clamp(24px, 5.2vw, 84px)',
                transform: `translateY(-50%) translateX(${earlyContainerTranslateX}px)`,
                width: 'min(52vw, 760px)',
                maxWidth: '52vw',
                opacity: earlyContainerOpacity,
                transition: 'opacity 0.08s linear, transform 0.08s linear',
                pointerEvents: earlyContainerOpacity > 0.2 ? 'auto' : 'none',
                zIndex: 20,
                overflow: 'visible',
              }}
            >
              {/* Small Metadata with clip reveal */}
              <div style={{ overflow: 'hidden', marginBottom: '0.85rem', paddingBottom: '2px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    color: 'var(--color-ion-blue)',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    transform: `translateY(${(1 - metaEnter) * 100}%)`,
                    opacity: metaEnter,
                    transition: 'transform 0.08s linear, opacity 0.08s linear',
                  }}
                >
                  THE CENTRAL MONUMENT
                </div>
              </div>

              {/* Main Statement — Monumental 3-Line Syne Headline */}
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(3rem, 5.2vw, 5.8rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color: 'var(--color-lunar-white)',
                  margin: 0,
                  overflow: 'visible',
                  whiteSpace: 'normal',
                  wordBreak: 'keep-all',
                }}
              >
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
                  <span
                    style={{
                      display: 'block',
                      transform: `translateY(${(1 - line1Enter) * 100}%)`,
                      opacity: line1Enter,
                      transition: 'transform 0.08s linear, opacity 0.08s linear',
                    }}
                  >
                    A NEW
                  </span>
                </span>
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
                  <span
                    style={{
                      display: 'block',
                      transform: `translateY(${(1 - line2Enter) * 100}%)`,
                      opacity: line2Enter,
                      transition: 'transform 0.08s linear, opacity 0.08s linear',
                    }}
                  >
                    FREQUENCY
                  </span>
                </span>
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em' }}>
                  <span
                    style={{
                      display: 'block',
                      transform: `translateY(${(1 - line3Enter) * 100}%)`,
                      opacity: line3Enter,
                      transition: 'transform 0.08s linear, opacity 0.08s linear',
                    }}
                  >
                    IS FORMING.
                  </span>
                </span>
              </h2>

              {/* Short Editorial Description */}
              <div style={{ overflow: 'hidden', marginTop: '1.5rem', paddingBottom: '2px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                    color: 'var(--color-muted-silver)',
                    lineHeight: 1.45,
                    letterSpacing: '-0.01em',
                    margin: 0,
                    maxWidth: '460px',
                    transform: `translateY(${(1 - descEnter) * 100}%)`,
                    opacity: descEnter,
                    transition: 'transform 0.08s linear, opacity 0.08s linear',
                  }}
                >
                  Sound becomes structure. Frequency becomes space.
                </p>
              </div>
            </div>
          )}

          {/* Final Milestones Overlay (Progress 0.90+) */}
          <div
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: 0,
              right: 0,
              pointerEvents: milestonesOpacity > 0.1 ? 'auto' : 'none',
              opacity: milestonesOpacity,
              transform: `translateY(${milestonesTranslateY}px)`,
              transition: 'opacity 0.15s linear, transform 0.15s linear',
              zIndex: 20,
            }}
          >
            <div className="container-12">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1.5rem',
                  backgroundColor: 'rgba(5, 5, 6, 0.9)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--color-graphite)',
                  padding: '2rem 2.5rem',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.9)',
                }}
              >
                <div className="milestone-item">
                  <div className="milestone-value">
                    {isMilestonesVisible ? `${countNights} NIGHTS` : '2 NIGHTS'}
                  </div>
                  <div className="milestone-label">18—19 SEP 2027</div>
                </div>

                <div className="milestone-item">
                  <div className="milestone-value" style={{ color: 'var(--color-resonance-violet)' }}>
                    {isMilestonesVisible ? `${countStages} STAGES` : '3 STAGES'}
                  </div>
                  <div className="milestone-label">CORE / VOID / SIGNAL</div>
                </div>

                <div className="milestone-item">
                  <div className="milestone-value" style={{ color: 'var(--color-ion-blue)' }}>
                    {isMilestonesVisible ? `${countArtists} ARTISTS` : '24 ARTISTS'}
                  </div>
                  <div className="milestone-label">GLOBAL EXPERIMENTAL</div>
                </div>

                <div className="milestone-item">
                  <div className="milestone-value">ONE FREQ</div>
                  <div className="milestone-label">432 HZ CONVERGENCE</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollFrameSequence>
      </div>
    </section>
  );
};
