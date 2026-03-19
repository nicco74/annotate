import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import { useStore } from '../../store/store';
import { useZoom } from '../../hooks/useZoom';

export function ZoomControls({ canvasWrapRef }: { canvasWrapRef: React.RefObject<HTMLDivElement | null> }) {
  const zoom = useStore(s => s.zoom);
  const { adjustZoom, zoomToFit, zoomTo100 } = useZoom(canvasWrapRef);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button
        className="undo-redo-btn"
        onClick={zoomToFit}
        title="Zoom to fit (0)"
        aria-label="Zoom to fit"
      >
        <Minimize size={14} />
      </button>
      <div className="zoom-ctrl">
        <button className="zoom-arrow" onClick={() => adjustZoom(-1)} aria-label="Zoom out">
          <ZoomOut size={12} />
        </button>
        <span className="zoom-pill">{Math.round(zoom * 100)}%</span>
        <button className="zoom-arrow" onClick={() => adjustZoom(1)} aria-label="Zoom in">
          <ZoomIn size={12} />
        </button>
      </div>
      <button
        className="undo-redo-btn"
        onClick={zoomTo100}
        title="Zoom to 100%"
        aria-label="Zoom to 100%"
      >
        <Maximize size={14} />
      </button>
    </div>
  );
}
