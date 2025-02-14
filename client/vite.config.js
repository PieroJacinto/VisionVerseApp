import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as process from 'process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://vision-verse-app.vercel.app'
          : 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})