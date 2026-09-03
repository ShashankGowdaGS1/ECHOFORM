import React, { useRef, useState, useEffect } from 'react';
import { FEATURED_ARTISTS, ALL_ARTISTS, type Artist } from '../data/artists';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

// 6 rows of 4 artists = 24 artists total
const ROSTER_ROWS = [
  ALL_ARTISTS.slice(0, 4),   // Row 1: 01-04
  ALL_ARTISTS.slice(4, 8),   // Row 2: 05-08
  ALL_ARTISTS.slice(8, 12),  // Row 3: 09-12
  ALL_ARTISTS.slice(12, 16), // Row 4: 13-16
  ALL_ARTISTS.slice(16, 20), // Row 5: 17-20
  ALL_ARTISTS.slice(20, 24), // Row 6: 21-24
];

export const LineupSection: React.FC = () => {
  const spotlightContainerRef = useRef<HTMLDivElement | null>(null);
  const rosterContainerRef = useRef<HTMLDivElement | null>(null);

  const { progress: spotlightProgress } = useScrollProgress(spotlightContainerRef);
  const { progress: rosterProgress } = useScrollProgress(rosterContainerRef);

  // Check for prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualSpotlightIdx, setManualSpotlightIdx] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // --------------------------------------------------------------------------
  // HEADLINER SPOTLIGHT PROGRESS CALCULATIONS (0.0 -> 1.0 across 6 artists)
  // --------------------------------------------------------------------------
  const N = FEATURED_ARTISTS.length; // 6
  const maxIdx = N - 1; // 5

  const rawCoord = Math.min(Math.max(spotlightProgress * maxIdx, 0), maxIdx);
  const baseIdx = Math.min(Math.floor(rawCoord), maxIdx - 1);
  const chapterFrac = rawCoord - baseIdx;

  let smoothCoord = rawCoord;
  let textOpacity = 1;
  let textTranslateY = 0;
  let displayIndex = baseIdx;

  if (rawCoord >= maxIdx) {
    smoothCoord = maxIdx;
    displayIndex = maxIdx;
    textOpacity = 1;
    textTranslateY = 0;
  } else {
    const holdBoundary = 0.65;
    if (chapterFrac < holdBoundary) {
      smoothCoord = baseIdx;
      displayIndex = baseIdx;
      textOpacity = 1;
      textTranslateY = 0;
    } else {
      const t = (chapterFrac - holdBoundary) / (1 - holdBoundary);
      const easedT = 3 * t * t - 2 * t * t * t;
      smoothCoord = baseIdx + easedT;

      if (t < 0.5) {
        displayIndex = baseIdx;
        const outProgress = t / 0.5;
        textOpacity = 1 - outProgress;
        textTranslateY = -16 * outProgress;
      } else {
        displayIndex = Math.min(baseIdx + 1, maxIdx);
        const inProgress = (t - 0.5) / 0.5;
        textOpacity = inProgress;
        textTranslateY = 16 * (1 - inProgress);
      }
    }
  }

  const activeArtist: Artist = FEATURED_ARTISTS[displayIndex] || FEATURED_ARTISTS[0];

  const handleSpotlightNav = (direction: 'prev' | 'next') => {
    if (prefersReducedMotion) {
      if (direction === 'next') {
        setManualSpotlightIdx((prev) => (prev + 1) % N);
      } else {
        setManualSpotlightIdx((prev) => (prev - 1 + N) % N);
      }
      return;
    }

    const targetIdx = direction === 'next'
      ? Math.min(displayIndex + 1, maxIdx)
      : Math.max(displayIndex - 1, 0);

    const el = spotlightContainerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const scrollableDistance = rect.height - window.innerHeight;

    if (scrollableDistance > 0) {
      const targetProgress = targetIdx / maxIdx;
      const targetScrollY = containerTop + scrollableDistance * targetProgress;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  // --------------------------------------------------------------------------
  // ROSTER PROGRESS CALCULATIONS (0.0 -> 1.0 across 6 rows)
  // --------------------------------------------------------------------------
  // Row reveal thresholds:
  // Row 1: always active at 0.00
  // Row 2: 0.10 -> 0.22
  // Row 3: 0.24 -> 0.36
  // Row 4: 0.38 -> 0.50
  // Row 5: 0.52 -> 0.64
  // Row 6: 0.66 -> 0.78
  // Complete Hold: 0.78 -> 0.94
  // Release: 0.94 -> 1.00

  const getRowState = (rowIdx: number) => {
    if (rowIdx === 0) {
      return { isVisible: true, progress: 1, dividerScale: 1, contentOpacity: 1, contentTx: 0 };
    }

    const start = 0.10 + (rowIdx - 1) * 0.14;
    const end = start + 0.12;

    if (rosterProgress < start) {
      return { isVisible: false, progress: 0, dividerScale: 0, contentOpacity: 0, contentTx: 2.5 };
    }

    if (rosterProgress >= end) {
      return { isVisible: true, progress: 1, dividerScale: 1, contentOpacity: 1, contentTx: 0 };
    }

    const rawT = (rosterProgress - start) / (end - start);
    const easedT = 3 * rawT * rawT - 2 * rawT * rawT * rawT;

    return {
      isVisible: true,
      progress: easedT,
      dividerScale: easedT,
      contentOpacity: easedT,
      contentTx: 2.5 * (1 - easedT),
    };
  };

  // Number of currently active rows (1 to 6)
  let activeRowCount = 1;
  for (let r = 1; r < 6; r++) {
    const start = 0.10 + (r - 1) * 0.14;
    if (rosterProgress >= start + 0.04) {
      activeRowCount = r + 1;
    }
  }

  // --------------------------------------------------------------------------
  // REDUCED MOTION ACCESSIBLE FALLBACK
  // --------------------------------------------------------------------------
  if (prefersReducedMotion) {
    const reducedArtist = FEATURED_ARTISTS[manualSpotlightIdx];
    return (
      <section
        id="lineup"
        aria-label="Lineup Section"
        className="section-spacing"
        style={{ backgroundColor: 'var(--color-void)', borderBottom: '1px solid var(--color-graphite)' }}
      >
        <div className="container-12">
          {/* Section Header */}
          <div className="section-header">
            <div>
              <div className="section-label" style={{ color: 'var(--color-ion-blue)' }}>
                ARTIST PROGRAMME
              </div>
              <h2 className="section-title">THE SIGNAL.</h2>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-lunar-white)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              24 ARTISTS / 3 STAGES / 2 NIGHTS
            </div>
          </div>

          {/* Static Spotlight Grid */}
          <div className="lineup-spotlight-grid">
            <div className="spotlight-info">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-resonance-violet)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  0{manualSpotlightIdx + 1} // HEADLINER • {reducedArtist.stage} STAGE
                </div>
                <h3 className="spotlight-artist-name">{reducedArtist.name}</h3>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-ion-blue)', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                  {reducedArtist.tagline}
                </div>
              </div>

              <blockquote style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--color-resonance-violet)', fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--color-muted-silver)', fontStyle: 'italic', lineHeight: '1.5' }}>
                "{reducedArtist.statement}"
              </blockquote>

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-carbon)', border: '1px solid var(--color-graphite)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                  <span style={{ color: 'var(--color-dim-gray)' }}>TIME & STAGE:</span>
                  <span style={{ color: 'var(--color-lunar-white)', fontWeight: 700 }}>{reducedArtist.day} // {reducedArtist.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                  <span style={{ color: 'var(--color-dim-gray)' }}>ACOUSTIC FORMAT:</span>
                  <span style={{ color: 'var(--color-ion-blue)' }}>{reducedArtist.specs.format}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                  <span style={{ color: 'var(--color-dim-gray)' }}>ORIGIN:</span>
                  <span style={{ color: 'var(--color-lunar-white)' }}>{reducedArtist.country}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-graphite)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-muted-silver)' }}>
                  0{manualSpotlightIdx + 1} / 0{FEATURED_ARTISTS.length} SPOTLIGHT
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleSpotlightNav('prev')}
                    style={{ padding: '0.75rem', border: '1px solid var(--color-graphite)', color: 'var(--color-lunar-white)', backgroundColor: 'var(--color-carbon)' }}
                    aria-label="Previous artist"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpotlightNav('next')}
                    style={{ padding: '0.75rem', border: '1px solid var(--color-graphite)', color: 'var(--color-lunar-white)', backgroundColor: 'var(--color-carbon)' }}
                    aria-label="Next artist"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="spotlight-media-card">
              <img src={reducedArtist.image} alt={`${reducedArtist.name} Editorial Portrait`} />
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta-xs)', color: 'var(--color-ion-blue)', letterSpacing: '0.14em', textTransform: 'uppercase', backgroundColor: 'rgba(5, 5, 6, 0.9)', border: '1px solid var(--color-graphite)', padding: '0.4rem 0.8rem' }}>
                {reducedArtist.genre}
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-lunar-white)', backgroundColor: 'rgba(5, 5, 6, 0.92)', backdropFilter: 'blur(8px)', border: '1px solid var(--color-graphite)', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{reducedArtist.name}</span>
                <span style={{ color: 'var(--color-resonance-violet)' }}>{reducedArtist.day} @ {reducedArtist.stage}</span>
              </div>
            </div>
          </div>

          {/* Complete 24-Artist Roster Static Flow */}
          <div style={{ paddingTop: '4rem', borderTop: '1px solid var(--color-graphite)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-resonance-violet)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2rem' }}>
              COMPLETE 24-ARTIST ROSTER
            </div>
            <div className="roster-grid-4col">
              {ALL_ARTISTS.map((artist, idx) => (
                <div key={artist.id} className="roster-editorial-row">
                  <div className="roster-meta-top">
                    <span style={{ color: 'var(--color-dim-gray)' }}>{String(idx + 1).padStart(2, '0')} //</span>
                    <span style={{ color: 'var(--color-ion-blue)', fontWeight: 600 }}>{artist.origin}</span>
                  </div>
                  <div className="roster-artist-name">{artist.name}</div>
                  <div className="roster-meta-bottom">
                    <span>{artist.stage}</span>
                    <span style={{ color: 'var(--color-muted-silver)' }}>{artist.day} • {artist.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // PRIMARY TWO-STAGE SCROLL EXPERIENCE
  // --------------------------------------------------------------------------
  return (
    <div
      id="lineup"
      style={{
        backgroundColor: 'var(--color-void)',
        borderBottom: '1px solid var(--color-graphite)',
      }}
    >
      {/* --------------------------------------------------------------------
          STAGE 1: 420vh Sticky Scroll Container for 6-Headliner Spotlight
          -------------------------------------------------------------------- */}
      <section
        ref={spotlightContainerRef}
        aria-label="The Signal Artist Spotlight"
        style={{
          position: 'relative',
          height: '420vh',
        }}
      >
        {/* Sticky 100vh Viewport Stage */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-void)',
          }}
        >
          <div className="container-12" style={{ width: '100%' }}>
            {/* Section Header (Anchored with subtle scroll response) */}
            <div
              className="section-header"
              style={{
                marginBottom: '2.5rem',
                transform: `translateY(${spotlightProgress * -10}px)`,
                transition: 'transform 0.08s linear',
              }}
            >
              <div>
                <div className="section-label" style={{ color: 'var(--color-ion-blue)' }}>
                  ARTIST PROGRAMME
                </div>
                <h2 className="section-title">THE SIGNAL.</h2>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--color-lunar-white)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                24 ARTISTS / 3 STAGES / 2 NIGHTS
              </div>
            </div>

            {/* Dominant Editorial Artist Spotlight */}
            <div className="lineup-spotlight-grid" style={{ marginBottom: 0 }}>
              {/* Left Column: Spotlight Info */}
              <div className="spotlight-info">
                <div
                  style={{
                    opacity: textOpacity,
                    transform: `translateY(${textTranslateY}px)`,
                    transition: 'opacity 0.08s linear, transform 0.08s linear',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-meta)',
                      color: 'var(--color-resonance-violet)',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                    }}
                  >
                    0{displayIndex + 1} // HEADLINER • {activeArtist.stage} STAGE
                  </div>
                  <h3 className="spotlight-artist-name">
                    {activeArtist.name}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '1.15rem',
                      color: 'var(--color-ion-blue)',
                      textTransform: 'uppercase',
                      marginTop: '0.5rem',
                    }}
                  >
                    {activeArtist.tagline}
                  </div>
                </div>

                <blockquote
                  style={{
                    paddingLeft: '1rem',
                    borderLeft: '2px solid var(--color-resonance-violet)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    color: 'var(--color-muted-silver)',
                    fontStyle: 'italic',
                    lineHeight: '1.5',
                    opacity: textOpacity,
                    transform: `translateY(${textTranslateY * 0.75}px)`,
                    transition: 'opacity 0.08s linear, transform 0.08s linear',
                  }}
                >
                  "{activeArtist.statement}"
                </blockquote>

                {/* Set Details */}
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-carbon)',
                    border: '1px solid var(--color-graphite)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-meta)',
                    opacity: textOpacity,
                    transform: `translateY(${textTranslateY * 0.5}px)`,
                    transition: 'opacity 0.08s linear, transform 0.08s linear',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                    <span style={{ color: 'var(--color-dim-gray)' }}>TIME & STAGE:</span>
                    <span style={{ color: 'var(--color-lunar-white)', fontWeight: 700 }}>
                      {activeArtist.day} // {activeArtist.time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                    <span style={{ color: 'var(--color-dim-gray)' }}>ACOUSTIC FORMAT:</span>
                    <span style={{ color: 'var(--color-ion-blue)' }}>{activeArtist.specs.format}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                    <span style={{ color: 'var(--color-dim-gray)' }}>ORIGIN:</span>
                    <span style={{ color: 'var(--color-lunar-white)' }}>{activeArtist.country}</span>
                  </div>
                </div>

                {/* Artist Switcher Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-graphite)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-meta)',
                      color: 'var(--color-muted-silver)',
                      letterSpacing: '0.12em',
                    }}
                  >
                    0{displayIndex + 1} / 0{FEATURED_ARTISTS.length} SPOTLIGHT
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleSpotlightNav('prev')}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid var(--color-graphite)',
                        color: 'var(--color-lunar-white)',
                        backgroundColor: 'var(--color-carbon)',
                        cursor: displayIndex > 0 ? 'pointer' : 'default',
                        opacity: displayIndex > 0 ? 1 : 0.4,
                        transition: 'opacity 0.2s, background-color 0.2s',
                      }}
                      aria-label="Previous artist"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpotlightNav('next')}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid var(--color-graphite)',
                        color: 'var(--color-lunar-white)',
                        backgroundColor: 'var(--color-carbon)',
                        cursor: displayIndex < maxIdx ? 'pointer' : 'default',
                        opacity: displayIndex < maxIdx ? 1 : 0.4,
                        transition: 'opacity 0.2s, background-color 0.2s',
                      }}
                      aria-label="Next artist"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Spatial Multi-Layer Media Plane */}
              <div
                className="spotlight-media-card"
                style={{
                  perspective: '1200px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {FEATURED_ARTISTS.map((artist, idx) => {
                  const delta = idx - smoothCoord;

                  if (Math.abs(delta) > 1.3) {
                    return null;
                  }

                  let layerOpacity = 0;
                  let layerTransform = '';

                  if (delta <= 0) {
                    const p = -delta;
                    layerOpacity = Math.max(0, 1 - p * 1.15);
                    const tx = -13 * p;
                    const scale = 1 - 0.08 * p;
                    const rotY = 3.5 * p;
                    layerTransform = `translateX(${tx}vw) scale(${scale}) rotateY(${rotY}deg)`;
                  } else {
                    const p = delta;
                    layerOpacity = Math.max(0, 1 - p * 1.15);
                    const tx = 16 * p;
                    const scale = 1 + 0.06 * p;
                    const rotY = -3.5 * p;
                    layerTransform = `translateX(${tx}vw) scale(${scale}) rotateY(${rotY}deg)`;
                  }

                  const zIndex = Math.round(10 - Math.abs(delta) * 5);

                  return (
                    <div
                      key={artist.id}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: layerOpacity,
                        transform: layerTransform,
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                        willChange: 'transform, opacity',
                        zIndex,
                        transition: 'opacity 0.08s linear, transform 0.08s linear',
                      }}
                    >
                      <img
                        src={artist.image}
                        alt={`${artist.name} Editorial Portrait`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'contrast(115%) brightness(100%)',
                        }}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          top: '1.5rem',
                          right: '1.5rem',
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
                        {artist.genre}
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
                        <span style={{ fontWeight: 700 }}>{artist.name}</span>
                        <span style={{ color: 'var(--color-resonance-violet)' }}>
                          {artist.day} @ {artist.stage}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          STAGE 2: 330vh Independent Sticky Progressive Roster Sequence
          -------------------------------------------------------------------- */}
      <section
        ref={rosterContainerRef}
        aria-label="Complete 24-Artist Roster Progressive Build"
        style={{
          position: 'relative',
          height: '330vh',
          borderTop: '1px solid var(--color-graphite)',
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
            {/* Header: Label + Synchronized Transmission Indicator */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-meta)',
                  color: 'var(--color-resonance-violet)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                COMPLETE 24-ARTIST ROSTER
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--color-ion-blue)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  backgroundColor: 'rgba(5, 5, 6, 0.85)',
                  border: '1px solid var(--color-graphite)',
                  padding: '0.3rem 0.65rem',
                }}
              >
                ROSTER TRANSMISSION // 0{activeRowCount} OF 06
              </div>
            </div>

            {/* 6 Pre-reserved Progressive Row Slots (Zero Layout Shift) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ROSTER_ROWS.map((rowArtists, rowIdx) => {
                const state = getRowState(rowIdx);
                const isScanning = state.progress > 0 && state.progress < 1;

                return (
                  <div
                    key={`roster-row-${rowIdx}`}
                    style={{
                      position: 'relative',
                      borderTop: '1px solid var(--color-graphite)',
                    }}
                  >
                    {/* Active Frequency Scan Light (1px traveling highlight) */}
                    {isScanning && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-1px',
                          left: `${state.progress * 100}%`,
                          width: '60px',
                          height: '2px',
                          transform: 'translateX(-100%)',
                          background: 'linear-gradient(90deg, transparent 0%, var(--color-ion-blue) 50%, var(--color-lunar-white) 100%)',
                          boxShadow: '0 0 10px rgba(114, 228, 255, 0.8)',
                          zIndex: 10,
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    {/* 4-Column Row Content with Horizontal Clip & Translation */}
                    <div
                      className="roster-grid-4col"
                      style={{
                        borderTop: 'none',
                        opacity: state.contentOpacity,
                        transform: `translateX(${state.contentTx}vw)`,
                        clipPath: state.isVisible && state.progress < 1
                          ? `inset(0 ${(1 - state.progress) * 100}% 0 0)`
                          : 'none',
                        visibility: state.isVisible ? 'visible' : 'hidden',
                        transition: 'opacity 0.08s linear, transform 0.08s linear',
                      }}
                    >
                      {rowArtists.map((artist, colIdx) => {
                        const globalIdx = rowIdx * 4 + colIdx;
                        return (
                          <div key={artist.id} className="roster-editorial-row">
                            <div className="roster-meta-top">
                              <span style={{ color: 'var(--color-dim-gray)' }}>
                                {String(globalIdx + 1).padStart(2, '0')} //
                              </span>
                              <span style={{ color: 'var(--color-ion-blue)', fontWeight: 600 }}>
                                {artist.origin}
                              </span>
                            </div>

                            <div className="roster-artist-name">
                              {artist.name}
                            </div>

                            <div className="roster-meta-bottom">
                              <span>{artist.stage}</span>
                              <span style={{ color: 'var(--color-muted-silver)' }}>
                                {artist.day} • {artist.time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
