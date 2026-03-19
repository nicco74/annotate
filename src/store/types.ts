export type ToolType = 'rect' | 'arrow' | 'freehand' | 'point';
export type PriorityType = 'bug' | 'improve' | 'question' | 'note';

export interface Point {
  x: number;
  y: number;
}

interface AnnotationBase {
  id: number;
  priority: PriorityType;
  comment: string;
  number: number;
}

export interface RectAnnotation extends AnnotationBase {
  type: 'rect';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface ArrowAnnotation extends AnnotationBase {
  type: 'arrow';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface FreehandAnnotation extends AnnotationBase {
  type: 'freehand';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  points: Point[];
}

export interface PointAnnotation extends AnnotationBase {
  type: 'point';
  x: number;
  y: number;
}

export type Annotation = RectAnnotation | ArrowAnnotation | FreehandAnnotation | PointAnnotation;

export interface DrawingState {
  type: ToolType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  priority: PriorityType;
  points?: Point[];
}

export interface PriorityConfig {
  label: string;
  color: string;
  dim: string;
}

export interface AppState {
  // Image state
  image: string | null;
  imgW: number;
  imgH: number;

  // UI state (NOT tracked by undo)
  projectName: string;
  tool: ToolType;
  priority: PriorityType;
  zoom: number;
  panX: number;
  panY: number;
  editingId: number | null;

  // Tracked by undo
  annotations: Annotation[];
  selectedId: number | null;

  // Actions
  setTool: (tool: ToolType) => void;
  setPriority: (priority: PriorityType) => void;
  setProjectName: (name: string) => void;
  setImage: (src: string, w: number, h: number) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setSelectedId: (id: number | null) => void;
  setEditingId: (id: number | null) => void;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotationComment: (id: number, comment: string) => void;
  deleteAnnotation: (id: number) => void;
  clearAll: () => void;
  reorderAnnotations: (fromIndex: number, toIndex: number) => void;
  moveAnnotation: (id: number, dx: number, dy: number) => void;
  resizeAnnotation: (id: number, handle: string, dx: number, dy: number) => void;
}
