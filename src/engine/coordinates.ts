import type { Annotation } from '../store/types';

export interface RectCoords {
  x1: number; y1: number; x2: number; y2: number;
  w: number; h: number; cx: number; cy: number;
}

export interface PointCoords {
  cx: number; cy: number;
}

export interface ArrowCoords {
  x1: number; y1: number; x2: number; y2: number;
  cx: number; cy: number;
}

export type AnnotationCoords = RectCoords | PointCoords | ArrowCoords;

export function getCoords(a: Annotation, imgW: number, imgH: number): AnnotationCoords | null {
  if (!imgW || !imgH) return null;

  if (a.type === 'point') {
    return { cx: Math.round(a.x), cy: Math.round(a.y) };
  }

  if (a.type === 'rect') {
    const x1 = Math.round(a.startX);
    const y1 = Math.round(a.startY);
    const x2 = Math.round(a.endX || a.startX);
    const y2 = Math.round(a.endY || a.startY);
    return {
      x1: Math.min(x1, x2), y1: Math.min(y1, y2),
      x2: Math.max(x1, x2), y2: Math.max(y1, y2),
      w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      cx: Math.round((x1 + x2) / 2), cy: Math.round((y1 + y2) / 2),
    };
  }

  if (a.type === 'arrow') {
    return {
      x1: Math.round(a.startX), y1: Math.round(a.startY),
      x2: Math.round(a.endX || a.startX), y2: Math.round(a.endY || a.startY),
      cx: Math.round(a.startX), cy: Math.round(a.startY),
    };
  }

  if (a.type === 'freehand' && a.points?.length) {
    const xs = a.points.map(p => p.x);
    const ys = a.points.map(p => p.y);
    const minX = Math.round(Math.min(...xs));
    const minY = Math.round(Math.min(...ys));
    const maxX = Math.round(Math.max(...xs));
    const maxY = Math.round(Math.max(...ys));
    return {
      x1: minX, y1: minY, x2: maxX, y2: maxY,
      w: maxX - minX, h: maxY - minY,
      cx: Math.round((minX + maxX) / 2), cy: Math.round((minY + maxY) / 2),
    };
  }

  return null;
}

export function getSemanticZone(a: Annotation, imgW: number, imgH: number): string {
  const c = getCoords(a, imgW, imgH);
  if (!c || !imgW || !imgH) return 'unknown area';
  const px = c.cx / imgW;
  const py = c.cy / imgH;

  if (py < 0.12) return 'header/navigation bar';
  if (py > 0.88) return 'footer';
  if (px < 0.2 && py >= 0.12 && py <= 0.88) return 'left sidebar';
  if (px > 0.8 && py >= 0.12 && py <= 0.88) return 'right sidebar';
  if (py >= 0.12 && py < 0.35 && px >= 0.2 && px <= 0.8) return 'hero/top content area';
  if (py >= 0.35 && py <= 0.65 && px >= 0.2 && px <= 0.8) return 'main content area';
  if (py > 0.65 && py <= 0.88 && px >= 0.2 && px <= 0.8) return 'lower content area';
  return 'content area';
}

export function formatCoordString(a: Annotation, imgW: number, imgH: number): string {
  const c = getCoords(a, imgW, imgH);
  if (!c) return '';

  if (a.type === 'point') {
    const pc = c as PointCoords;
    return `point at (${pc.cx}, ${pc.cy})`;
  }
  if (a.type === 'rect') {
    const rc = c as RectCoords;
    return `region (${rc.x1}, ${rc.y1}) -> (${rc.x2}, ${rc.y2}), ${rc.w}x${rc.h}px`;
  }
  if (a.type === 'arrow') {
    const ac = c as ArrowCoords;
    return `arrow from (${ac.x1}, ${ac.y1}) to (${ac.x2}, ${ac.y2})`;
  }
  if (a.type === 'freehand') {
    const fc = c as RectCoords;
    return `freehand area (${fc.x1}, ${fc.y1}) -> (${fc.x2}, ${fc.y2}), ${fc.w}x${fc.h}px`;
  }
  return '';
}
