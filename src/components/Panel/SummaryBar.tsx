import type { Annotation } from '../../store/types';
import { PRI } from '../../utils/constants';
import type { PriorityType } from '../../store/types';

interface SummaryBarProps {
  annotations: Annotation[];
}

export function SummaryBar({ annotations }: SummaryBarProps) {
  if (annotations.length === 0) return null;

  const counts: Partial<Record<PriorityType, number>> = {};
  annotations.forEach(a => {
    counts[a.priority] = (counts[a.priority] || 0) + 1;
  });

  return (
    <div className="ann-summary">
      {Object.entries(counts).map(([key, val]) => {
        const pri = PRI[key as PriorityType];
        return (
          <div key={key} className="s-pill">
            <span className="s-dot" style={{ background: pri.color }} />
            {val} {pri.label}{val! > 1 ? 's' : ''}
          </div>
        );
      })}
    </div>
  );
}
