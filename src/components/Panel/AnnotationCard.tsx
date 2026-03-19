import { useRef, useEffect } from 'react';
import { Pencil, Check, Trash2, GripVertical } from 'lucide-react';
import type { Annotation } from '../../store/types';
import { PRI } from '../../utils/constants';

interface AnnotationCardProps {
  annotation: Annotation;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
  onCommentChange: (comment: string) => void;
  onCommentSave: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export function AnnotationCard({
  annotation: a,
  isSelected,
  isEditing,
  onSelect,
  onToggleEdit,
  onDelete,
  onCommentChange,
  onCommentSave,
  dragHandleProps,
}: AnnotationCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const p = PRI[a.priority];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCommentSave();
    }
    if (e.key === 'Escape') {
      onCommentSave();
    }
  };

  return (
    <div
      className={`a-card${isSelected ? ' sel' : ''}`}
      onClick={onSelect}
    >
      <div className="accent-bar" style={{ background: p.color, opacity: isSelected ? 1 : 0 }} />
      <div className="a-top">
        {dragHandleProps && (
          <div className="drag-handle" {...dragHandleProps}>
            <GripVertical size={14} />
          </div>
        )}
        <div className="a-num" style={{ background: p.color }}>{a.number}</div>
        <div className="a-info">
          <span className="a-tag" style={{ color: p.color }}>{p.label}</span>
          <span className="a-tool">{a.type}</span>
        </div>
        <div className="a-actions">
          <button
            className="a-act"
            onClick={(e) => { e.stopPropagation(); onToggleEdit(); }}
            title={isEditing ? 'Save' : 'Edit'}
            aria-label={isEditing ? 'Save comment' : 'Edit comment'}
          >
            {isEditing ? <Check size={14} /> : <Pencil size={14} />}
          </button>
          <button
            className="a-act del"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete"
            aria-label="Delete annotation"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="a-input-wrap">
          <input
            ref={inputRef}
            className="a-input"
            value={a.comment}
            onChange={(e) => onCommentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            placeholder="Describe the issue..."
            autoComplete="off"
          />
          <div className="a-input-hint">Enter to save &middot; Esc cancel</div>
        </div>
      ) : a.comment ? (
        <div className="a-comment">{a.comment}</div>
      ) : (
        <div className="a-comment empty">Click edit to add description...</div>
      )}
    </div>
  );
}
