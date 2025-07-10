import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import eruda from "vite-plugin-eruda";



// https://vite.dev/config/
export default defineConfig({
  mode: 'dev',
  base: './',
  plugins: [react(), eruda()],
  server: {
      // https: true,
      host: true,
      port: 8000,
  },
  preview: {
      // https: true,
      host: true,
      port: 8000,
} ,
})

