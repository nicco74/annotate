import { Square, ArrowUpRight, Pen, CircleDot } from 'lucide-react';
import { useStore } from '../../store/store';
import type { ToolType } from '../../store/types';

const TOOLS: { type: ToolType; icon: typeof Square; label: string; shortcut: string }[] = [
  { type: 'rect', icon: Square, label: 'Rect', shortcut: '1' },
  { type: 'arrow', icon: ArrowUpRight, label: 'Arrow', shortcut: '2' },
  { type: 'freehand', icon: Pen, label: 'Draw', shortcut: '3' },
  { type: 'point', icon: CircleDot, label: 'Point', shortcut: '4' },
];

export function ToolGroup() {
  const tool = useStore(s => s.tool);
  const setTool = useStore(s => s.setTool);

  return (
    <div className="tb-group">
      {TOOLS.map(t => (
        <button
          key={t.type}
          className={`t-btn${tool === t.type ? ' active' : ''}`}
          onClick={() => setTool(t.type)}
          title={`${t.label} (${t.shortcut})`}
          aria-label={`${t.label} tool`}
        >
          <span className="ico">
            <t.icon size={15} strokeWidth={2} />
          </span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
