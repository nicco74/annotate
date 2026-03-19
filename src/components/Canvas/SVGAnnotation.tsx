import type { Annotation, DrawingState } from '../../store/types';
import { PRI } from '../../utils/constants';

interface SVGAnnotationProps {
  annotation: Annotation | (DrawingState & { id: string; number: number });
  isGhost: boolean;
  isSelected: boolean;
  zoom: number;
  onClick?: (id: number) => void;
}

function Badge({ cx, cy, n, color, r, fs, zoom }: {
  cx: number; cy: number; n: number; color: string; r: number; fs: number; zoom: number;
}) {
  return (
    <>
      <rect
        x={cx - r} y={cy - r} width={r * 2} height={r * 2}
        rx={4 / zoom} fill={color}
      />
      <text
        x={cx} y={cy + fs * 0.36}
        textAnchor="middle" fill="white"
        fontSize={fs} fontWeight={700}
        fontFamily="Outfit,system-ui"
      >
        {n}
      </text>
    </>
  );
}

export function SVGAnnotation({ annotation: a, isGhost, isSelected, zoom, onClick }: SVGAnnotationProps) {
  const p = PRI[a.priority];
  const sw = (isSelected ? 3 : 2) / zoom;
  const op = isGhost ? 0.45 : (isSelected ? 1 : 0.8);
  const r = 14 / zoom;
  const fs = 11 / zoom;

  const handleClick = (e: React.MouseEvent) => {
    if (!isGhost && onClick && 'id' in a && typeof a.id === 'number') {
      e.stopPropagation();
      e.preventDefault();
      onClick(a.id);
    }
  };

  const type = a.type;

  if (type === 'rect') {
    const ra = a as Annotation & { startX: number; startY: number; endX: number; endY: number };
    const x = Math.min(ra.startX, ra.endX);
    const y = Math.min(ra.startY, ra.endY);
    const w = Math.abs(ra.endX - ra.startX);
    const h = Math.abs(ra.endY - ra.startY);

    return (
      <g style={{ cursor: 'pointer' }} onMouseDown={handleClick}>
        <rect
          x={x} y={y} width={w} height={h}
          fill={p.color + '12'} stroke={p.color}
          strokeWidth={sw} opacity={op}
          rx={4 / zoom}
          strokeDasharray={isGhost ? '8 4' : undefined}
        />
        {!isGhost && (
          <Badge cx={x - 2 / zoom} cy={y - 2 / zoom} n={a.number} color={p.color} r={r} fs={fs} zoom={zoom} />
        )}
      </g>
    );
  }

  if (type === 'arrow') {
    const aa = a as Annotation & { startX: number; startY: number; endX: number; endY: number };
    return (
      <g style={{ cursor: 'pointer' }} onMouseDown={handleClick}>
        <line
          x1={aa.startX} y1={aa.startY} x2={aa.endX} y2={aa.endY}
          stroke={p.color} strokeWidth={sw}
          markerEnd={`url(#ah-${a.id})`}
          opacity={op}
        />
        {!isGhost && (
          <Badge cx={aa.startX} cy={aa.startY} n={a.number} color={p.color} r={r} fs={fs} zoom={zoom} />
        )}
      </g>
    );
  }

  if (type === 'freehand') {
    const fa = a as Annotation & { points?: { x: number; y: number }[] };
    const pts = fa.points;
    if (!pts || pts.length < 2) return null;

    const d = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');

    return (
      <g style={{ cursor: 'pointer' }} onMouseDown={handleClick}>
        <path
          d={d} fill="none" stroke={p.color}
          strokeWidth={sw} strokeLinecap="round"
          strokeLinejoin="round" opacity={op}
        />
        {!isGhost && pts[0] && (
          <Badge cx={pts[0].x} cy={pts[0].y} n={a.number} color={p.color} r={r} fs={fs} zoom={zoom} />
        )}
      </g>
    );
  }

  if (type === 'point') {
    const pa = a as Annotation & { x: number; y: number };
    const pr = 18 / zoom;

    return (
      <g style={{ cursor: 'pointer' }} onMouseDown={handleClick}>
        <circle
          cx={pa.x} cy={pa.y} r={pr}
          fill={p.color + '20'} stroke={p.color}
          strokeWidth={sw} opacity={op}
        />
        <circle cx={pa.x} cy={pa.y} r={3 / zoom} fill={p.color} />
        {!isGhost && (
          <Badge cx={pa.x} cy={pa.y - 26 / zoom} n={a.number} color={p.color} r={r} fs={fs} zoom={zoom} />
        )}
      </g>
    );
  }

  return null;
}
