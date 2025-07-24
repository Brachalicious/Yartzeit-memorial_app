import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const apiPort = process.env.VITE_API_PORT || '3001';
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './client/src'),
      },
    },
    root: path.join(process.cwd(), 'client'),
    build: {
      outDir: path.join(process.cwd(), 'dist/public'),
      emptyOutDir: true,
      sourcemap: mode === 'development',
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false, // Allow Vite to use alternative ports
      cors: true,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    css: {
      devSourcemap: mode === 'development',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select'
      ],
    },
    clearScreen: false, // Don't clear terminal on restart
  };
});
