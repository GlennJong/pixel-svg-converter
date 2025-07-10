import React, { useState, useRef } from 'react'

import './App.css'
import Pixelator from './components/Pixelator'


function App() {
  const [srcList, setSrcList] = useState<string[]>([]);

  const dropRef = useRef<HTMLDivElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const list: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          list.push(event.target.result);
          if (list.length === files.length) setSrcList(list);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.style.borderColor = '#409eff';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) {
      dropRef.current.style.borderColor = '#aaa';
    }
  };

  return (
    <div className="app">
      <div style={{ display: 'flex', gap: '4px', width: '100vw', height: '100vh' }}>
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #aaa',
            padding: 12,
            width: '50%',
            textAlign: 'center',
            color: '#888',
            // background: '#fafafa',
            cursor: 'pointer',
            marginBottom: 8,
            transition: 'border-color 0.2s',
          }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.onchange = (e: Event) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                handleFiles(target.files);
              }
            };
            input.click();
          }}
        >
          { srcList.length !== 0 ?
            srcList.map((src, idx) => <img key={idx} src={src} /> )
            :
            `Drag file here or click to upload`
          }
          <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%', height: '100%', gap: '4px' }}>
          { srcList.map((src, idx) => 
            <React.Fragment key={idx}>
              <Pixelator src={src} />
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
