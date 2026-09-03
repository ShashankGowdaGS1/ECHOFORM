import { useState, useEffect, useCallback, type RefObject } from 'react';

interface ScrollProgressOptions {
  clamp?: boolean;
}

export function useScrollProgress(
  containerRef: RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = { clamp: true }
) {
  const [progress, setProgress] = useState<number>(0);
  const [isInView, setIsInView] = useState<boolean>(false);

  const calculateProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollableDistance = rect.height - windowHeight;

    if (scrollableDistance <= 0) {
      setProgress(0);
      setIsInView(rect.top <= 0 && rect.bottom >= windowHeight);
      return;
    }

    // Normalized progress: 0 when container top hits viewport top, 1 when container bottom hits viewport bottom
    const rawProgress = -rect.top / scrollableDistance;
    const clampedProgress = options.clamp !== false
      ? Math.min(Math.max(rawProgress, 0), 1)
      : rawProgress;

    setProgress(clampedProgress);
    setIsInView(rect.bottom > 0 && rect.top < windowHeight);
  }, [containerRef, options.clamp]);

  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calculateProgress();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial calculation
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [calculateProgress]);

  return { progress, isInView };
}
