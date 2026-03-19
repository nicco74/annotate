import { PenLine } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="ei">
        <PenLine size={36} strokeWidth={1.5} />
      </div>
      <div className="et">No annotations yet</div>
      <div className="ed">
        Select a tool from the toolbar
        <br />
        and draw on your screenshot
      </div>
    </div>
  );
}
