import { useEffect, useRef, useState } from 'react';

// from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

function pixelateImage(originalImage: HTMLImageElement, options?: { transparence?: boolean, ignore?: string[] } | undefined) {
  const { transparence } = options || {};
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  const canvasWidth = originalImage.width;
  const canvasHeight = originalImage.height;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);
  const originalImageData = context.getImageData(
    0,
    0,
    canvasWidth,
    canvasHeight
  ).data;

  const result = [];

  let newY = -1;
  for (let y = 0; y < canvasHeight; y += 1) {
    newY += 1;
    let newX = -1;
    for (let x = 0; x < canvasWidth; x += 1) {
      newX += 1;
      // extracting the position of the sample pixel
      const pixelIndexPosition = (x + y * canvasWidth) * 4;
      // drawing a square replacing the current pixels

      // ignore some pixels
      if (!transparence && originalImageData[pixelIndexPosition + 3] === 0) continue;
      
      const rgba = [
        originalImageData[pixelIndexPosition],
        originalImageData[pixelIndexPosition+1],
        originalImageData[pixelIndexPosition+2],
        originalImageData[pixelIndexPosition+3] / 255,
      ]

      context.fillStyle = 'rgba(' +
        originalImageData[pixelIndexPosition] + ',' + // r
        originalImageData[pixelIndexPosition + 1] + ',' + // g
        originalImageData[pixelIndexPosition + 2] + ',' + // b
        originalImageData[pixelIndexPosition + 3] / 255 //a
      + ')';

      result.push(`<rect width="1" height="1" x="${newX}" y="${newY}" fill="rgba(${rgba.join(',')})"></rect>`)
      context.fillRect(x, y, 1, 1);
    }
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}px" height="${canvasHeight}px" viewBox="0 0 ${canvasWidth} ${canvasHeight}">${result.join('')}</svg>`;
}

const Pixelator = ({ src }: { src: string }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ svg, setSvg ] = useState<string>();

  useEffect(() => {
    handleInitPixelator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  function handlePreloadImage(): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = src;
      img.onload = function() {
        resolve(img);
      }
    })
  }

  const handleInitPixelator = async() => {
    const image = await handlePreloadImage();
    const svg = pixelateImage(image, { transparence: false });

    setSvg(svg);
  }
  

  function handleExportSVG() {
    if(!svg) return
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'pixel.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  }
  

  return (
    <div ref={rootRef} style={{display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', border: '1px solid #aaa'}} >
      { svg && <div dangerouslySetInnerHTML={{__html: svg}}></div> }
      <button style={{ position: 'absolute', right: '12px', bottom: '12px', border: 'none', background: 'none', cursor: 'pointer' }} onClick={handleExportSVG}>Export</button>
    </div>
  )
}

export default Pixelator;