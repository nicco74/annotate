import { useCallback } from 'react';
import { useStore } from '../store/store';
import { ZOOM_MIN, ZOOM_MAX } from '../utils/constants';

export function useZoom(canvasWrapRef: React.RefObject<HTMLDivElement | null>) {
  const zoom = useStore(s => s.zoom);
  const setZoom = useStore(s => s.setZoom);
  const setPan = useStore(s => s.setPan);
  const imgW = useStore(s => s.imgW);
  const imgH = useStore(s => s.imgH);
  const image = useStore(s => s.image);

  const adjustZoom = useCallback((dir: number) => {
    if (!image) return;
    const newZoom = Math.min(Math.max(zoom * (dir > 0 ? 1.15 : 0.87), ZOOM_MIN), ZOOM_MAX);
    setZoom(newZoom);
  }, [image, zoom, setZoom]);

  const zoomToFit = useCallback(() => {
    if (!image || !canvasWrapRef.current) return;
    const r = canvasWrapRef.current.getBoundingClientRect();
    const sx = (r.width - 40) / imgW;
    const sy = (r.height - 40) / imgH;
    const fitZoom = Math.min(sx, sy, 1);
    setZoom(fitZoom);
    setPan((r.width - imgW * fitZoom) / 2, (r.height - imgH * fitZoom) / 2);
  }, [image, imgW, imgH, setZoom, setPan, canvasWrapRef]);

  const zoomTo100 = useCallback(() => {
    if (!image || !canvasWrapRef.current) return;
    const r = canvasWrapRef.current.getBoundingClientRect();
    setZoom(1);
    setPan((r.width - imgW) / 2, (r.height - imgH) / 2);
  }, [image, imgW, imgH, setZoom, setPan, canvasWrapRef]);

  return { adjustZoom, zoomToFit, zoomTo100 };
}
