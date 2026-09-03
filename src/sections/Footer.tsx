import React, { useRef, useState, useEffect } from 'react';
import { ResonanceRingSymbol } from '../components/ResonanceRingSymbol';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const Footer: React.FC = () => {
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

  const socials = [
    { index: '01', name: 'INSTAGRAM', url: 'https://instagram.com' },
    { index: '02', name: 'YOUTUBE', url: 'https://youtube.com' },
    { index: '03', name: 'SPOTIFY', url: 'https://spotify.com' },
    { index: '04', name: 'SOUNDCLOUD', url: 'https://soundcloud.com' },
  ];

  const wordmarkLetters = [
    { char: 'E', offset: 0.0 },
    { char: 'C', offset: 0.025 },
    { char: 'H', offset: 0.05 },
    { char: 'O', offset: 0.075 },
    { char: 'F', offset: 0.1 },
    { char: 'O', offset: 0.125 },
    { char: 'R', offset: 0.15 },
    { char: 'M', offset: 0.175 },
  ];

  // --------------------------------------------------------------------------
  // 1. "THE SIGNAL CONTINUES." (0.05 -> 0.28)
  // --------------------------------------------------------------------------
  let signalTranslateY = 0; // 0% (Copy 1) -> -50% (Copy 2)
  let signalOpacity = 1;
  let signalTracking = '0.24em';

  if (!prefersReducedMotion) {
    const t = Math.min(1, Math.max(0, (progress - 0.05) / 0.23));
    const E = 3 * t * t - 2 * t * t * t;
    signalTranslateY = -50 * E;
    signalOpacity = Math.min(1, progress / 0.1);
    signalTracking = `${(0.34 - 0.1 * E).toFixed(3)}em`;
  } else {
    signalTranslateY = -50;
    signalOpacity = 1;
    signalTracking = '0.24em';
  }

  // --------------------------------------------------------------------------
  // 2. RESONANCE RING ROTATION & SCALE (0.08 -> 0.95)
  // --------------------------------------------------------------------------
  let ringRotation = 0;
  let ringScale = 1;
  let ringOpacity = 1;

  if (!prefersReducedMotion) {
    ringRotation = -35 + progress * 50; // -35deg -> +15deg
    ringScale = 0.92 + 0.08 * Math.min(1, progress / 0.35);
    ringOpacity = Math.min(1, progress / 0.12);
  }

  // --------------------------------------------------------------------------
  // 3. GIANT ECHOFORM WORDMARK STAGGERED SLOT-DRUM (0.18 -> 0.70)
  // --------------------------------------------------------------------------
  const letterTransforms = wordmarkLetters.map((item, idx) => {
    if (prefersReducedMotion) {
      return {
        translateY: -66.6666666667,
        opacity: 1,
        waveY: 0,
      };
    }

    const startP = 0.18 + item.offset;
    const endP = startP + 0.32;
    const t = Math.min(1, Math.max(0, (progress - startP) / (endP - startP)));
    const E = 3 * t * t - 2 * t * t * t;

    // Upward roll from 0% (Copy 1) to -66.6667% (Copy 3)
    const ty = -66.6666666667 * E;
    const op = Math.min(1, 0.4 + 0.6 * E);

    // Subtle central letter waveform curve during mid-roll (H, O, F, O)
    const isCenter = idx >= 2 && idx <= 5;
    const waveY = isCenter ? Math.sin(t * Math.PI) * -3 : 0;

    return {
      translateY: ty,
      opacity: op,
      waveY,
    };
  });

  const wordmarkMicroScale = prefersReducedMotion
    ? 1
    : 0.985 + Math.sin(progress * Math.PI) * 0.025;

  // --------------------------------------------------------------------------
  // 4. "SOUND TAKES FORM." ROLL + DAMPED ACOUSTIC RESPONSE (0.42 -> 0.76)
  // --------------------------------------------------------------------------
  let taglineTranslateY = -50;
  let taglineOpacity = 1;
  let tagColor = 'var(--color-ion-blue)';
  let soundWaveY = 0;
  let takesWaveY = 0;
  let formWaveY = 0;

  if (!prefersReducedMotion) {
    const t = Math.min(1, Math.max(0, (progress - 0.42) / 0.34));
    let acousticOffset = 0;

    if (t < 0.65) {
      const impactT = t / 0.65;
      acousticOffset = Math.sin(impactT * Math.PI) * -7; // slight overshoot on impact
    } else {
      const reboundT = (t - 0.65) / 0.35;
      acousticOffset = Math.sin(reboundT * Math.PI) * 3; // small rebound
    }

    const E = 3 * t * t - 2 * t * t * t;
    taglineOpacity = Math.min(1, (progress - 0.38) / 0.15);

    // Dynamic wave offsets
    soundWaveY = -2 * Math.sin(t * Math.PI);
    takesWaveY = 3 * Math.sin(t * Math.PI);
    formWaveY = -1 * Math.sin(t * Math.PI);

    // Peak impact cyan brightness shift
    if (t >= 0.55 && t <= 0.75) {
      tagColor = '#A8F4FF';
    } else {
      tagColor = 'var(--color-ion-blue)';
    }

    // Roll translation with acoustic overshoot/rebound
    taglineTranslateY = -50 * E + acousticOffset;
  }

  // --------------------------------------------------------------------------
  // 5. EDITORIAL SOCIALS STAGGERED VERTICAL REVEAL (0.64 -> 0.86)
  // --------------------------------------------------------------------------
  const socialTransforms = socials.map((_, idx) => {
    if (prefersReducedMotion) {
      return { translateY: 0, opacity: 1 };
    }
    const startP = 0.64 + idx * 0.035;
    const endP = startP + 0.12;
    const t = Math.min(1, Math.max(0, (progress - startP) / (endP - startP)));
    const E = 3 * t * t - 2 * t * t * t;
    return {
      translateY: (1 - E) * 26,
      opacity: E,
    };
  });

  // --------------------------------------------------------------------------
  // 6. CLOSING METADATA BAR (0.78 -> 0.94)
  // --------------------------------------------------------------------------
  let metaOpacity = 1;
  let metaTranslateY = 0;

  if (!prefersReducedMotion) {
    const t = Math.min(1, Math.max(0, (progress - 0.78) / 0.16));
    const E = 3 * t * t - 2 * t * t * t;
    metaOpacity = E;
    metaTranslateY = (1 - E) * 10;
  }

  return (
    <footer ref={containerRef} aria-label="Footer" className="site-footer-wrapper">
      <div className="site-footer-sticky">
        <div className="container-12 footer-content">
          {/* Brand Centerpiece & Monumental Typography */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              width: '100%',
              marginTop: 'auto',
            }}
          >
            {/* Closing Transmission Callout (Scroll-Scrubbed Rolling Strip) */}
            <div className="footer-signal-mask">
              <div
                className="footer-signal-strip"
                style={{
                  transform: `translate3d(0, ${signalTranslateY.toFixed(2)}%, 0)`,
                  opacity: signalOpacity,
                  letterSpacing: signalTracking,
                }}
              >
                <span className="footer-signal-line">THE SIGNAL CONTINUES.</span>
                <span className="footer-signal-line">THE SIGNAL CONTINUES.</span>
              </div>
            </div>

            {/* Resonance Ring Symbol (Scroll-Driven Continuous Rotation) */}
            <div
              style={{
                transform: `rotate(${ringRotation.toFixed(1)}deg) scale(${ringScale.toFixed(2)})`,
                opacity: ringOpacity,
                willChange: 'transform, opacity',
              }}
            >
              <ResonanceRingSymbol size={48} />
            </div>

            {/* Monumental Full-Width ECHOFORM Slot-Drum Rolling Wordmark */}
            <div className="footer-wordmark-outer-mask">
              <div
                className="footer-wordmark-inner-wrapper"
                style={{
                  transform: `scale(${wordmarkMicroScale.toFixed(3)})`,
                }}
              >
                <div className="footer-wordmark" aria-label="ECHOFORM">
                  {wordmarkLetters.map((item, idx) => {
                    const { translateY, opacity, waveY } = letterTransforms[idx];
                    return (
                      <div key={idx} className="footer-slot-mask">
                        <div
                          className="footer-slot-strip"
                          style={{
                            transform: `translate3d(0, calc(${translateY.toFixed(
                              3
                            )}% + ${waveY.toFixed(1)}px), 0)`,
                            opacity: opacity,
                          }}
                        >
                          {/* 3 Duplicates for smooth slot-drum rolling */}
                          <span className="footer-slot-char">{item.char}</span>
                          <span className="footer-slot-char">{item.char}</span>
                          <span className="footer-slot-char">{item.char}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* "SOUND TAKES FORM." Scroll-Driven Rolling Tagline + Acoustic Impact */}
            <div className="footer-tagline-mask">
              <div
                className="footer-tagline-strip"
                style={{
                  transform: `translate3d(0, ${taglineTranslateY.toFixed(2)}%, 0)`,
                  opacity: taglineOpacity,
                  color: tagColor,
                }}
              >
                {/* Copy 1 (Initial) */}
                <div className="footer-tagline-row">
                  <span className="footer-tagline-word">SOUND</span>
                  <span className="footer-tagline-word">TAKES</span>
                  <span className="footer-tagline-word">FORM.</span>
                </div>
                {/* Copy 2 (Target Settled with Waveform offsets) */}
                <div className="footer-tagline-row">
                  <span
                    className="footer-tagline-word"
                    style={{ transform: `translate3d(0, ${soundWaveY.toFixed(1)}px, 0)` }}
                  >
                    SOUND
                  </span>
                  <span
                    className="footer-tagline-word"
                    style={{ transform: `translate3d(0, ${takesWaveY.toFixed(1)}px, 0)` }}
                  >
                    TAKES
                  </span>
                  <span
                    className="footer-tagline-word"
                    style={{ transform: `translate3d(0, ${formWaveY.toFixed(1)}px, 0)` }}
                  >
                    FORM.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Social Transmission Links (Masked Scroll Roll) */}
          <ul className="footer-socials-grid">
            {socials.map((item, idx) => {
              const { translateY, opacity } = socialTransforms[idx];
              return (
                <li key={item.index} className="footer-social-mask">
                  <div
                    style={{
                      transform: `translate3d(0, ${translateY.toFixed(1)}px, 0)`,
                      opacity: opacity,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="footer-social-link"
                    >
                      <span className="social-idx">{item.index}</span>
                      <span>{item.name}</span>
                      <span className="social-arrow">↗</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Closing Metadata Bar */}
          <div
            className="footer-bottom-bar"
            style={{
              opacity: metaOpacity,
              transform: `translate3d(0, ${metaTranslateY.toFixed(1)}px, 0)`,
              willChange: 'transform, opacity',
            }}
          >
            <div>BENGALURU / INDIA // 18—19 SEP 2027</div>
            <div>© 2027 ECHOFORM. ALL RIGHTS RESERVED.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
