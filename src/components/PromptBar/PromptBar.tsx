import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useStore } from '../../store/store';
import { generatePrompt } from '../../engine/PromptEngine';
import { copyToClipboard } from '../../utils/clipboard';
import './PromptBar.css';

export function PromptBar() {
  const annotations = useStore(s => s.annotations);
  const projectName = useStore(s => s.projectName);
  const imgW = useStore(s => s.imgW);
  const imgH = useStore(s => s.imgH);
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () => generatePrompt(annotations, projectName, imgW, imgH),
    [annotations, projectName, imgW, imgH],
  );

  const handleCopy = async () => {
    if (!prompt) return;
    const ok = await copyToClipboard(prompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="prompt-bar">
      <span className="prompt-label">Generated Prompt</span>
      <div className={`prompt-text${prompt ? '' : ' empty'}`}>
        {prompt || 'Annotate your screenshot to generate a prompt for Claude Code...'}
      </div>
      <button
        className={`prompt-copy${copied ? ' copied' : ''}`}
        onClick={handleCopy}
        aria-label="Copy prompt to clipboard"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy Prompt'}
      </button>
    </div>
  );
}
