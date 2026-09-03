import { useEffect, useRef, useCallback, type RefObject } from 'react';

interface CanvasRendererOptions {
  dprCap?: number;
}

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  currentImage: HTMLImageElement | null,
  options: CanvasRendererOptions = { dprCap: 2 }
) {
  const lastRenderedImageRef = useRef<HTMLImageElement | null>(null);
  const lastWidthRef = useRef<number>(0);
  const lastHeightRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, options.dprCap || 2);
    const rect = canvas.getBoundingClientRect();
    const displayWidth = Math.round(rect.width);
    const displayHeight = Math.round(rect.height);

    if (displayWidth === 0 || displayHeight === 0) return;

    // Resize canvas buffer if container dimensions or DPR changed
    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      lastWidthRef.current = targetWidth;
      lastHeightRef.current = targetHeight;
    }

    // Cover math: preserve aspect ratio and center image
    const imgWidth = currentImage.naturalWidth || currentImage.width || 1920;
    const imgHeight = currentImage.naturalHeight || currentImage.height || 1080;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = targetWidth / targetHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasRatio > imgRatio) {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2;
    } else {
      drawWidth = targetHeight * imgRatio;
      drawHeight = targetHeight;
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = 0;
    }

    // Crisp high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear background to void black before drawing
    ctx.fillStyle = '#050506';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Draw frame
    ctx.drawImage(currentImage, offsetX, offsetY, drawWidth, drawHeight);
    lastRenderedImageRef.current = currentImage;
  }, [canvasRef, currentImage, options.dprCap]);

  useEffect(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      drawFrame();
      rafIdRef.current = null;
    });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrame]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        drawFrame();
        rafIdRef.current = null;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  return { drawFrame };
}
