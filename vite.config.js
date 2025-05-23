import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: true,
  },
  esbuild: {
    jsx: 'transform', // This tells esbuild to handle JSX correctly in JS files
  },
  plugins: [react()],
});
