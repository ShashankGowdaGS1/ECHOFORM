import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SCHEDULE_DATA } from '../data/schedule';

export const ScheduleSection: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'SEP 18' | 'SEP 19'>('SEP 18');
  const [selectedStage, setSelectedStage] = useState<'ALL' | 'CORE' | 'VOID' | 'SIGNAL'>('ALL');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const filteredSchedule = SCHEDULE_DATA.filter((item) => {
    const matchDay = item.day === selectedDay;
    const matchStage = selectedStage === 'ALL' || item.stage === selectedStage;
    return matchDay && matchStage;
  });

  // --------------------------------------------------------------------------
  // ACTIVE ROW DETECTION VIA VIEWPORT GEOMETRY SCANNER (~48% Viewport Height)
  // --------------------------------------------------------------------------
  const updateActiveRow = useCallback(() => {
    if (prefersReducedMotion) return;

    const scannerY = window.innerHeight * 0.48;
    let closestId: string | null = null;
    let minDistance = Infinity;

    rowRefs.current.forEach((el, id) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const distance = Math.abs(rowCenter - scannerY);

      // Check if row is within the active scanner zone (±90px)
      if (rect.top <= scannerY + 40 && rect.bottom >= scannerY - 40) {
        if (distance < minDistance) {
          minDistance = distance;
          closestId = id;
        }
      }
    });

    if (closestId) {
      setActiveRowId(closestId);
    } else if (filteredSchedule.length > 0) {
      // If at top of schedule container, highlight first row; if past, highlight last
      const firstEl = rowRefs.current.get(filteredSchedule[0]?.id);
      if (firstEl && firstEl.getBoundingClientRect().top > scannerY) {
        setActiveRowId(filteredSchedule[0]?.id);
      } else {
        const lastEl = rowRefs.current.get(filteredSchedule[filteredSchedule.length - 1]?.id);
        if (lastEl && lastEl.getBoundingClientRect().bottom < scannerY) {
          setActiveRowId(filteredSchedule[filteredSchedule.length - 1]?.id);
        }
      }
    }
  }, [filteredSchedule, prefersReducedMotion]);

  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateActiveRow();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    updateActiveRow();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateActiveRow]);

  // Recalculate active row when filters change
  useEffect(() => {
    updateActiveRow();
  }, [selectedDay, selectedStage, updateActiveRow]);

  // Active item frequency numerical lock
  const activeItem = filteredSchedule.find((item) => item.id === activeRowId) || filteredSchedule[0];

  return (
    <section
      id="schedule"
      ref={containerRef}
      aria-label="Schedule Section"
      className="section-spacing"
      style={{
        backgroundColor: 'var(--color-void)',
        borderBottom: '1px solid var(--color-graphite)',
        position: 'relative',
      }}
    >
      <div className="container-12">
        {/* Section Header in Normal Flow */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div className="section-label" style={{ color: 'var(--color-ion-blue)' }}>
              TIMELINE & SET TIMES
            </div>
            <h2 className="section-title">
              FOLLOW THE FREQUENCY.
            </h2>
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
            LIVE SPATIAL AUDIO PROGRAM
          </div>
        </div>

        {/* Sticky Control & Filter Bar (Sticky below 72px Navbar) */}
        <div
          style={{
            position: 'sticky',
            top: '72px',
            zIndex: 30,
            backgroundColor: 'rgba(5, 5, 6, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--color-graphite)',
            borderBottom: '1px solid var(--color-graphite)',
            padding: '1rem 0',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Day 1 & Day 2 Selector */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['SEP 18', 'SEP 19'] as const).map((day, idx) => {
              const isActive = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '0.6rem 1.25rem',
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
                  DAY 0{idx + 1} // {day}
                </button>
              );
            })}
          </div>

          {/* Stage Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-meta-xs)',
                color: 'var(--color-dim-gray)',
                textTransform: 'uppercase',
                marginRight: '0.25rem',
              }}
            >
              FILTER:
            </span>
            {(['ALL', 'CORE', 'VOID', 'SIGNAL'] as const).map((stg) => {
              const isSelected = selectedStage === stg;
              return (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setSelectedStage(stg)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-meta-xs)',
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: isSelected ? 'var(--color-resonance-violet)' : 'var(--color-carbon)',
                    color: isSelected ? 'var(--color-lunar-white)' : 'var(--color-muted-silver)',
                    borderColor: isSelected ? 'var(--color-resonance-violet)' : 'var(--color-graphite)',
                    fontWeight: isSelected ? 700 : 400,
                  }}
                >
                  {stg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule List Container with Sticky 1px Frequency Scanner Line */}
        <div style={{ position: 'relative' }}>
          {/* Subtle Horizontal Frequency Scanner Line */}
          {!prefersReducedMotion && (
            <div
              style={{
                position: 'sticky',
                top: 'calc(48vh + 36px)',
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, var(--color-resonance-violet) 25%, var(--color-ion-blue) 75%, transparent 100%)',
                boxShadow: '0 0 12px rgba(114, 228, 255, 0.4)',
                pointerEvents: 'none',
                zIndex: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  color: 'var(--color-ion-blue)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  backgroundColor: 'rgba(5, 5, 6, 0.9)',
                  padding: '2px 8px',
                  border: '1px solid rgba(114, 228, 255, 0.3)',
                  transform: 'translateY(-50%)',
                  marginRight: '1rem',
                }}
              >
                SIGNAL LOCK // {activeItem?.frequency || '432 HZ'}
              </div>
            </div>
          )}

          {/* Schedule Rows Table in Natural Document Flow */}
          <div className="schedule-table-wrap">
            {filteredSchedule.map((item) => {
              const isHovered = hoveredId === item.id;
              const isActive = activeRowId === item.id;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (el) rowRefs.current.set(item.id, el);
                    else rowRefs.current.delete(item.id);
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="schedule-row-item"
                  style={{
                    position: 'relative',
                    backgroundColor: isHovered
                      ? 'var(--color-carbon)'
                      : isActive
                      ? 'rgba(120, 103, 255, 0.04)'
                      : 'transparent',
                    opacity: prefersReducedMotion ? 1 : isActive ? 1 : 0.65,
                    transform: isActive && !prefersReducedMotion ? 'scale(1.012)' : 'none',
                    borderColor: isActive ? 'rgba(114, 228, 255, 0.35)' : 'var(--color-graphite)',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Left Active Scanner Bar */}
                  {isActive && !prefersReducedMotion && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: 'var(--color-ion-blue)',
                        boxShadow: '0 0 10px rgba(114, 228, 255, 0.8)',
                      }}
                    />
                  )}

                  {/* Time with Slot-style Numeric Clarity */}
                  <div
                    className="schedule-time"
                    style={{
                      color: isActive ? 'var(--color-ion-blue)' : 'var(--color-muted-silver)',
                      textShadow: isActive ? '0 0 12px rgba(114, 228, 255, 0.5)' : 'none',
                      transition: 'color 0.2s ease, text-shadow 0.2s ease',
                    }}
                  >
                    {item.time}
                  </div>

                  {/* Artist Name & Genre */}
                  <div className="schedule-artist-col">
                    <span
                      className="schedule-artist-name"
                      style={{
                        color: isActive ? 'var(--color-lunar-white)' : 'var(--color-muted-silver)',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.artist}
                    </span>
                    <span className="schedule-genre">
                      {item.genre}
                    </span>
                  </div>

                  {/* Frequency & Stage Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-meta)',
                        color: isActive ? 'var(--color-ion-blue)' : 'var(--color-muted-silver)',
                        fontWeight: isActive ? 700 : 400,
                        letterSpacing: '0.08em',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.frequency}
                    </span>
                    <span
                      className="schedule-stage-tag"
                      style={{
                        color:
                          item.stage === 'CORE'
                            ? 'var(--color-resonance-violet)'
                            : item.stage === 'VOID'
                            ? 'var(--color-ion-blue)'
                            : 'var(--color-electric-lavender)',
                        borderColor: isActive
                          ? 'var(--color-lunar-white)'
                          : item.stage === 'CORE'
                          ? 'rgba(120, 103, 255, 0.4)'
                          : item.stage === 'VOID'
                          ? 'rgba(114, 228, 255, 0.4)'
                          : 'rgba(168, 156, 255, 0.4)',
                        backgroundColor: isActive ? 'rgba(5, 5, 6, 0.9)' : 'transparent',
                        boxShadow: isActive ? '0 0 10px rgba(120, 103, 255, 0.3)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.stage}
                    </span>
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
