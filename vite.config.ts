import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets work locally and when GitHub Pages serves this repository
  // from its project subpath.
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
