import { useRef, useCallback, useState, useEffect, forwardRef } from 'react';
import { useStore } from '../../store/store';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import { useImageLoader } from '../../hooks/useImageLoader';
import { DropZone } from './DropZone';
import { SVGOverlay } from './SVGOverlay';
import { ResizeHandles } from './ResizeHandles';
import type { DrawingState } from '../../store/types';
import './Canvas.css';

interface CanvasAreaProps {
  canvasWrapRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function CanvasArea({ canvasWrapRef, svgRef }: CanvasAreaProps) {
  const canvasInnerRef = useRef<HTMLDivElement>(null);
  const [currentDraw, setCurrentDraw] = useState<DrawingState | null>(null);
  const animRef = useRef<number>(0);

  const image = useStore(s => s.image);
  const imgW = useStore(s => s.imgW);
  const imgH = useStore(s => s.imgH);
  const zoom = useStore(s => s.zoom);
  const panX = useStore(s => s.panX);
  const panY = useStore(s => s.panY);
  const tool = useStore(s => s.tool);
  const annotations = useStore(s => s.annotations);
  const selectedId = useStore(s => s.selectedId);
  const setSelectedId = useStore(s => s.setSelectedId);
  const moveAnnotation = useStore(s => s.moveAnnotation);
  const resizeAnnotation = useStore(s => s.resizeAnnotation);

  const { handleFile } = useImageLoader(canvasWrapRef);

  const interaction = useCanvasInteraction(canvasInnerRef);

  // Poll currentDraw for preview rendering
  useEffect(() => {
    const tick = () => {
      setCurrentDraw(interaction.drawingRef.current);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [interaction.drawingRef]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) handleFile(f);
  }, [handleFile]);

  // Resize/move state
  const dragStateRef = useRef<{
    mode: 'move' | 'resize';
    id: number;
    handle: string;
    startX: number;
    startY: number;
  } | null>(null);

  const handleResizeStart = useCallback((handle: string, e: React.MouseEvent) => {
    if (!selectedId) return;
    dragStateRef.current = {
      mode: 'resize',
      id: selectedId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
    };

    const onMove = (ev: MouseEvent) => {
      if (!dragStateRef.current) return;
      const dx = (ev.clientX - dragStateRef.current.startX) / zoom;
      const dy = (ev.clientY - dragStateRef.current.startY) / zoom;
      resizeAnnotation(dragStateRef.current.id, dragStateRef.current.handle, dx, dy);
      dragStateRef.current.startX = ev.clientX;
      dragStateRef.current.startY = ev.clientY;
    };

    const onUp = () => {
      dragStateRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [selectedId, zoom, resizeAnnotation]);

  const handleAnnotationClick = useCallback((id: number) => {
    setSelectedId(id);
  }, [setSelectedId]);

  const selectedAnnotation = annotations.find(a => a.id === selectedId);

  const isPanning = interaction.isPanningRef.current;
  const canvasClass = `canvas-wrap tool-${tool}${isPanning ? ' panning' : ''}`;

  if (!image) {
    return (
      <div className="canvas-area" onDragOver={handleDragOver} onDrop={handleDrop}>
        <DropZone onFileSelect={handleFile} />
      </div>
    );
  }

  return (
    <div className="canvas-area" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div
        ref={canvasWrapRef}
        className={canvasClass}
        onMouseDown={interaction.handleMouseDown}
        onMouseMove={interaction.handleMouseMove}
        onMouseUp={interaction.handleMouseUp}
        onMouseLeave={interaction.handleMouseLeave}
        onWheel={interaction.handleWheel}
      >
        <div
          className="canvas-transform"
          style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}
        >
          <div className="canvas-inner" ref={canvasInnerRef}>
            <img
              src={image}
              width={imgW}
              height={imgH}
              draggable={false}
              alt="Screenshot"
            />
            <SVGOverlay
              ref={svgRef}
              imgW={imgW}
              imgH={imgH}
              annotations={annotations}
              selectedId={selectedId}
              zoom={zoom}
              currentDraw={currentDraw}
              onSelectAnnotation={handleAnnotationClick}
            />
            {selectedAnnotation && (
              <svg
                width={imgW}
                height={imgH}
                viewBox={`0 0 ${imgW} ${imgH}`}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'all', zIndex: 10 }}
              >
                <ResizeHandles
                  annotation={selectedAnnotation}
                  zoom={zoom}
                  onResizeStart={handleResizeStart}
                />
              </svg>
            )}
          </div>
        </div>
        <div className="canvas-hint">
          Scroll to zoom &middot; Alt + drag to pan &middot; Click or drag to annotate
        </div>
      </div>
    </div>
  );
}
