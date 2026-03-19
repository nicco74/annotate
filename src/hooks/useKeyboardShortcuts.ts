import { useEffect } from 'react';
import { useStore } from '../store/store';
import { useTemporalStore } from '../store/store';
import { ZOOM_MIN, ZOOM_MAX } from '../utils/constants';
import type { ToolType, PriorityType } from '../store/types';

export function useKeyboardShortcuts(
  canvasWrapRef: React.RefObject<HTMLDivElement | null>,
) {
  const setTool = useStore(s => s.setTool);
  const setPriority = useStore(s => s.setPriority);
  const deleteAnnotation = useStore(s => s.deleteAnnotation);
  const selectedId = useStore(s => s.selectedId);
  const setSelectedId = useStore(s => s.setSelectedId);
  const editingId = useStore(s => s.editingId);
  const setEditingId = useStore(s => s.setEditingId);
  const zoom = useStore(s => s.zoom);
  const setZoom = useStore(s => s.setZoom);
  const setPan = useStore(s => s.setPan);
  const image = useStore(s => s.image);
  const imgW = useStore(s => s.imgW);
  const imgH = useStore(s => s.imgH);

  const undo = useTemporalStore(s => s.undo);
  const redo = useTemporalStore(s => s.redo);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

      if (e.key === 'Escape') {
        if (editingId) { setEditingId(null); return; }
        if (selectedId) { setSelectedId(null); return; }
        return;
      }

      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Z') {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) { deleteAnnotation(selectedId); }
        return;
      }

      const toolMap: Record<string, ToolType> = { '1': 'rect', '2': 'arrow', '3': 'freehand', '4': 'point' };
      if (toolMap[e.key]) { setTool(toolMap[e.key]); return; }

      const priMap: Record<string, PriorityType> = { q: 'bug', w: 'improve', e: 'question', r: 'note' };
      if (priMap[e.key.toLowerCase()]) { setPriority(priMap[e.key.toLowerCase()]); return; }

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoom(Math.min(zoom * 1.15, ZOOM_MAX));
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom(Math.max(zoom * 0.87, ZOOM_MIN));
        return;
      }
      if (e.key === '0' && image && canvasWrapRef.current) {
        e.preventDefault();
        const r = canvasWrapRef.current.getBoundingClientRect();
        const sx = (r.width - 40) / imgW;
        const sy = (r.height - 40) / imgH;
        const fitZoom = Math.min(sx, sy, 1);
        setZoom(fitZoom);
        setPan((r.width - imgW * fitZoom) / 2, (r.height - imgH * fitZoom) / 2);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    setTool, setPriority, deleteAnnotation, selectedId,
    setSelectedId, editingId, setEditingId, zoom, setZoom,
    setPan, image, imgW, imgH, undo, redo, canvasWrapRef,
  ]);
}
