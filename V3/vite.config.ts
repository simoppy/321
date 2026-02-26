import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),   
      },
    },
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0'),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});