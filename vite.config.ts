import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
        babelrc: false,
        configFile: false
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});