import { useRef } from 'react';
import { Upload, Undo2, Redo2, Download, Crosshair } from 'lucide-react';
import { useStore } from '../../store/store';
import { useTemporalStore } from '../../store/store';
import { exportAnnotatedPNG } from '../../utils/export';
import { ToolGroup } from './ToolGroup';
import { PriorityGroup } from './PriorityGroup';
import { ZoomControls } from './ZoomControls';
import { PresetMenu } from './PresetMenu';
import './Toolbar.css';

interface ToolbarProps {
  canvasWrapRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function Toolbar({ canvasWrapRef, svgRef }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectName = useStore(s => s.projectName);
  const setProjectName = useStore(s => s.setProjectName);
  const image = useStore(s => s.image);
  const imgW = useStore(s => s.imgW);
  const imgH = useStore(s => s.imgH);
  const annotations = useStore(s => s.annotations);

  const undo = useTemporalStore(s => s.undo);
  const redo = useTemporalStore(s => s.redo);
  const pastStates = useTemporalStore(s => s.pastStates);
  const futureStates = useTemporalStore(s => s.futureStates);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        useStore.getState().setImage(src, img.width, img.height);
        if (canvasWrapRef.current) {
          const r = canvasWrapRef.current.getBoundingClientRect();
          const sx = (r.width - 40) / img.width;
          const sy = (r.height - 40) / img.height;
          const zoom = Math.min(sx, sy, 1);
          useStore.getState().setZoom(zoom);
          useStore.getState().setPan(
            (r.width - img.width * zoom) / 2,
            (r.height - img.height * zoom) / 2,
          );
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExport = () => {
    if (!image) return;
    exportAnnotatedPNG(image, imgW, imgH, annotations, projectName, svgRef.current);
  };

  return (
    <div className="toolbar">
      <div className="tb-brand">
        <div className="logo">
          <Crosshair size={14} color="white" />
        </div>
        <span>Annotate</span>
      </div>

      <ToolGroup />
      <div className="tb-sep" />
      <PriorityGroup />
      <div className="tb-sep" />

      <input
        className="proj-input"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Project name"
        aria-label="Project name"
      />

      <div style={{ flex: 1 }} />

      <button
        className="undo-redo-btn"
        onClick={() => undo()}
        disabled={pastStates.length === 0}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 size={16} />
      </button>
      <button
        className="undo-redo-btn"
        onClick={() => redo()}
        disabled={futureStates.length === 0}
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo"
      >
        <Redo2 size={16} />
      </button>

      <div className="tb-sep" />

      <button
        className="upload-btn"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Upload screenshot"
      >
        <Upload size={14} /> Upload
      </button>

      {image && (
        <button className="export-btn" onClick={handleExport} aria-label="Export annotated PNG">
          <Download size={14} /> Export
        </button>
      )}

      <div className="tb-sep" />
      <PresetMenu />
      <div className="tb-sep" />
      <ZoomControls canvasWrapRef={canvasWrapRef} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
