import type { Annotation } from '../../store/types';

interface ResizeHandlesProps {
  annotation: Annotation;
  zoom: number;
  onResizeStart: (handle: string, e: React.MouseEvent) => void;
}

export function ResizeHandles({ annotation: a, zoom, onResizeStart }: ResizeHandlesProps) {
  const handleSize = 8 / zoom;
  const half = handleSize / 2;

  const renderHandle = (cx: number, cy: number, handle: string, cursor: string) => (
    <rect
      key={handle}
      x={cx - half}
      y={cy - half}
      width={handleSize}
      height={handleSize}
      fill="white"
      stroke="var(--accent, #7c6aef)"
      strokeWidth={1.5 / zoom}
      rx={2 / zoom}
      style={{ cursor }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onResizeStart(handle, e);
      }}
    />
  );

  if (a.type === 'rect') {
    const x1 = Math.min(a.startX, a.endX);
    const y1 = Math.min(a.startY, a.endY);
    const x2 = Math.max(a.startX, a.endX);
    const y2 = Math.max(a.startY, a.endY);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    return (
      <g>
        {renderHandle(x1, y1, 'nw', 'nwse-resize')}
        {renderHandle(mx, y1, 'n', 'ns-resize')}
        {renderHandle(x2, y1, 'ne', 'nesw-resize')}
        {renderHandle(x2, my, 'e', 'ew-resize')}
        {renderHandle(x2, y2, 'se', 'nwse-resize')}
        {renderHandle(mx, y2, 's', 'ns-resize')}
        {renderHandle(x1, y2, 'sw', 'nesw-resize')}
        {renderHandle(x1, my, 'w', 'ew-resize')}
      </g>
    );
  }

  if (a.type === 'arrow') {
    return (
      <g>
        {renderHandle(a.startX, a.startY, 'start', 'move')}
        {renderHandle(a.endX, a.endY, 'end', 'move')}
      </g>
    );
  }

  if (a.type === 'point') {
    return null;
  }

  if (a.type === 'freehand' && a.points.length > 0) {
    const xs = a.points.map(p => p.x);
    const ys = a.points.map(p => p.y);
    const x1 = Math.min(...xs);
    const y1 = Math.min(...ys);
    const x2 = Math.max(...xs);
    const y2 = Math.max(...ys);

    return (
      <g>
        {renderHandle(x1, y1, 'nw', 'nwse-resize')}
        {renderHandle(x2, y1, 'ne', 'nesw-resize')}
        {renderHandle(x2, y2, 'se', 'nwse-resize')}
        {renderHandle(x1, y2, 'sw', 'nesw-resize')}
      </g>
    );
  }

  return null;
}
