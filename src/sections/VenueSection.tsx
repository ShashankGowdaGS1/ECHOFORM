import React, { useRef, useState, useEffect } from 'react';
import { VENUE_ZONES, type VenueZone } from '../data/venue';
import { MapPin } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const VenueSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { progress } = useScrollProgress(containerRef);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualZoneId, setManualZoneId] = useState<string>('entry');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // --------------------------------------------------------------------------
  // ACTIVE ZONE DERIVATION & ROUTE PROGRESS (Local 0.0 -> 1.0 across 420vh)
  // --------------------------------------------------------------------------
  // 0.00 - 0.23: ZONE_00 (ENTRY)
  // 0.23 - 0.43: ZONE_01 (CORE)
  // 0.43 - 0.63: ZONE_02 (VOID)
  // 0.63 - 0.82: ZONE_03 (SIGNAL)
  // 0.82 - 0.94: ZONE_04 (ARTS)
  // 0.94 - 1.00: ZONE_05 (REST)

  let activeZoneIdx = 0;
  if (progress >= 0.23 && progress < 0.43) activeZoneIdx = 1;
  else if (progress >= 0.43 && progress < 0.63) activeZoneIdx = 2;
  else if (progress >= 0.63 && progress < 0.82) activeZoneIdx = 3;
  else if (progress >= 0.82 && progress < 0.94) activeZoneIdx = 4;
  else if (progress >= 0.94) activeZoneIdx = 5;

  const currentZone: VenueZone = prefersReducedMotion
    ? VENUE_ZONES.find((z) => z.id === manualZoneId) || VENUE_ZONES[0]
    : VENUE_ZONES[activeZoneIdx];

  // Route drawing ratios (0 to 1 for each of the 5 connecting segments)
  const getRouteRatio = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress >= end) return 1;
    const t = (progress - start) / (end - start);
    return 3 * t * t - 2 * t * t * t;
  };

  const route0Ratio = getRouteRatio(0.16, 0.26); // ENTRY -> CORE
  const route1Ratio = getRouteRatio(0.36, 0.46); // CORE -> VOID
  const route2Ratio = getRouteRatio(0.56, 0.66); // VOID -> SIGNAL
  const route3Ratio = getRouteRatio(0.76, 0.84); // SIGNAL -> ARTS
  const route4Ratio = getRouteRatio(0.90, 0.95); // ARTS -> REST

  // Node states helper: 0=Future, 1=Active, 2=Visited
  const getNodeState = (nodeIdx: number) => {
    if (nodeIdx < activeZoneIdx) return 'visited';
    if (nodeIdx === activeZoneIdx) return 'active';
    return 'future';
  };

  const handleZoneNav = (zoneId: string) => {
    if (prefersReducedMotion) {
      setManualZoneId(zoneId);
      return;
    }

    const targetMap: Record<string, number> = {
      entry: 0.10,
      'core-arena': 0.33,
      'void-bunker': 0.53,
      'signal-canopy': 0.73,
      'art-district': 0.88,
      'rest-commons': 0.97,
    };

    const targetP = targetMap[zoneId] ?? 0.10;
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const scrollableDistance = rect.height - window.innerHeight;

    if (scrollableDistance > 0) {
      window.scrollTo({
        top: containerTop + scrollableDistance * targetP,
        behavior: 'smooth',
      });
    }
  };

  // --------------------------------------------------------------------------
  // REDUCED MOTION ACCESSIBLE FALLBACK
  // --------------------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <section
        id="venue"
        aria-label="Venue Section"
        className="section-spacing"
        style={{ backgroundColor: 'var(--color-void)', borderBottom: '1px solid var(--color-graphite)' }}
      >
        <div className="container-12">
          {/* Section Header */}
          <div className="section-header">
            <div>
              <div className="section-label" style={{ color: 'var(--color-ion-blue)' }}>
                SPATIAL MASTERPLAN
              </div>
              <h2 className="section-title">THE ECHOFORM GROUNDS.</h2>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-muted-silver)', textAlign: 'right' }}>
              <div style={{ color: 'var(--color-lunar-white)', fontWeight: 700 }}>BENGALURU INDUSTRIAL ARTS COMPLEX</div>
              <div style={{ color: 'var(--color-resonance-violet)' }}>12.9716° N, 77.5946° E</div>
            </div>
          </div>

          <div className="venue-master-grid">
            <div className="venue-blueprint-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta-xs)', color: 'var(--color-dim-gray)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{ color: 'var(--color-ion-blue)' }}>SITE BLUEPRINT // BENGALURU</span>
                <span>1:500 SCALE</span>
              </div>

              <div style={{ width: '100%', height: '80%', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 500 360" style={{ width: '100%', height: '100%' }} fill="none">
                  <pattern id="venueGridReduced" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#17171B" strokeWidth="0.8" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#venueGridReduced)" />
                  <circle cx="250" cy="180" r="140" stroke="#7867FF" strokeWidth="1" strokeDasharray="6 6" opacity="0.25" />
                  <circle cx="250" cy="180" r="90" stroke="#72E4FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
                  <circle cx="250" cy="180" r="50" stroke="#F0F0EC" strokeWidth="1.5" opacity="0.5" />

                  <path d="M 70 300 L 160 240 L 250 180" stroke="#7867FF" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 250 180 L 310 220 L 370 255" stroke="#72E4FF" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 370 255 L 410 180 L 385 100" stroke="#7867FF" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 385 100 L 250 80 L 120 100" stroke="#72E4FF" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 120 100 L 250 180 L 340 235 L 430 290" stroke="#F0F0EC" strokeWidth="1.5" strokeDasharray="4 4" />

                  <g onClick={() => handleZoneNav('entry')} style={{ cursor: 'pointer' }}>
                    <circle cx="70" cy="300" r="16" fill="#050506" stroke={manualZoneId === 'entry' ? '#72E4FF' : '#17171B'} strokeWidth="2" />
                    <circle cx="70" cy="300" r="5" fill="#72E4FF" />
                    <text x="70" y="330" textAnchor="middle" fill="#A4A4A6" fontSize="11" fontFamily="Space Mono" fontWeight="bold">00.ENTRY</text>
                  </g>
                  <g onClick={() => handleZoneNav('core-arena')} style={{ cursor: 'pointer' }}>
                    <rect x="210" y="140" width="80" height="80" fill="#0B0B0D" stroke={manualZoneId === 'core-arena' ? '#7867FF' : '#26262D'} strokeWidth="2.5" />
                    <circle cx="250" cy="180" r="20" stroke="#7867FF" strokeWidth="2" strokeDasharray="6 3" />
                    <circle cx="250" cy="180" r="6" fill="#7867FF" />
                    <text x="250" y="240" textAnchor="middle" fill="#F0F0EC" fontSize="12" fontFamily="Syne" fontWeight="bold">01.CORE ARENA</text>
                  </g>
                  <g onClick={() => handleZoneNav('void-bunker')} style={{ cursor: 'pointer' }}>
                    <rect x="340" y="230" width="60" height="50" fill="#050506" stroke={manualZoneId === 'void-bunker' ? '#72E4FF' : '#17171B'} strokeWidth="2" />
                    <circle cx="370" cy="255" r="5" fill="#72E4FF" />
                    <text x="370" y="295" textAnchor="middle" fill="#A4A4A6" fontSize="11" fontFamily="Space Mono">02.VOID</text>
                  </g>
                  <g onClick={() => handleZoneNav('signal-canopy')} style={{ cursor: 'pointer' }}>
                    <polygon points="360,100 420,60 380,140" fill="#050506" stroke={manualZoneId === 'signal-canopy' ? '#7867FF' : '#17171B'} strokeWidth="2" />
                    <circle cx="385" cy="100" r="5" fill="#7867FF" />
                    <text x="385" y="155" textAnchor="middle" fill="#A4A4A6" fontSize="11" fontFamily="Space Mono">03.SIGNAL</text>
                  </g>
                  <g onClick={() => handleZoneNav('art-district')} style={{ cursor: 'pointer' }}>
                    <circle cx="120" cy="100" r="20" fill="#050506" stroke={manualZoneId === 'art-district' ? '#72E4FF' : '#17171B'} strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="120" cy="100" r="4" fill="#72E4FF" />
                    <text x="120" y="135" textAnchor="middle" fill="#A4A4A6" fontSize="11" fontFamily="Space Mono">04.ARTS</text>
                  </g>
                  <g onClick={() => handleZoneNav('rest-commons')} style={{ cursor: 'pointer' }}>
                    <circle cx="430" cy="290" r="16" fill="#050506" stroke={manualZoneId === 'rest-commons' ? '#F0F0EC' : '#17171B'} strokeWidth="1.5" />
                    <circle cx="430" cy="290" r="4" fill="#F0F0EC" />
                    <text x="430" y="320" textAnchor="middle" fill="#68686C" fontSize="10" fontFamily="Space Mono">05.REST</text>
                  </g>
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta-xs)', color: 'var(--color-muted-silver)', borderTop: '1px solid var(--color-graphite)', paddingTop: '0.75rem' }}>
                <span style={{ color: 'var(--color-resonance-violet)', fontWeight: 700 }}>CLICK ZONES TO INSPECT</span>
                <span>DOORS OPEN DAILY 17:30 IST</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-ion-blue)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} />
                  <span>{currentZone.code}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-artist)', lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--color-lunar-white)', marginTop: '0.5rem' }}>
                  {currentZone.name}
                </h3>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--color-muted-silver)', lineHeight: 1.6 }}>
                {currentZone.description}
              </p>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-carbon)', border: '1px solid var(--color-graphite)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                  <span style={{ color: 'var(--color-dim-gray)' }}>LOCATION:</span>
                  <span style={{ color: 'var(--color-lunar-white)', fontWeight: 700 }}>{currentZone.coordinates}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                  <span style={{ color: 'var(--color-dim-gray)' }}>SOUND PRESSURE:</span>
                  <span style={{ color: 'var(--color-resonance-violet)', fontWeight: 700 }}>{currentZone.soundPressure}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                  <span style={{ color: 'var(--color-dim-gray)' }}>STRUCTURE:</span>
                  <span style={{ color: 'var(--color-ion-blue)' }}>{currentZone.specs}</span>
                </div>
              </div>
              <div className="zone-selector-grid">
                {VENUE_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleZoneNav(zone.id)}
                    className={`zone-tab-btn ${zone.id === manualZoneId ? 'active' : ''}`}
                  >
                    {zone.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // PRIMARY 420VH STICKY SPATIAL ROUTE EXPERIENCE
  // --------------------------------------------------------------------------
  return (
    <section
      id="venue"
      style={{
        backgroundColor: 'var(--color-void)',
        borderBottom: '1px solid var(--color-graphite)',
      }}
      aria-label="Venue Section"
    >
      {/* Intro Header Section in Normal Flow */}
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
              <div className="section-label" style={{ color: 'var(--color-ion-blue)' }}>
                SPATIAL MASTERPLAN
              </div>
              <h2 className="section-title">THE ECHOFORM GROUNDS.</h2>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-meta)',
                color: 'var(--color-muted-silver)',
                textAlign: 'right',
              }}
            >
              <div style={{ color: 'var(--color-lunar-white)', fontWeight: 700 }}>
                BENGALURU INDUSTRIAL ARTS COMPLEX
              </div>
              <div style={{ color: 'var(--color-resonance-violet)' }}>
                12.9716° N, 77.5946° E
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 420vh Sticky Scroll Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '420vh',
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
            {/* Spatial Blueprint Grid & Zone Inspector */}
            <div className="venue-master-grid">
              {/* Left: Interactive Vector Blueprint Plan */}
              <div className="venue-blueprint-box">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-meta-xs)',
                    color: 'var(--color-dim-gray)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span style={{ color: 'var(--color-ion-blue)' }}>
                    SITE BLUEPRINT // SPATIAL ROUTE ACTIVE
                  </span>
                  <span>
                    ROUTE // 0{activeZoneIdx} OF 05
                  </span>
                </div>

                {/* Blueprint Vector Map with Scroll-controlled Paths & Rings */}
                <div
                  style={{
                    width: '100%',
                    height: '80%',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    viewBox="0 0 500 360"
                    style={{ width: '100%', height: '100%' }}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Grid */}
                    <pattern id="venueGridLive" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#17171B" strokeWidth="0.8" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#venueGridLive)" />

                    {/* Scroll-Controlled Concentric Masterplan Rings */}
                    <circle
                      cx="250"
                      cy="180"
                      r="140"
                      stroke="#7867FF"
                      strokeWidth="1"
                      strokeDasharray="6 6"
                      opacity="0.25"
                      style={{
                        transform: `rotate(${progress * 25}deg)`,
                        transformOrigin: '250px 180px',
                      }}
                    />
                    <circle
                      cx="250"
                      cy="180"
                      r="90"
                      stroke="#72E4FF"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.35"
                      style={{
                        transform: `rotate(${progress * -35}deg)`,
                        transformOrigin: '250px 180px',
                      }}
                    />
                    <circle
                      cx="250"
                      cy="180"
                      r="50"
                      stroke="#F0F0EC"
                      strokeWidth="1.5"
                      opacity="0.5"
                      style={{
                        transform: `rotate(${progress * 20}deg)`,
                        transformOrigin: '250px 180px',
                      }}
                    />

                    {/* Static Background Walkways at low opacity */}
                    <path d="M 70 300 L 160 240 L 250 180" stroke="#1F1F24" strokeWidth="1" strokeDasharray="3 3" />
                    <path d="M 250 180 L 310 220 L 370 255" stroke="#1F1F24" strokeWidth="1" strokeDasharray="3 3" />
                    <path d="M 370 255 L 410 180 L 385 100" stroke="#1F1F24" strokeWidth="1" strokeDasharray="3 3" />
                    <path d="M 385 100 L 250 80 L 120 100" stroke="#1F1F24" strokeWidth="1" strokeDasharray="3 3" />
                    <path d="M 120 100 L 250 180 L 340 235 L 430 290" stroke="#1F1F24" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Route Segment 0: ENTRY -> CORE (Length ~216px) */}
                    <path
                      d="M 70 300 L 160 240 L 250 180"
                      stroke="#7867FF"
                      strokeWidth="2"
                      strokeDasharray="216"
                      strokeDashoffset={216 * (1 - route0Ratio)}
                      opacity={route0Ratio > 0 ? (activeZoneIdx === 0 || activeZoneIdx === 1 ? 1 : 0.65) : 0}
                      style={{ filter: route0Ratio > 0 && route0Ratio < 1 ? 'drop-shadow(0 0 6px #7867FF)' : 'none' }}
                    />

                    {/* Route Segment 1: CORE -> VOID (Length ~141px) */}
                    <path
                      d="M 250 180 L 310 220 L 370 255"
                      stroke="#72E4FF"
                      strokeWidth="2"
                      strokeDasharray="141"
                      strokeDashoffset={141 * (1 - route1Ratio)}
                      opacity={route1Ratio > 0 ? (activeZoneIdx === 1 || activeZoneIdx === 2 ? 1 : 0.65) : 0}
                      style={{ filter: route1Ratio > 0 && route1Ratio < 1 ? 'drop-shadow(0 0 6px #72E4FF)' : 'none' }}
                    />

                    {/* Route Segment 2: VOID -> SIGNAL (Length ~165px) */}
                    <path
                      d="M 370 255 L 410 180 L 385 100"
                      stroke="#7867FF"
                      strokeWidth="2"
                      strokeDasharray="165"
                      strokeDashoffset={165 * (1 - route2Ratio)}
                      opacity={route2Ratio > 0 ? (activeZoneIdx === 2 || activeZoneIdx === 3 ? 1 : 0.65) : 0}
                      style={{ filter: route2Ratio > 0 && route2Ratio < 1 ? 'drop-shadow(0 0 6px #7867FF)' : 'none' }}
                    />

                    {/* Route Segment 3: SIGNAL -> ARTS (Length ~268px) */}
                    <path
                      d="M 385 100 L 250 80 L 120 100"
                      stroke="#72E4FF"
                      strokeWidth="2"
                      strokeDasharray="268"
                      strokeDashoffset={268 * (1 - route3Ratio)}
                      opacity={route3Ratio > 0 ? (activeZoneIdx === 3 || activeZoneIdx === 4 ? 1 : 0.65) : 0}
                      style={{ filter: route3Ratio > 0 && route3Ratio < 1 ? 'drop-shadow(0 0 6px #72E4FF)' : 'none' }}
                    />

                    {/* Route Segment 4: ARTS -> REST (Length ~360px) */}
                    <path
                      d="M 120 100 L 250 180 L 340 235 L 430 290"
                      stroke="#F0F0EC"
                      strokeWidth="2"
                      strokeDasharray="360"
                      strokeDashoffset={360 * (1 - route4Ratio)}
                      opacity={route4Ratio > 0 ? (activeZoneIdx === 4 || activeZoneIdx === 5 ? 1 : 0.65) : 0}
                      style={{ filter: route4Ratio > 0 && route4Ratio < 1 ? 'drop-shadow(0 0 6px #F0F0EC)' : 'none' }}
                    />

                    {/* 00 ENTRY GATE (Node 0) */}
                    {(() => {
                      const state = getNodeState(0);
                      const isAct = state === 'active';
                      return (
                        <g onClick={() => handleZoneNav('entry')} style={{ cursor: 'pointer' }}>
                          <circle
                            cx="70"
                            cy="300"
                            r={isAct ? 19 : 16}
                            fill="#050506"
                            stroke={isAct ? '#72E4FF' : state === 'visited' ? '#7867FF' : '#26262D'}
                            strokeWidth={isAct ? 2.5 : 1.5}
                            opacity={isAct ? 1 : state === 'visited' ? 0.75 : 0.4}
                            style={{ transition: 'all 0.25s ease' }}
                          />
                          <circle cx="70" cy="300" r={isAct ? 6 : 5} fill={isAct ? '#72E4FF' : state === 'visited' ? '#7867FF' : '#52525A'} />
                          <text
                            x="70"
                            y="330"
                            textAnchor="middle"
                            fill={isAct ? '#72E4FF' : state === 'visited' ? '#A4A4A6' : '#52525A'}
                            fontSize="11"
                            fontFamily="Space Mono"
                            fontWeight={isAct ? 'bold' : 'normal'}
                          >
                            00.ENTRY
                          </text>
                        </g>
                      );
                    })()}

                    {/* 01 CORE ARENA (Node 1) */}
                    {(() => {
                      const state = getNodeState(1);
                      const isAct = state === 'active';
                      return (
                        <g onClick={() => handleZoneNav('core-arena')} style={{ cursor: 'pointer' }}>
                          <rect
                            x={isAct ? 205 : 210}
                            y={isAct ? 135 : 140}
                            width={isAct ? 90 : 80}
                            height={isAct ? 90 : 80}
                            fill="#0B0B0D"
                            stroke={isAct ? '#7867FF' : state === 'visited' ? '#72E4FF' : '#26262D'}
                            strokeWidth={isAct ? 3 : 2}
                            opacity={isAct ? 1 : state === 'visited' ? 0.8 : 0.4}
                            style={{ transition: 'all 0.25s ease' }}
                          />
                          <circle cx="250" cy="180" r={isAct ? 24 : 20} stroke="#7867FF" strokeWidth="2" strokeDasharray="6 3" opacity={isAct ? 1 : 0.5} />
                          <circle cx="250" cy="180" r={isAct ? 8 : 6} fill="#7867FF" />
                          <text
                            x="250"
                            y="245"
                            textAnchor="middle"
                            fill={isAct ? '#F0F0EC' : state === 'visited' ? '#A4A4A6' : '#52525A'}
                            fontSize="12"
                            fontFamily="Syne"
                            fontWeight="bold"
                          >
                            01.CORE ARENA
                          </text>
                        </g>
                      );
                    })()}

                    {/* 02 VOID BUNKER (Node 2) */}
                    {(() => {
                      const state = getNodeState(2);
                      const isAct = state === 'active';
                      return (
                        <g onClick={() => handleZoneNav('void-bunker')} style={{ cursor: 'pointer' }}>
                          <rect
                            x={isAct ? 335 : 340}
                            y={isAct ? 225 : 230}
                            width={isAct ? 70 : 60}
                            height={isAct ? 60 : 50}
                            fill="#050506"
                            stroke={isAct ? '#72E4FF' : state === 'visited' ? '#7867FF' : '#26262D'}
                            strokeWidth={isAct ? 2.5 : 1.5}
                            opacity={isAct ? 1 : state === 'visited' ? 0.75 : 0.4}
                            style={{ transition: 'all 0.25s ease' }}
                          />
                          <circle cx="370" cy="255" r={isAct ? 7 : 5} fill={isAct ? '#72E4FF' : state === 'visited' ? '#7867FF' : '#52525A'} />
                          <text
                            x="370"
                            y="298"
                            textAnchor="middle"
                            fill={isAct ? '#72E4FF' : state === 'visited' ? '#A4A4A6' : '#52525A'}
                            fontSize="11"
                            fontFamily="Space Mono"
                            fontWeight={isAct ? 'bold' : 'normal'}
                          >
                            02.VOID
                          </text>
                        </g>
                      );
                    })()}

                    {/* 03 SIGNAL CANOPY (Node 3) */}
                    {(() => {
                      const state = getNodeState(3);
                      const isAct = state === 'active';
                      return (
                        <g onClick={() => handleZoneNav('signal-canopy')} style={{ cursor: 'pointer' }}>
                          <polygon
                            points={isAct ? '355,95 425,55 380,145' : '360,100 420,60 380,140'}
                            fill="#050506"
                            stroke={isAct ? '#7867FF' : state === 'visited' ? '#72E4FF' : '#26262D'}
                            strokeWidth={isAct ? 2.5 : 1.5}
                            opacity={isAct ? 1 : state === 'visited' ? 0.75 : 0.4}
                            style={{ transition: 'all 0.25s ease' }}
                          />
                          <circle cx="385" cy="100" r={isAct ? 7 : 5} fill={isAct ? '#7867FF' : state === 'visited' ? '#72E4FF' : '#52525A'} />
                          <text
                            x="385"
                            y="158"
                            textAnchor="middle"
                            fill={isAct ? '#7867FF' : state === 'visited' ? '#A4A4A6' : '#52525A'}
                            fontSize="11"
                            fontFamily="Space Mono"
                            fontWeight={isAct ? 'bold' : 'normal'}
                          >
                            03.SIGNAL
                          </text>
                        </g>
                      );
                    })()}

                    {/* 04 ARTS DISTRICT (Node 4) */}
                    {(() => {
                      const state = getNodeState(4);
                      const isAct = state === 'active';
                      return (
                        <g onClick={() => handleZoneNav('art-district')} style={{ cursor: 'pointer' }}>
                          <circle
                            cx="120"
                            cy="100"
                            r={isAct ? 24 : 20}
                            fill="#050506"
                            stroke={isAct ? '#72E4FF' : state === 'visited' ? '#7867FF' : '#26262D'}
                            strokeWidth={isAct ? 2 : 1.5}
                            strokeDasharray="3 3"
                            opacity={isAct ? 1 : state === 'visited' ? 0.75 : 0.4}
                            style={{ transition: 'all 0.25s ease' }}
                          />
                          <circle cx="120" cy="100" r={isAct ? 6 : 4} fill={isAct ? '#72E4FF' : state === 'visited' ? '#7867FF' : '#52525A'} />
                          <text
                            x="120"
                            y="138"
                            textAnchor="middle"
                            fill={isAct ? '#72E4FF' : state === 'visited' ? '#A4A4A6' : '#52525A'}
                            fontSize="11"
                            fontFamily="Space Mono"
                            fontWeight={isAct ? 'bold' : 'normal'}
                          >
                            04.ARTS
                          </text>
                        </g>
                      );
                    })()}

                    {/* 05 REST COMMONS (Node 5) */}
                    {(() => {
                      const state = getNodeState(5);
                      const isAct = state === 'active';
                      return (
                        <g onClick={() => handleZoneNav('rest-commons')} style={{ cursor: 'pointer' }}>
                          <circle
                            cx="430"
                            cy="290"
                            r={isAct ? 19 : 16}
                            fill="#050506"
                            stroke={isAct ? '#F0F0EC' : state === 'visited' ? '#72E4FF' : '#26262D'}
                            strokeWidth={isAct ? 2.5 : 1.5}
                            opacity={isAct ? 1 : 0.4}
                            style={{ transition: 'all 0.25s ease' }}
                          />
                          <circle cx="430" cy="290" r={isAct ? 6 : 4} fill={isAct ? '#F0F0EC' : '#52525A'} />
                          <text
                            x="430"
                            y="322"
                            textAnchor="middle"
                            fill={isAct ? '#F0F0EC' : '#52525A'}
                            fontSize="10"
                            fontFamily="Space Mono"
                            fontWeight={isAct ? 'bold' : 'normal'}
                          >
                            05.REST
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Bottom Prompt */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-meta-xs)',
                    color: 'var(--color-muted-silver)',
                    borderTop: '1px solid var(--color-graphite)',
                    paddingTop: '0.75rem',
                  }}
                >
                  <span style={{ color: 'var(--color-resonance-violet)', fontWeight: 700 }}>
                    SCROLL TO NAVIGATE ROUTE
                  </span>
                  <span>DOORS OPEN DAILY 17:30 IST</span>
                </div>
              </div>

              {/* Right: Active Zone Details (Data Lock Transition) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-meta)',
                      color: 'var(--color-ion-blue)',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <MapPin size={14} />
                    <span>{currentZone.code}</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'var(--text-artist)',
                      lineHeight: 0.95,
                      textTransform: 'uppercase',
                      color: 'var(--color-lunar-white)',
                      marginTop: '0.5rem',
                    }}
                  >
                    {currentZone.name}
                  </h3>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    color: 'var(--color-muted-silver)',
                    lineHeight: 1.6,
                  }}
                >
                  {currentZone.description}
                </p>

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
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                    <span style={{ color: 'var(--color-dim-gray)' }}>LOCATION:</span>
                    <span style={{ color: 'var(--color-lunar-white)', fontWeight: 700 }}>
                      {currentZone.coordinates}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                    <span style={{ color: 'var(--color-dim-gray)' }}>SOUND PRESSURE:</span>
                    <span style={{ color: 'var(--color-resonance-violet)', fontWeight: 700 }}>
                      {currentZone.soundPressure}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted-silver)' }}>
                    <span style={{ color: 'var(--color-dim-gray)' }}>STRUCTURE:</span>
                    <span style={{ color: 'var(--color-ion-blue)' }}>
                      {currentZone.specs}
                    </span>
                  </div>
                </div>

                {/* Quick Zone Switcher Buttons (Synced to scroll progress) */}
                <div className="zone-selector-grid">
                  {VENUE_ZONES.map((zone, idx) => {
                    const isActive = idx === activeZoneIdx;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => handleZoneNav(zone.id)}
                        className={`zone-tab-btn ${isActive ? 'active' : ''}`}
                      >
                        {zone.code}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
