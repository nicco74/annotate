export async function exportAnnotatedPNG(
  imgSrc: string,
  imgW: number,
  imgH: number,
  _annotations: unknown[],
  projectName: string,
  svgElement: SVGSVGElement | null,
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = imgW;
  canvas.height = imgH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, imgW, imgH);
      resolve();
    };
    img.src = imgSrc;
  });

  if (svgElement) {
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    svgClone.setAttribute('width', String(imgW));
    svgClone.setAttribute('height', String(imgH));
    const svgStr = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const svgImg = new Image();
    await new Promise<void>((resolve) => {
      svgImg.onload = () => {
        ctx.drawImage(svgImg, 0, 0);
        URL.revokeObjectURL(svgUrl);
        resolve();
      };
      svgImg.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        resolve();
      };
      svgImg.src = svgUrl;
    });
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-annotated.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
