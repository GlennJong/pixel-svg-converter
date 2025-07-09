import React, { useEffect, useRef, useState } from 'react';

// from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

function pixelateImage(originalImage: HTMLImageElement, pixelationFactor: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;


  const originalWidth = originalImage.width;
  const originalHeight = originalImage.height;
  const canvasWidth = originalWidth;
  const canvasHeight = originalHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.drawImage(originalImage, 0, 0, originalWidth, originalHeight);
  const originalImageData = context.getImageData(
    0,
    0,
    originalWidth,
    originalHeight
  ).data;

  const result = [];

  let newY = 0;
  if (pixelationFactor !== 0) {
    for (let y = 0; y < originalHeight; y += pixelationFactor) {
      newY += 1;
      let newX = 0;
      for (let x = 0; x < originalWidth; x += pixelationFactor) {
        newX += 1;
        // extracting the position of the sample pixel
        const pixelIndexPosition = (x + y * originalWidth) * 4;
        // drawing a square replacing the current pixels
        
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

        result.push({
          x: newX * pixelationFactor,
          y: newY * pixelationFactor,
          rgba
        })
        
        context.fillRect(x, y, pixelationFactor, pixelationFactor);
      }
    }
  }

  return result;
}

type PixelData = {
  x: number;
  y: number;
  rgba: number[];
} 


const Pixelator = ({ src }: { src: string }) => {

  const rootRef = useRef<HTMLDivElement>(null);
  const [ data, setData ] = useState<PixelData[]>();
  const [ scale, setScale ] = useState(1);
  const [ imgSize, setImgSize ] = useState<number[] | undefined>();
  

  useEffect(() => {
    handleInitPixelator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  function handlePreloadImage() {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = src;
      img.onload = function() {
        setImgSize([img.width, img.height]);
        resolve(img);
      }
    })
  }

  const handleInitPixelator = async() => {
    const image = await handlePreloadImage();
    const data = pixelateImage(image, 1);
    
    setData(data);
  }
  

  function handleExportSVG() {
    if (!rootRef.current) return
    const svg = rootRef.current.querySelector('svg');
    if(!svg) return
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    console.log(downloadLink);
    downloadLink.href = svgUrl;
    downloadLink.download = 'pixel.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  }
  

  return (
    <>
      <div ref={rootRef} style={{ display: 'flex', padding: '20px', background: '#666' }}>
        <div>
          <img src={src} />
        </div>
        <div>
          { (data && imgSize) &&
            <svg
              width={`${imgSize[0]}px`}
              height={`${imgSize[1]}px`}
              viewBox={`0 0 ${data[data.length - 1].x} ${data[data.length - 1].y}`}
              viewPort={`0 0 ${data[data.length - 1].x} ${data[data.length - 1].y}`}
            >
              { data.map((_item, i) =>
                <rect key={i} width={scale * 1} height={scale * 1} x={_item.x} y={_item.y} fill={`rgba(${_item.rgba.join(',')})`} />
              ) }
            </svg>
          }
        </div>
        <button onAbort={handleExportSVG}>output</button>
      </div>
    </>
  )
}

export default Pixelator;