import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const apiPort = process.env.VITE_API_PORT || '3001';
  const isDev = mode === 'development';

  return {
    root: path.resolve(__dirname, 'client'), // Entry root for Vite (points to React app)
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'client/src'), // Ensures @ maps to /client/src
      },
    },
    build: {
      outDir: path.resolve(__dirname, 'dist/public'), // Output directory
      emptyOutDir: true,
      sourcemap: isDev,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      cors: true,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err, req, res) => {
              console.error('🔴 Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('📡 Proxying request:', req.method, req.url);
            });
          },
        },
      },
    },
    css: {
      devSourcemap: isDev,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
      ],
      exclude: [
        '@radix-ui/react-dialog',
        '@radix-ui/react-select'
      ],
    },
    clearScreen: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});


