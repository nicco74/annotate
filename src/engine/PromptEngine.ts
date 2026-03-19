import type { Annotation } from '../store/types';
import { PRI, PRIORITY_ORDER } from '../utils/constants';
import { getSemanticZone, formatCoordString } from './coordinates';
import { expandToPrompt } from './expansion';

function buildAnnotationBlock(a: Annotation, imgW: number, imgH: number): string {
  const zone = getSemanticZone(a, imgW, imgH);
  const coords = formatCoordString(a, imgW, imgH);
  const priLabel = PRI[a.priority]?.label?.toUpperCase() || 'NOTE';
  const prompt = expandToPrompt(a.comment, a.priority, zone);
  let block = `[#${a.number}] ${priLabel} -- ${zone}`;
  if (coords) block += `\n   Location: ${coords}`;
  block += `\n   ${prompt}`;
  return block;
}

export function generatePrompt(
  annotations: Annotation[],
  projectName: string,
  imgW: number,
  imgH: number,
): string {
  const ct = annotations.length;
  if (!ct) return '';

  const bugCt = annotations.filter(a => a.priority === 'bug').length;
  const impCt = annotations.filter(a => a.priority === 'improve').length;
  const qCt = annotations.filter(a => a.priority === 'question').length;
  const nCt = annotations.filter(a => a.priority === 'note').length;

  const summary: string[] = [];
  if (bugCt) summary.push(`${bugCt} bug${bugCt > 1 ? 's' : ''}`);
  if (impCt) summary.push(`${impCt} improvement${impCt > 1 ? 's' : ''}`);
  if (qCt) summary.push(`${qCt} question${qCt > 1 ? 's' : ''}`);
  if (nCt) summary.push(`${nCt} note${nCt > 1 ? 's' : ''}`);

  const parts: string[] = [];

  let preamble = `I've annotated a screenshot of my ${projectName} with ${ct} item${ct > 1 ? 's' : ''} (${summary.join(', ')}).`;
  if (imgW && imgH) preamble += ` Screenshot dimensions: ${imgW}x${imgH}px.`;
  preamble += ` The numbered markers on the attached screenshot show exact locations. Here is what needs attention:`;
  parts.push(preamble);
  parts.push('');

  const sorted = [...annotations].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  );

  sorted.forEach(a => {
    parts.push(buildAnnotationBlock(a, imgW, imgH));
    parts.push('');
  });

  if (bugCt) {
    parts.push(`Prioritize fixing the ${bugCt} bug${bugCt > 1 ? 's' : ''} first, then address improvements. Reference the screenshot markers for exact locations.`);
  } else {
    parts.push(`Reference the screenshot markers for exact locations of each item.`);
  }

  return parts.join('\n');
}
