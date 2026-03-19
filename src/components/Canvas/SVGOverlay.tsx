import { forwardRef } from 'react';
import type { Annotation, DrawingState } from '../../store/types';
import { PRI } from '../../utils/constants';
import { SVGAnnotation } from './SVGAnnotation';

interface SVGOverlayProps {
  imgW: number;
  imgH: number;
  annotations: Annotation[];
  selectedId: number | null;
  zoom: number;
  currentDraw: DrawingState | null;
  onSelectAnnotation: (id: number) => void;
}

function ArrowMarker({ id, color }: { id: string | number; color: string }) {
  return (
    <marker
      id={`ah-${id}`}
      markerWidth={10} markerHeight={7}
      refX={10} refY={3.5}
      orient="auto"
    >
      <polygon points="0 0,10 3.5,0 7" fill={color} />
    </marker>
  );
}

export const SVGOverlay = forwardRef<SVGSVGElement, SVGOverlayProps>(
  function SVGOverlay({ imgW, imgH, annotations, selectedId, zoom, currentDraw, onSelectAnnotation }, ref) {
    const arrowAnnotations = annotations.filter(a => a.type === 'arrow');

    return (
      <svg
        ref={ref}
        width={imgW}
        height={imgH}
        viewBox={`0 0 ${imgW} ${imgH}`}
      >
        <defs>
          {arrowAnnotations.map(a => (
            <ArrowMarker key={a.id} id={a.id} color={PRI[a.priority].color} />
          ))}
          {currentDraw?.type === 'arrow' && (
            <ArrowMarker id="preview" color={PRI[currentDraw.priority].color} />
          )}
        </defs>
        <g className="interactive">
          {annotations.map(a => (
            <SVGAnnotation
              key={a.id}
              annotation={a}
              isGhost={false}
              isSelected={selectedId === a.id}
              zoom={zoom}
              onClick={onSelectAnnotation}
            />
          ))}
          {currentDraw && (
            <SVGAnnotation
              annotation={{
                ...currentDraw,
                id: 'preview',
                number: annotations.length + 1,
              }}
              isGhost={true}
              isSelected={false}
              zoom={zoom}
            />
          )}
        </g>
      </svg>
    );
  }
);
