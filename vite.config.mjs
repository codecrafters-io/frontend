import { ember } from '@embroider/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [ember()],
  resolve: {
    alias: {
      'codecrafters-frontend/config/environment': resolve(__dirname, 'vite-env.js'),
      'codecrafters-frontend': resolve(__dirname, 'app'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'app/index.html',
      },
    },
  },
});
