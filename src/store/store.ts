import { create, useStore as useZustandStore } from 'zustand';
import { temporal } from 'zundo';
import type { TemporalState } from 'zundo';
import type { AppState, Annotation } from './types';
import { MAX_HISTORY } from '../utils/constants';

function renumber(annotations: Annotation[]): Annotation[] {
  return annotations.map((a, i) => ({ ...a, number: i + 1 }));
}

export const useStore = create<AppState>()(
  temporal(
    (set) => ({
      image: null,
      imgW: 0,
      imgH: 0,
      projectName: 'My Website',
      tool: 'rect',
      priority: 'bug',
      zoom: 1,
      panX: 0,
      panY: 0,
      editingId: null,
      annotations: [],
      selectedId: null,

      setTool: (tool) => set({ tool }),
      setPriority: (priority) => set({ priority }),
      setProjectName: (name) => set({ projectName: name }),
      setImage: (src, w, h) => set({
        image: src, imgW: w, imgH: h,
        zoom: 1, panX: 0, panY: 0,
        annotations: [], selectedId: null, editingId: null,
      }),
      setZoom: (zoom) => set({ zoom }),
      setPan: (x, y) => set({ panX: x, panY: y }),
      setSelectedId: (id) => set({ selectedId: id }),
      setEditingId: (id) => set({ editingId: id }),

      addAnnotation: (annotation) => set((s) => ({
        annotations: [...s.annotations, annotation],
        editingId: annotation.id,
      })),

      updateAnnotationComment: (id, comment) => set((s) => ({
        annotations: s.annotations.map(a => a.id === id ? { ...a, comment } : a),
      })),

      deleteAnnotation: (id) => set((s) => ({
        annotations: renumber(s.annotations.filter(a => a.id !== id)),
        selectedId: s.selectedId === id ? null : s.selectedId,
        editingId: s.editingId === id ? null : s.editingId,
      })),

      clearAll: () => set({
        annotations: [],
        selectedId: null,
        editingId: null,
      }),

      reorderAnnotations: (fromIndex, toIndex) => set((s) => {
        const arr = [...s.annotations];
        const [moved] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, moved);
        return { annotations: renumber(arr) };
      }),

      moveAnnotation: (id, dx, dy) => set((s) => ({
        annotations: s.annotations.map(a => {
          if (a.id !== id) return a;
          if (a.type === 'point') return { ...a, x: a.x + dx, y: a.y + dy };
          if (a.type === 'freehand') return {
            ...a,
            startX: a.startX + dx, startY: a.startY + dy,
            endX: a.endX + dx, endY: a.endY + dy,
            points: a.points.map(p => ({ x: p.x + dx, y: p.y + dy })),
          };
          return {
            ...a,
            startX: (a as Annotation & { startX: number }).startX + dx,
            startY: (a as Annotation & { startY: number }).startY + dy,
            endX: (a as Annotation & { endX: number }).endX + dx,
            endY: (a as Annotation & { endY: number }).endY + dy,
          } as Annotation;
        }),
      })),

      resizeAnnotation: (id, handle, dx, dy) => set((s) => ({
        annotations: s.annotations.map(a => {
          if (a.id !== id) return a;
          if (a.type === 'rect') {
            const updated = { ...a };
            if (handle.includes('n')) updated.startY += dy;
            if (handle.includes('s')) updated.endY += dy;
            if (handle.includes('w')) updated.startX += dx;
            if (handle.includes('e')) updated.endX += dx;
            return updated;
          }
          if (a.type === 'arrow') {
            if (handle === 'start') return { ...a, startX: a.startX + dx, startY: a.startY + dy };
            if (handle === 'end') return { ...a, endX: a.endX + dx, endY: a.endY + dy };
          }
          if (a.type === 'point') {
            return { ...a, x: a.x + dx, y: a.y + dy };
          }
          if (a.type === 'freehand' && a.points.length > 0) {
            const bbox = {
              minX: Math.min(...a.points.map(p => p.x)),
              minY: Math.min(...a.points.map(p => p.y)),
              maxX: Math.max(...a.points.map(p => p.x)),
              maxY: Math.max(...a.points.map(p => p.y)),
            };
            const w = bbox.maxX - bbox.minX || 1;
            const h = bbox.maxY - bbox.minY || 1;
            let scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0;
            if (handle.includes('e')) { scaleX = (w + dx) / w; }
            if (handle.includes('w')) { scaleX = (w - dx) / w; offsetX = dx; }
            if (handle.includes('s')) { scaleY = (h + dy) / h; }
            if (handle.includes('n')) { scaleY = (h - dy) / h; offsetY = dy; }
            const newPoints = a.points.map(p => ({
              x: bbox.minX + offsetX + (p.x - bbox.minX) * scaleX,
              y: bbox.minY + offsetY + (p.y - bbox.minY) * scaleY,
            }));
            const xs = newPoints.map(p => p.x);
            const ys = newPoints.map(p => p.y);
            return {
              ...a,
              points: newPoints,
              startX: Math.min(...xs), startY: Math.min(...ys),
              endX: Math.max(...xs), endY: Math.max(...ys),
            };
          }
          return a;
        }),
      })),
    }),
    {
      partialize: (state) => ({
        annotations: state.annotations,
        selectedId: state.selectedId,
      }),
      limit: MAX_HISTORY,
    },
  )
);

type PartialState = { annotations: Annotation[]; selectedId: number | null };

export const useTemporalStore = <T>(
  selector: (state: TemporalState<PartialState>) => T,
): T => {
  return useZustandStore(useStore.temporal, selector);
};
