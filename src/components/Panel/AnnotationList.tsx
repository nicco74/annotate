import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Annotation } from '../../store/types';
import { AnnotationCard } from './AnnotationCard';

interface SortableCardProps {
  annotation: Annotation;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onToggleEdit: () => void;
  onDelete: () => void;
  onCommentChange: (comment: string) => void;
  onCommentSave: () => void;
}

function SortableCard(props: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.annotation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <AnnotationCard
        {...props}
        dragHandleProps={listeners as Record<string, unknown>}
      />
    </div>
  );
}

interface AnnotationListProps {
  annotations: Annotation[];
  selectedId: number | null;
  editingId: number | null;
  onSelect: (id: number) => void;
  onToggleEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCommentChange: (id: number, comment: string) => void;
  onCommentSave: (id: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function AnnotationList({
  annotations,
  selectedId,
  editingId,
  onSelect,
  onToggleEdit,
  onDelete,
  onCommentChange,
  onCommentSave,
  onReorder,
}: AnnotationListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = annotations.findIndex(a => a.id === active.id);
    const newIndex = annotations.findIndex(a => a.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={annotations.map(a => a.id)}
        strategy={verticalListSortingStrategy}
      >
        {annotations.map(a => (
          <SortableCard
            key={a.id}
            annotation={a}
            isSelected={selectedId === a.id}
            isEditing={editingId === a.id}
            onSelect={() => onSelect(a.id)}
            onToggleEdit={() => onToggleEdit(a.id)}
            onDelete={() => onDelete(a.id)}
            onCommentChange={(c) => onCommentChange(a.id, c)}
            onCommentSave={() => onCommentSave(a.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
