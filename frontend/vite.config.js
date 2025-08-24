import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  // Remove the base: './' line - this is causing the routing issues
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})