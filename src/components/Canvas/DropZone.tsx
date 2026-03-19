import { ImagePlus } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  return (
    <div className="drop-zone">
      <div className="drop-card" onClick={handleClick}>
        <div className="di">
          <ImagePlus size={48} strokeWidth={1.5} color="var(--text-sub)" />
        </div>
        <div className="dt">Drop a screenshot or click to upload</div>
        <div className="dh">
          Or paste from clipboard with <kbd>Ctrl+V</kbd>
          <br />
          Supports PNG, JPG, WebP
        </div>
      </div>
    </div>
  );
}
