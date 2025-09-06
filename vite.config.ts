import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 🔹 Import correcto de path

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 🔹 Alias para @/
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});