import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works under GitHub Pages (/comply-ai/demo/).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '../docs/demo', emptyOutDir: true },
});
