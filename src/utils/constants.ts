import type { PriorityConfig, PriorityType } from '../store/types';

export const PRI: Record<PriorityType, PriorityConfig> = {
  bug:      { label: 'Bug',      color: '#f45866', dim: '#f4586618' },
  improve:  { label: 'Improve',  color: '#f0a83a', dim: '#f0a83a18' },
  question: { label: 'Question', color: '#4da4f5', dim: '#4da4f518' },
  note:     { label: 'Note',     color: '#a78bfa', dim: '#a78bfa18' },
};

export const PRIORITY_ORDER: PriorityType[] = ['bug', 'improve', 'question', 'note'];

export const PRESETS: Record<string, { tool: string; priority: PriorityType; label: string }> = {
  bugs:       { tool: 'rect',     priority: 'bug',     label: 'Bug Report' },
  layout:     { tool: 'rect',     priority: 'improve', label: 'Layout Review' },
  ux:         { tool: 'point',    priority: 'improve', label: 'UX Feedback' },
  responsive: { tool: 'rect',     priority: 'bug',     label: 'Responsive Check' },
  cleanup:    { tool: 'freehand', priority: 'note',    label: 'Code Cleanup' },
};

export const ZOOM_MIN = 0.15;
export const ZOOM_MAX = 6;
export const ZOOM_STEP_MULTIPLY = 1.1;
export const MAX_HISTORY = 50;
