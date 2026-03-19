export function relPos(
  e: { clientX: number; clientY: number },
  canvasInnerRef: HTMLDivElement | null,
  zoom: number,
): { x: number; y: number } {
  if (!canvasInnerRef) return { x: 0, y: 0 };
  const r = canvasInnerRef.getBoundingClientRect();
  return { x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom };
}
