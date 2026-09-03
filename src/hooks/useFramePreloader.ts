import { useState, useEffect, useRef, useCallback } from 'react';

interface FramePreloaderResult {
  loadedCount: number;
  totalCount: number;
  isReady: boolean; // First keyframes ready to display without flash
  isFullyLoaded: boolean;
  getFrame: (index: number) => HTMLImageElement | null;
}

export function useFramePreloader(frameUrls: string[]): FramePreloaderResult {
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState<boolean>(false);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (!frameUrls || frameUrls.length === 0) return;

    const total = frameUrls.length;
    imagesRef.current = new Array(total).fill(null);
    let count = 0;
    let isCancelled = false;

    // Helper to load a single image
    const loadImage = (index: number): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = frameUrls[index];

        img.onload = () => {
          if (isCancelled) return resolve(null);
          imagesRef.current[index] = img;
          count++;
          setLoadedCount(count);

          // Once first frame is loaded, we can mark as ready for instant display
          if (index === 0) {
            setIsReady(true);
          }

          if (count >= total) {
            setIsFullyLoaded(true);
          }
          resolve(img);
        };

        img.onerror = () => {
          console.warn(`[ECHOFORM Frame Sequence] Failed to load frame: ${frameUrls[index]}`);
          // Don't halt progress on single frame failure
          count++;
          setLoadedCount(count);
          resolve(null);
        };
      });
    };

    // Immediate priority: Load frame 0 and first 5 frames
    const initialBatch = Math.min(5, total);
    for (let i = 0; i < initialBatch; i++) {
      loadImage(i);
    }

    // Secondary: Load remaining frames in manageable concurrency
    const loadRemaining = async () => {
      // Concurrency batch size
      const concurrency = 6;
      for (let i = initialBatch; i < total; i += concurrency) {
        if (isCancelled) break;
        const batch = [];
        for (let j = i; j < Math.min(i + concurrency, total); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }
    };

    loadRemaining();

    return () => {
      isCancelled = true;
    };
  }, [frameUrls]);

  // Safe accessor: gets requested frame or nearest loaded fallback
  const getFrame = useCallback(
    (index: number): HTMLImageElement | null => {
      const images = imagesRef.current;
      if (!images || images.length === 0) return null;

      const clampedIndex = Math.max(0, Math.min(index, images.length - 1));

      // 1. Direct hit
      if (images[clampedIndex]) return images[clampedIndex];

      // 2. Search nearest backward
      for (let i = clampedIndex - 1; i >= 0; i--) {
        if (images[i]) return images[i];
      }

      // 3. Search nearest forward
      for (let i = clampedIndex + 1; i < images.length; i++) {
        if (images[i]) return images[i];
      }

      return null;
    },
    []
  );

  return {
    loadedCount,
    totalCount: frameUrls.length,
    isReady,
    isFullyLoaded,
    getFrame,
  };
}
