import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path - change 'CyborgTech' to your repository name
  base: process.env.NODE_ENV === 'production' ? '/CyborgTech/' : '/',
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false,
    open: false,
    cors: true,
    hmr: {
      port: 5174,
      clientPort: 5174,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Cache-Control': 'no-cache',
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
});
