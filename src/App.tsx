import { useRef } from 'react';
import { Toolbar } from './components/Toolbar/Toolbar';
import { CanvasArea } from './components/Canvas/CanvasArea';
import { AnnotationPanel } from './components/Panel/AnnotationPanel';
import { PromptBar } from './components/PromptBar/PromptBar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useKeyboardShortcuts(canvasWrapRef);

  return (
    <div className="app">
      <Toolbar canvasWrapRef={canvasWrapRef} svgRef={svgRef} />
      <div className="main-split">
        <CanvasArea canvasWrapRef={canvasWrapRef} svgRef={svgRef} />
        <AnnotationPanel />
      </div>
      <PromptBar />
    </div>
  );
}
