import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const apiPort = process.env.VITE_API_PORT || '3001';
  const isDev = mode === 'development';
  
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
      sourcemap: isDev,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          }
        }
      }
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
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Proxying request:', req.method, req.url);
            });
          }
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
      exclude: ['@radix-ui/react-dialog', '@radix-ui/react-select']
    },
    clearScreen: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  };
});
