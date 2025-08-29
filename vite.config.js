import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BrowserCodeRunner',
      fileName: (format) => `browser-code-runner.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['pyodide', 'fengari'],
      output: {
        globals: {
          pyodide: 'Pyodide',
          fengari: 'Fengari'
        }
      }
    },
    outDir: 'dist',
    sourcemap: true,
    minify: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}); 