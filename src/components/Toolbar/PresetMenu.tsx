import { useState, useRef, useEffect } from 'react';
import { Zap, Bug, Layout, Sparkles, Smartphone, Eraser } from 'lucide-react';
import { useStore } from '../../store/store';
import { PRESETS } from '../../utils/constants';
import type { ToolType } from '../../store/types';

const PRESET_ICONS: Record<string, typeof Bug> = {
  bugs: Bug,
  layout: Layout,
  ux: Sparkles,
  responsive: Smartphone,
  cleanup: Eraser,
};

export function PresetMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const setTool = useStore(s => s.setTool);
  const setPriority = useStore(s => s.setPriority);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const apply = (key: string) => {
    const p = PRESETS[key];
    if (!p) return;
    setTool(p.tool as ToolType);
    setPriority(p.priority);
    setOpen(false);
  };

  return (
    <div className="preset-wrap" ref={wrapRef} style={{ position: 'relative' }}>
      <button className="preset-trigger" onClick={() => setOpen(!open)}>
        <Zap size={13} /> Presets
      </button>
      {open && (
        <div className="preset-menu open">
          {Object.entries(PRESETS).map(([key, val]) => {
            const Icon = PRESET_ICONS[key] || Zap;
            return (
              <button key={key} className="preset-opt" onClick={() => apply(key)}>
                <Icon size={14} /> {val.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
