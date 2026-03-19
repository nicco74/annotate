import { useStore } from '../../store/store';
import { AnnotationList } from './AnnotationList';
import { EmptyState } from './EmptyState';
import { SummaryBar } from './SummaryBar';
import './Panel.css';

export function AnnotationPanel() {
  const annotations = useStore(s => s.annotations);
  const selectedId = useStore(s => s.selectedId);
  const editingId = useStore(s => s.editingId);
  const setSelectedId = useStore(s => s.setSelectedId);
  const setEditingId = useStore(s => s.setEditingId);
  const updateAnnotationComment = useStore(s => s.updateAnnotationComment);
  const deleteAnnotation = useStore(s => s.deleteAnnotation);
  const clearAll = useStore(s => s.clearAll);
  const reorderAnnotations = useStore(s => s.reorderAnnotations);

  const ct = annotations.length;

  const handleToggleEdit = (id: number) => {
    if (editingId === id) {
      setEditingId(null);
    } else {
      setEditingId(id);
    }
  };

  const handleCommentSave = (id: number) => {
    setEditingId(null);
  };

  return (
    <div className="ann-panel">
      <div className="ann-header">
        <h2>
          Annotations
          {ct > 0 && <span className="count-badge">{ct}</span>}
        </h2>
        {ct > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>
      <div className="ann-list">
        {ct === 0 ? (
          <EmptyState />
        ) : (
          <AnnotationList
            annotations={annotations}
            selectedId={selectedId}
            editingId={editingId}
            onSelect={(id) => setSelectedId(id)}
            onToggleEdit={handleToggleEdit}
            onDelete={(id) => deleteAnnotation(id)}
            onCommentChange={(id, comment) => updateAnnotationComment(id, comment)}
            onCommentSave={handleCommentSave}
            onReorder={reorderAnnotations}
          />
        )}
      </div>
      <SummaryBar annotations={annotations} />
    </div>
  );
}
