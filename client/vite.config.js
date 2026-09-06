// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Adjust port to match your backend (e.g. 5000 or 8000)
        changeOrigin: true,
      },
    },
  },
});