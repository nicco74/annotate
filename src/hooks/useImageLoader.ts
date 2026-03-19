import { useCallback, useEffect } from 'react';
import { useStore } from '../store/store';

export function useImageLoader(canvasWrapRef: React.RefObject<HTMLDivElement | null>) {
  const setImage = useStore(s => s.setImage);
  const setZoom = useStore(s => s.setZoom);
  const setPan = useStore(s => s.setPan);

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.onload = () => {
      setImage(src, img.width, img.height);

      if (canvasWrapRef.current) {
        const r = canvasWrapRef.current.getBoundingClientRect();
        const sx = (r.width - 40) / img.width;
        const sy = (r.height - 40) / img.height;
        const zoom = Math.min(sx, sy, 1);
        const panX = (r.width - img.width * zoom) / 2;
        const panY = (r.height - img.height * zoom) / 2;
        setZoom(zoom);
        setPan(panX, panY);
      }
    };
    img.src = src;
  }, [setImage, setZoom, setPan, canvasWrapRef]);

  const handleFile = useCallback((f: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => {
      if (e.target?.result) loadImage(e.target.result as string);
    };
    r.readAsDataURL(f);
  }, [loadImage]);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const f = item.getAsFile();
          if (f) handleFile(f);
          return;
        }
      }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [handleFile]);

  return { loadImage, handleFile };
}
