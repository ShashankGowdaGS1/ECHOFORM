import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { HeroNoteField } from '../components/HeroNoteField';
import { FrequencyChargeButton } from '../components/FrequencyChargeButton';

export const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFlashed, setHasFlashed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Calibration counters
  const [stageCount, setStageCount] = useState(0);
  const [artistCount, setArtistCount] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Trigger entry assembly sequence on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Trigger spectral flash on ECHOFORM after lock
  useEffect(() => {
    if (isLoaded && !hasFlashed && !prefersReducedMotion) {
      const flashTimer = setTimeout(() => {
        setHasFlashed(true);
      }, 950);
      return () => clearTimeout(flashTimer);
    }
  }, [isLoaded, hasFlashed, prefersReducedMotion]);

  // Mechanical calibration counters (0 -> 3, 0 -> 24)
  useEffect(() => {
    if (prefersReducedMotion) {
      setStageCount(3);
      setArtistCount(24);
      return;
    }

    if (!isLoaded) return;

    const startTimer = setTimeout(() => {
      const startTime = performance.now();
      const duration = 550;

      const updateCount = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 3 * progress * progress - 2 * progress * progress * progress;

        setStageCount(Math.round(ease * 3));
        setArtistCount(Math.round(ease * 24));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setStageCount(3);
          setArtistCount(24);
        }
      };

      requestAnimationFrame(updateCount);
    }, 850);

    return () => clearTimeout(startTimer);
  }, [isLoaded, prefersReducedMotion]);

  // Track Hero local scroll progress for scroll-scrubbed deconstruction
  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const heroHeight = window.innerHeight;
        const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.75)));
        setScrollProgress(progress);
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  // --------------------------------------------------------------------------
  // SCROLL EXIT INTERPOLATIONS (0.00 -> 1.00)
  // --------------------------------------------------------------------------

  // 1. Top Metadata (0.12 -> 0.28)
  const topMetaExitT = Math.min(1, Math.max(0, (scrollProgress - 0.12) / 0.16));
  const topMetaOpacity = 1 - topMetaExitT;
  const topMetaLeftX = -20 * topMetaExitT;
  const topMetaRightX = 20 * topMetaExitT;

  // 2. Description Lines Reverse Retract (0.20 -> 0.42)
  const descLine3ExitT = Math.min(1, Math.max(0, (scrollProgress - 0.20) / 0.10));
  const descLine2ExitT = Math.min(1, Math.max(0, (scrollProgress - 0.26) / 0.10));
  const descLine1ExitT = Math.min(1, Math.max(0, (scrollProgress - 0.32) / 0.10));

  // 3. CTA Buttons Exit (0.28 -> 0.50)
  const ctaExitT = Math.min(1, Math.max(0, (scrollProgress - 0.28) / 0.22));
  const ctaOpacity = 1 - ctaExitT;
  const ctaScale = 1 - 0.04 * ctaExitT;

  // 4. "SOUND TAKES FORM." Compress & Dissolve (0.32 -> 0.60)
  const taglineExitT = Math.min(1, Math.max(0, (scrollProgress - 0.32) / 0.28));
  const taglineScaleX = 1 - 0.25 * taglineExitT;
  const taglineTracking = `${(0.1 - 0.08 * taglineExitT).toFixed(3)}em`;
  const taglineOpacity = 1 - taglineExitT;

  // 5. ECHOFORM Wordmark Separate & Compress (0.38 -> 0.68)
  const echoformExitT = Math.min(1, Math.max(0, (scrollProgress - 0.38) / 0.30));
  const echoformScaleX = 1 - 0.12 * echoformExitT;
  const echoformOpacity = 1 - echoformExitT;
  const echoformSeparation = 3 * echoformExitT; // vw

  // 6. Bottom Metadata Exit (0.12 -> 0.28)
  const bottomMetaExitT = Math.min(1, Math.max(0, (scrollProgress - 0.12) / 0.16));
  const bottomMetaOpacity = 1 - bottomMetaExitT;
  const bottomMetaY = 12 * bottomMetaExitT;

  // 7. Discover The Gate Exit (0.60 -> 0.76)
  const gateCtaExitT = Math.min(1, Math.max(0, (scrollProgress - 0.60) / 0.16));
  const gateCtaOpacity = 1 - gateCtaExitT;
  const gateCtaY = 8 * gateCtaExitT;

  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="hero-section"
      style={{ position: 'relative' }}
    >
      {/* Background Gate Visual seamlessly blended into Void */}
      <div className="hero-bg-gate">
        <img
          src="/assets/images/resonance-gate-hero.jpg"
          alt="The Resonance Gate"
          loading="eager"
        />
      </div>

      {/* Decorative Cursor-Reactive Musical Note / Sound Fragment Field */}
      <HeroNoteField />

      {/* Top Header Status Tag */}
      <div className="container-12" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-top-bar">
          {/* Top-Left Signal-Scan Reveal */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: prefersReducedMotion ? 1 : isLoaded ? topMetaOpacity : 0,
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${isLoaded ? topMetaLeftX : -18}px, 0, 0)`,
              clipPath: prefersReducedMotion || isLoaded ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: prefersReducedMotion
                ? 'none'
                : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#7867FF',
                borderRadius: '50%',
                flexShrink: 0,
                boxShadow: '0 0 6px #7867FF',
              }}
            />
            <span>IMMERSIVE MUSIC + DIGITAL ARTS FESTIVAL</span>
          </div>

          {/* Top-Right Staggered Date & Location Resolve */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              opacity: prefersReducedMotion ? 1 : isLoaded ? topMetaOpacity : 0,
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${isLoaded ? topMetaRightX : 18}px, 0, 0)`,
              transition: prefersReducedMotion
                ? 'none'
                : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s',
            }}
          >
            <span
              style={{
                opacity: prefersReducedMotion || isLoaded ? 1 : 0,
                transform: prefersReducedMotion || isLoaded ? 'translateX(0)' : 'translateX(10px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s',
              }}
            >
              18—19 SEP 2027
            </span>
            <span
              style={{
                color: 'var(--color-dim-gray)',
                opacity: prefersReducedMotion || isLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease 0.14s',
              }}
            >
              //
            </span>
            <span
              style={{
                opacity: prefersReducedMotion || isLoaded ? 1 : 0,
                transform: prefersReducedMotion || isLoaded ? 'translateX(0)' : 'translateX(10px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.20s',
              }}
            >
              BENGALURU, INDIA
            </span>
          </div>
        </div>
      </div>

      {/* Center Monumental Content */}
      <div className="container-12 hero-content">
        {/* ECHOFORM Main Title (Horizontal Compression -> Expansion / Lock + Spectral Flash) */}
        <h1
          className={`hero-title ${hasFlashed ? 'hero-spectral-flash' : ''}`}
          style={{
            opacity: prefersReducedMotion ? 1 : isLoaded ? echoformOpacity : 0,
            transform: prefersReducedMotion
              ? 'none'
              : `scaleX(${isLoaded ? echoformScaleX : 0.78})`,
            letterSpacing: prefersReducedMotion ? '-0.04em' : isLoaded ? '-0.04em' : '-0.07em',
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s, letter-spacing 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s',
          }}
        >
          <span
            className="hero-word-echo"
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${
                    isLoaded ? `-${echoformSeparation.toFixed(2)}vw` : '-24px'
                  }, 0, 0)`,
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s',
            }}
          >
            ECHO
          </span>
          <span
            className="hero-word-form"
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${isLoaded ? `${echoformSeparation.toFixed(2)}vw` : '24px'}, 0, 0)`,
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s',
            }}
          >
            FORM
          </span>
        </h1>

        {/* "SOUND TAKES FORM." (Frequency Wave Text Reveal) */}
        <p
          className="hero-tagline"
          style={{
            opacity: prefersReducedMotion ? 1 : isLoaded ? taglineOpacity : 0,
            transform: prefersReducedMotion
              ? 'none'
              : `scaleX(${isLoaded ? taglineScaleX : 0.96})`,
            letterSpacing: prefersReducedMotion ? '0.1em' : isLoaded ? taglineTracking : '0.16em',
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.38s, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.38s, letter-spacing 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.38s',
          }}
        >
          <span
            className="hero-tagline-word"
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : isLoaded
                ? 'translateY(0)'
                : 'translateY(8px)',
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.38s',
            }}
          >
            SOUND
          </span>
          <span
            className="hero-tagline-word"
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : isLoaded
                ? 'translateY(0)'
                : 'translateY(-5px)',
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.44s',
            }}
          >
            TAKES
          </span>
          <span
            className="hero-tagline-word"
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : isLoaded
                ? 'translateY(0)'
                : 'translateY(7px)',
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.50s',
            }}
          >
            FORM.
          </span>
        </p>

        {/* Description Paragraph (Line-by-Line Staggered Horizontal Mask Reveal) */}
        <div className="hero-lead">
          <span
            className="hero-desc-line"
            style={{
              opacity: prefersReducedMotion ? 1 : isLoaded ? 1 - descLine1ExitT : 0,
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${isLoaded ? -14 * descLine1ExitT : 18}px, 0, 0)`,
              clipPath:
                prefersReducedMotion || isLoaded ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: prefersReducedMotion
                ? 'none'
                : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.58s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.58s, clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.58s',
            }}
          >
            Where <span className="hero-em-word">spatial acoustic physics</span>, monolithic
          </span>
          <span
            className="hero-desc-line"
            style={{
              opacity: prefersReducedMotion ? 1 : isLoaded ? 1 - descLine2ExitT : 0,
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${isLoaded ? -14 * descLine2ExitT : 18}px, 0, 0)`,
              clipPath:
                prefersReducedMotion || isLoaded ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: prefersReducedMotion
                ? 'none'
                : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.68s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.68s, clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.68s',
            }}
          >
            <span className="hero-em-word">titanium architecture</span>, and generative
          </span>
          <span
            className="hero-desc-line"
            style={{
              opacity: prefersReducedMotion ? 1 : isLoaded ? 1 - descLine3ExitT : 0,
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${isLoaded ? -14 * descLine3ExitT : 18}px, 0, 0)`,
              clipPath:
                prefersReducedMotion || isLoaded ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: prefersReducedMotion
                ? 'none'
                : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.78s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.78s, clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.78s',
            }}
          >
            <span className="hero-em-word">laser light</span> converge into a singular festival
            experience.
          </span>
        </div>

        {/* CTA Buttons (Horizontal Assembly Reveal + Existing Microinteractions) */}
        <div
          className="hero-ctas"
          style={{
            opacity: prefersReducedMotion ? 1 : isLoaded ? ctaOpacity : 0,
            transform: prefersReducedMotion ? 'none' : `scale(${isLoaded ? ctaScale : 0.95})`,
            pointerEvents: scrollProgress > 0.45 ? 'none' : 'auto',
            transition: prefersReducedMotion
              ? 'none'
              : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.85s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.85s',
          }}
        >
          <div
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : isLoaded
                ? 'translateX(0)'
                : 'translateX(-22px)',
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.85s',
            }}
          >
            <FrequencyChargeButton
              href="#passes"
              label="GET PASSES"
              arrow="↗"
              intensity="hero"
            />
          </div>

          <div
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : isLoaded
                ? 'translateX(0)'
                : 'translateX(22px)',
              transition: prefersReducedMotion
                ? 'none'
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.92s',
            }}
          >
            <a href="#resonance" className="btn-secondary">
              EXPLORE ↓
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="container-12" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-status-bar">
          {/* Bottom-Left Calibration Values Count */}
          <div
            style={{
              opacity: prefersReducedMotion ? 1 : isLoaded ? bottomMetaOpacity : 0,
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(0, ${isLoaded ? bottomMetaY : 12}px, 0)`,
              clipPath: prefersReducedMotion || isLoaded ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: prefersReducedMotion
                ? 'none'
                : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.98s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.98s, clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.98s',
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--color-lunar-white)' }}>
              {stageCount} MONOLITHIC STAGES
            </span>
            <span style={{ color: 'var(--color-dim-gray)', margin: '0 0.75rem' }}>//</span>
            <span style={{ fontWeight: 700, color: 'var(--color-ion-blue)' }}>
              {artistCount} GLOBAL ARTISTS
            </span>
          </div>

          {/* Bottom-Right "DISCOVER THE GATE ↓" */}
          <a
            href="#resonance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-resonance-violet)',
              opacity: prefersReducedMotion ? 1 : isLoaded ? gateCtaOpacity : 0,
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(0, ${isLoaded ? gateCtaY : 10}px, 0)`,
              transition: prefersReducedMotion
                ? 'none'
                : 'color 0.2s ease, opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.08s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.08s',
            }}
          >
            <span>DISCOVER THE GATE</span>
            <ArrowDown size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
