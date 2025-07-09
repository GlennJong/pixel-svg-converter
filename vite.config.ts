import { defineConfig } from 'vite'
import eruda from 'vite-plugin-eruda';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eruda()],
})
