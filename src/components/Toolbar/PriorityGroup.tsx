import { useStore } from '../../store/store';
import type { PriorityType } from '../../store/types';
import { PRI } from '../../utils/constants';

const PRIORITIES: { type: PriorityType; label: string; shortcut: string }[] = [
  { type: 'bug', label: 'Bug', shortcut: 'Q' },
  { type: 'improve', label: 'Improve', shortcut: 'W' },
  { type: 'question', label: 'Ask', shortcut: 'E' },
  { type: 'note', label: 'Note', shortcut: 'R' },
];

export function PriorityGroup() {
  const priority = useStore(s => s.priority);
  const setPriority = useStore(s => s.setPriority);

  return (
    <div className="tb-group">
      {PRIORITIES.map(p => {
        const cfg = PRI[p.type];
        const isActive = priority === p.type;
        return (
          <button
            key={p.type}
            className={`p-btn${isActive ? ' active' : ''}`}
            onClick={() => setPriority(p.type)}
            title={`${p.label} (${p.shortcut})`}
            aria-label={`${p.label} priority`}
          >
            <span
              className="dot"
              style={{
                background: cfg.color,
                boxShadow: isActive ? `0 0 8px ${cfg.color}` : 'none',
              }}
            />
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
