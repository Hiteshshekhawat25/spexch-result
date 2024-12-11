import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'transform', // This tells esbuild to handle JSX correctly in JS files
  },
});
