import React, { useRef, useEffect, useState } from 'react';

interface NoteItem {
  id: string;
  type: 'eighth' | 'beamed' | 'quarter';
  top: string;
  left?: string;
  right?: string;
  size: number;
  color: string;
  baseOpacity: number;
  depth: 'foreground' | 'mid-depth' | 'background';
  motionType: 'drift' | 'orbit' | 'frequency';
  personality: 'repel' | 'tangential' | 'attract-drift' | 'rotational';
  hasLine?: 'left' | 'right';
  lineWidth?: number;
  floatDelay: string;
  floatDuration: string;
}

const ART_DIRECTED_NOTES: NoteItem[] = [
  // 1. Upper Left outer edge
  {
    id: 'n1',
    type: 'eighth',
    top: '15%',
    left: '5%',
    size: 22,
    color: '#7867FF',
    baseOpacity: 0.32,
    depth: 'foreground',
    motionType: 'frequency',
    personality: 'repel',
    hasLine: 'left',
    lineWidth: 38,
    floatDelay: '0s',
    floatDuration: '6.2s',
  },
  // 2. Upper Right cluster A
  {
    id: 'n2',
    type: 'beamed',
    top: '12%',
    right: '14%',
    size: 16,
    color: '#A4A4A6',
    baseOpacity: 0.22,
    depth: 'mid-depth',
    motionType: 'drift',
    personality: 'tangential',
    floatDelay: '1.2s',
    floatDuration: '7.5s',
  },
  // 3. Upper Right cluster B (offset)
  {
    id: 'n3',
    type: 'quarter',
    top: '20%',
    right: '7%',
    size: 24,
    color: '#72E4FF',
    baseOpacity: 0.30,
    depth: 'foreground',
    motionType: 'frequency',
    personality: 'repel',
    hasLine: 'right',
    lineWidth: 44,
    floatDelay: '2.4s',
    floatDuration: '6.8s',
  },
  // 4. Mid Left peripheral cluster A (background atmosphere)
  {
    id: 'n4',
    type: 'quarter',
    top: '38%',
    left: '8%',
    size: 14,
    color: '#F0F0EC',
    baseOpacity: 0.14,
    depth: 'background',
    motionType: 'orbit',
    personality: 'attract-drift',
    floatDelay: '3.1s',
    floatDuration: '8.4s',
  },
  // 5. Mid Left peripheral cluster B
  {
    id: 'n5',
    type: 'eighth',
    top: '45%',
    left: '14%',
    size: 18,
    color: '#7867FF',
    baseOpacity: 0.24,
    depth: 'mid-depth',
    motionType: 'drift',
    personality: 'rotational',
    floatDelay: '0.8s',
    floatDuration: '6.0s',
  },
  // 6. Upper Center-Right, above Gate boundary
  {
    id: 'n6',
    type: 'eighth',
    top: '28%',
    right: '22%',
    size: 12,
    color: '#A4A4A6',
    baseOpacity: 0.12,
    depth: 'background',
    motionType: 'orbit',
    personality: 'tangential',
    floatDelay: '4.2s',
    floatDuration: '9.2s',
  },
  // 7. Lower-Mid Left, near metadata
  {
    id: 'n7',
    type: 'beamed',
    top: '62%',
    left: '6%',
    size: 20,
    color: '#72E4FF',
    baseOpacity: 0.26,
    depth: 'mid-depth',
    motionType: 'frequency',
    personality: 'repel',
    hasLine: 'left',
    lineWidth: 30,
    floatDelay: '2.0s',
    floatDuration: '6.5s',
  },
  // 8. Lower Left corner area
  {
    id: 'n8',
    type: 'quarter',
    top: '80%',
    left: '11%',
    size: 15,
    color: '#F0F0EC',
    baseOpacity: 0.16,
    depth: 'background',
    motionType: 'drift',
    personality: 'attract-drift',
    floatDelay: '1.6s',
    floatDuration: '7.8s',
  },
  // 9. Mid Right outer boundary
  {
    id: 'n9',
    type: 'eighth',
    top: '52%',
    right: '5%',
    size: 19,
    color: '#7867FF',
    baseOpacity: 0.25,
    depth: 'mid-depth',
    motionType: 'drift',
    personality: 'repel',
    floatDelay: '2.8s',
    floatDuration: '6.3s',
  },
  // 10. Lower Right peripheral cluster A
  {
    id: 'n10',
    type: 'beamed',
    top: '70%',
    right: '15%',
    size: 13,
    color: '#A4A4A6',
    baseOpacity: 0.15,
    depth: 'background',
    motionType: 'orbit',
    personality: 'rotational',
    floatDelay: '3.7s',
    floatDuration: '8.0s',
  },
  // 11. Lower Right peripheral cluster B
  {
    id: 'n11',
    type: 'quarter',
    top: '78%',
    right: '7%',
    size: 22,
    color: '#F0F0EC',
    baseOpacity: 0.30,
    depth: 'foreground',
    motionType: 'frequency',
    personality: 'tangential',
    hasLine: 'right',
    lineWidth: 36,
    floatDelay: '0.4s',
    floatDuration: '7.2s',
  },
];

export const HeroNoteField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const noteElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Cursor elements
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorHaloRef = useRef<HTMLDivElement | null>(null);

  // Mouse & physics tracking
  const mouseStateRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    isInside: false,
    isHoveringInteractive: false,
    lastMoveTime: 0,
  });

  const smoothCursorRef = useRef({
    dotX: -9999,
    dotY: -9999,
    haloX: -9999,
    haloY: -9999,
    haloScale: 1,
    haloExpand: 0,
    dotOpacity: 0.6,
    nearestNoteDistance: Infinity,
    nearestNoteColor: '#7867FF',
  });

  const currentOffsetsRef = useRef<
    Map<string, { x: number; y: number; rot: number; opacityBoost: number }>
  >(new Map());

  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Initialize offset map
  useEffect(() => {
    ART_DIRECTED_NOTES.forEach((n) => {
      currentOffsetsRef.current.set(n.id, { x: 0, y: 0, rot: 0, opacityBoost: 0 });
    });
  }, []);

  // Track scroll position to fade out notes and cursor before Resonance Gate cinematic
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.75)));
      setScrollOpacity(1 - progress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track cursor position, velocity, and interactive hover states within Hero
  useEffect(() => {
    if (isTouchDevice) return;

    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const now = performance.now();
      const st = mouseStateRef.current;

      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        if (!st.isInside) {
          st.prevX = e.clientX;
          st.prevY = e.clientY;
          smoothCursorRef.current.dotX = e.clientX;
          smoothCursorRef.current.dotY = e.clientY;
          smoothCursorRef.current.haloX = e.clientX;
          smoothCursorRef.current.haloY = e.clientY;
        }

        const dt = Math.max(16, now - st.lastMoveTime);
        const vx = (e.clientX - st.prevX) / (dt / 16);
        const vy = (e.clientY - st.prevY) / (dt / 16);
        const speed = Math.sqrt(vx * vx + vy * vy);

        st.prevX = e.clientX;
        st.prevY = e.clientY;
        st.x = e.clientX;
        st.y = e.clientY;
        st.vx = vx;
        st.vy = vy;
        st.speed = speed;
        st.isInside = true;
        st.lastMoveTime = now;

        // Check if hovering interactive element (button or link)
        const target = e.target as HTMLElement | null;
        st.isHoveringInteractive = !!target?.closest('a, button, [role="button"]');
      } else {
        st.isInside = false;
      }
    };

    const onMouseLeave = () => {
      mouseStateRef.current.isInside = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isTouchDevice]);

  // Main RAF animation loop: Cursor Lerp + Proximity Field + Dynamic Illumination
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    let animId: number;

    const animate = (time: number) => {
      const st = mouseStateRef.current;
      const cur = smoothCursorRef.current;
      const isVisible = st.isInside && scrollOpacity > 0.05;

      let nearestDist = Infinity;
      let nearestColor = '#7867FF';

      // ----------------------------------------------------------------------
      // 1. UPDATE NOTE PROXIMITY DISPLACEMENTS & ILLUMINATION
      // ----------------------------------------------------------------------
      ART_DIRECTED_NOTES.forEach((note) => {
        const el = noteElementsRef.current.get(note.id);
        const current = currentOffsetsRef.current.get(note.id) || {
          x: 0,
          y: 0,
          rot: 0,
          opacityBoost: 0,
        };
        if (!el) return;

        let targetX = 0;
        let targetY = 0;
        let targetRot = 0;
        let targetBoost = 0;

        if (isVisible) {
          const rect = el.getBoundingClientRect();
          const noteCenterX = rect.left + rect.width / 2;
          const noteCenterY = rect.top + rect.height / 2;

          const dx = noteCenterX - st.x;
          const dy = noteCenterY - st.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 220;

          if (distance < influenceRadius && distance > 0) {
            const influence = 1 - distance / influenceRadius;
            const depthFactor =
              note.depth === 'foreground' ? 1.2 : note.depth === 'mid-depth' ? 0.9 : 0.6;
            const maxTravel = 26 * depthFactor;

            // Track nearest note for cursor halo illumination
            if (distance < nearestDist) {
              nearestDist = distance;
              nearestColor = note.color;
            }

            // Personality-based displacement vectors
            if (note.personality === 'repel') {
              targetX = (dx / distance) * influence * influence * maxTravel;
              targetY = (dy / distance) * influence * influence * maxTravel;
              targetRot = (dx / influenceRadius) * 14;
            } else if (note.personality === 'tangential') {
              // Perpendicular vector
              const tx = -dy / distance;
              const ty = dx / distance;
              targetX = tx * influence * maxTravel;
              targetY = ty * influence * maxTravel;
              targetRot = influence * 12;
            } else if (note.personality === 'attract-drift') {
              // Gentle attraction followed by slight deflection
              targetX = -(dx / distance) * influence * (maxTravel * 0.5);
              targetY = -(dy / distance) * influence * (maxTravel * 0.5);
              targetRot = -(dx / influenceRadius) * 8;
            } else if (note.personality === 'rotational') {
              targetX = (dx / distance) * influence * (maxTravel * 0.4);
              targetY = (dy / distance) * influence * (maxTravel * 0.4);
              targetRot = (dx / influenceRadius) * 26; // strong angular tilt
            }

            targetBoost = influence * 0.38; // boost opacity near cursor
          }
        }

        // Smooth Lerp for notes
        const lerpFactor = 0.11;
        const nextX = current.x + (targetX - current.x) * lerpFactor;
        const nextY = current.y + (targetY - current.y) * lerpFactor;
        const nextRot = current.rot + (targetRot - current.rot) * lerpFactor;
        const nextBoost = current.opacityBoost + (targetBoost - current.opacityBoost) * lerpFactor;

        currentOffsetsRef.current.set(note.id, {
          x: nextX,
          y: nextY,
          rot: nextRot,
          opacityBoost: nextBoost,
        });

        // Apply direct transform and dynamic opacity to interactive inner layer
        const interactiveLayer = el.querySelector('.note-interactive-layer') as HTMLElement;
        if (interactiveLayer) {
          interactiveLayer.style.transform = `translate3d(${nextX.toFixed(2)}px, ${nextY.toFixed(
            2
          )}px, 0) rotate(${nextRot.toFixed(2)}deg)`;
          el.style.opacity = `${(note.baseOpacity + nextBoost).toFixed(3)}`;
        }
      });

      // ----------------------------------------------------------------------
      // 2. UPDATE ACOUSTIC CURSOR DYNAMICS
      // ----------------------------------------------------------------------
      if (cursorDotRef.current && cursorHaloRef.current) {
        if (!isVisible) {
          cursorDotRef.current.style.opacity = '0';
          cursorHaloRef.current.style.opacity = '0';
        } else {
          // Dot tracks closely (tight lerp)
          cur.dotX += (st.x - cur.dotX) * 0.45;
          cur.dotY += (st.y - cur.dotY) * 0.45;

          // Halo tracks with subtle aesthetic lag
          cur.haloX += (st.x - cur.haloX) * 0.22;
          cur.haloY += (st.y - cur.haloY) * 0.22;

          // Stationary dimming check (idle > 800ms dims core dot)
          const isMoving = time - st.lastMoveTime < 800;
          const targetDotOpacity = isMoving ? 0.95 : 0.55;
          cur.dotOpacity += (targetDotOpacity - cur.dotOpacity) * 0.08;

          // Velocity scaling for halo (fast movement stretches/expands slightly)
          const targetHaloScale = Math.min(1.25, 1 + st.speed * 0.015);
          cur.haloScale += (targetHaloScale - cur.haloScale) * 0.12;

          // Interactive CTA hover expansion
          const targetExpand = st.isHoveringInteractive ? 18 : 0;
          cur.haloExpand += (targetExpand - cur.haloExpand) * 0.15;

          // Proximity to notes energizes halo
          const isNearNote = nearestDist < 200;
          const haloBaseSize = 30 + cur.haloExpand;
          const haloBorderColor = isNearNote
            ? nearestColor === '#72E4FF'
              ? 'rgba(114, 228, 255, 0.45)'
              : 'rgba(120, 103, 255, 0.45)'
            : 'rgba(240, 240, 236, 0.18)';

          cursorDotRef.current.style.opacity = `${cur.dotOpacity.toFixed(2)}`;
          cursorDotRef.current.style.transform = `translate3d(${cur.dotX.toFixed(
            1
          )}px, ${cur.dotY.toFixed(1)}px, 0)`;

          cursorHaloRef.current.style.opacity = `${(0.12 + (isNearNote ? 0.22 : 0)).toFixed(2)}`;
          cursorHaloRef.current.style.width = `${haloBaseSize.toFixed(1)}px`;
          cursorHaloRef.current.style.height = `${haloBaseSize.toFixed(1)}px`;
          cursorHaloRef.current.style.borderColor = haloBorderColor;
          cursorHaloRef.current.style.transform = `translate3d(${cur.haloX.toFixed(
            1
          )}px, ${cur.haloY.toFixed(1)}px, 0) translate(-50%, -50%) scale(${cur.haloScale.toFixed(
            2
          )})`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion, isTouchDevice, scrollOpacity]);

  if (scrollOpacity <= 0.01) return null;

  return (
    <>
      {/* Custom Desktop Acoustic Cursor */}
      {!isTouchDevice && !prefersReducedMotion && (
        <>
          {/* Core Dot */}
          <div
            ref={cursorDotRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#F0F0EC',
              boxShadow: '0 0 6px rgba(114, 228, 255, 0.8)',
              pointerEvents: 'none',
              zIndex: 9999,
              marginTop: '-3px',
              marginLeft: '-3px',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          />

          {/* Acoustic Halo */}
          <div
            ref={cursorHaloRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid rgba(240, 240, 236, 0.18)',
              background:
                'radial-gradient(circle, rgba(120, 103, 255, 0.15) 0%, rgba(114, 228, 255, 0.05) 50%, transparent 80%)',
              pointerEvents: 'none',
              zIndex: 9998,
              opacity: 0,
              willChange: 'transform, width, height, opacity',
            }}
          />
        </>
      )}

      {/* Decorative Musical Note / Sound Fragment Field */}
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 3,
          opacity: scrollOpacity,
          transition: 'opacity 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {ART_DIRECTED_NOTES.map((note) => {
          const animationName =
            note.motionType === 'drift'
              ? 'heroNoteDrift'
              : note.motionType === 'orbit'
              ? 'heroNoteOrbit'
              : 'heroNoteFreq';

          return (
            <div
              key={note.id}
              ref={(el) => {
                if (el) noteElementsRef.current.set(note.id, el);
                else noteElementsRef.current.delete(note.id);
              }}
              style={{
                position: 'absolute',
                top: note.top,
                left: note.left,
                right: note.right,
                color: note.color,
                opacity: note.baseOpacity,
                transition: 'opacity 0.25s ease',
              }}
            >
              {/* Outer Idle Float Container (Pure CSS Keyframe Animation) */}
              <div
                style={{
                  animation: prefersReducedMotion
                    ? 'none'
                    : `${animationName} ${note.floatDuration} ease-in-out infinite alternate ${note.floatDelay}`,
                }}
              >
                {/* Inner Cursor Reactive Layer (RAF Displacement) */}
                <div
                  className="note-interactive-layer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    willChange: 'transform',
                  }}
                >
                  {/* Left Sound Line Fragment */}
                  {note.hasLine === 'left' && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: `${note.lineWidth}px`,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent 0%, ${note.color} 100%)`,
                        opacity: 0.65,
                      }}
                    />
                  )}

                  {/* Mathematical Vector Note Glyph */}
                  <svg
                    width={note.size}
                    height={note.size}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                      filter: `drop-shadow(0 0 6px ${note.color})`,
                      display: 'block',
                    }}
                  >
                    {note.type === 'eighth' && (
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    )}
                    {note.type === 'beamed' && (
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6v6.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V3h-6z" />
                    )}
                    {note.type === 'quarter' && (
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V3h2z" />
                    )}
                  </svg>

                  {/* Right Sound Line Fragment */}
                  {note.hasLine === 'right' && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: `${note.lineWidth}px`,
                        height: '1px',
                        background: `linear-gradient(90deg, ${note.color} 0%, transparent 100%)`,
                        opacity: 0.65,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
