import { useState } from 'react'

import './App.css'
import Pixelator from './components/Pixelator'


function App() {
  const [src, setSrc] = useState<string>('');

  // 處理圖片上傳
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setSrc(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <Pixelator scale={1} src={src} />
    </>
  );
}

export default App
