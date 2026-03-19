import { useCallback, useRef } from 'react';
import { useStore } from '../store/store';
import type { Annotation, DrawingState, Point } from '../store/types';
import { relPos } from '../utils/geometry';
import { ZOOM_MIN, ZOOM_MAX } from '../utils/constants';

export function useCanvasInteraction(
  canvasInnerRef: React.RefObject<HTMLDivElement | null>,
) {
  const drawingRef = useRef<DrawingState | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);

  const tool = useStore(s => s.tool);
  const priority = useStore(s => s.priority);
  const image = useStore(s => s.image);
  const zoom = useStore(s => s.zoom);
  const panX = useStore(s => s.panX);
  const panY = useStore(s => s.panY);
  const annotations = useStore(s => s.annotations);
  const setZoom = useStore(s => s.setZoom);
  const setPan = useStore(s => s.setPan);
  const addAnnotation = useStore(s => s.addAnnotation);
  const setSelectedId = useStore(s => s.setSelectedId);

  const getCurrentDraw = useCallback(() => drawingRef.current, []);
  const getIsDrawing = useCallback(() => isDrawingRef.current, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
      e.preventDefault();
      return;
    }

    if (e.button !== 0 || !image) return;
    const p = relPos(e.nativeEvent, canvasInnerRef.current, zoom);

    if (tool === 'point') {
      const id = Date.now();
      const ann: Annotation = {
        id, type: 'point', x: p.x, y: p.y,
        priority, comment: '', number: annotations.length + 1,
      };
      addAnnotation(ann);
      return;
    }

    isDrawingRef.current = true;
    drawingRef.current = {
      type: tool,
      startX: p.x, startY: p.y,
      endX: p.x, endY: p.y,
      priority,
      points: tool === 'freehand' ? [p] : undefined,
    };
  }, [tool, priority, image, zoom, panX, panY, annotations.length, addAnnotation, setSelectedId, canvasInnerRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanningRef.current) {
      setPan(e.clientX - panStartRef.current.x, e.clientY - panStartRef.current.y);
      return;
    }

    if (!isDrawingRef.current || !drawingRef.current) return;
    const p = relPos(e.nativeEvent, canvasInnerRef.current, zoom);

    if (drawingRef.current.type === 'freehand' && drawingRef.current.points) {
      drawingRef.current = {
        ...drawingRef.current,
        points: [...drawingRef.current.points, p],
      };
    } else {
      drawingRef.current = { ...drawingRef.current, endX: p.x, endY: p.y };
    }
  }, [zoom, canvasInnerRef, setPan]);

  const handleMouseUp = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      return;
    }

    if (!isDrawingRef.current || !drawingRef.current) {
      isDrawingRef.current = false;
      return;
    }

    const cd = drawingRef.current;

    if (cd.type === 'freehand' && (!cd.points || cd.points.length < 3)) {
      isDrawingRef.current = false;
      drawingRef.current = null;
      return;
    }

    if ((cd.type === 'rect' || cd.type === 'arrow') &&
        Math.abs(cd.endX - cd.startX) < 5 && Math.abs(cd.endY - cd.startY) < 5) {
      isDrawingRef.current = false;
      drawingRef.current = null;
      setSelectedId(null);
      return;
    }

    const id = Date.now();
    const base = {
      id, priority: cd.priority, comment: '',
      number: annotations.length + 1,
    };

    let ann: Annotation;
    if (cd.type === 'freehand') {
      ann = { ...base, type: 'freehand', startX: cd.startX, startY: cd.startY, endX: cd.endX, endY: cd.endY, points: cd.points || [] };
    } else if (cd.type === 'arrow') {
      ann = { ...base, type: 'arrow', startX: cd.startX, startY: cd.startY, endX: cd.endX, endY: cd.endY };
    } else {
      ann = { ...base, type: 'rect', startX: cd.startX, startY: cd.startY, endX: cd.endX, endY: cd.endY };
    }

    addAnnotation(ann);
    isDrawingRef.current = false;
    drawingRef.current = null;
  }, [annotations.length, addAnnotation, setSelectedId]);

  const handleMouseLeave = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!image) return;
    e.preventDefault();

    const rect = canvasInnerRef.current?.parentElement?.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * factor, ZOOM_MIN), ZOOM_MAX);

    const newPanX = mouseX - (mouseX - panX) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - panY) * (newZoom / zoom);

    setZoom(newZoom);
    setPan(newPanX, newPanY);
  }, [image, zoom, panX, panY, setZoom, setPan, canvasInnerRef]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleWheel,
    getCurrentDraw,
    getIsDrawing,
    isPanningRef,
    drawingRef,
    isDrawingRef,
  };
}
