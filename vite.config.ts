import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', '@supabase/supabase-js']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
          admin: [
            './src/components/admin/AdminRoute',
            './src/components/admin/AdminDashboard',
            './src/components/admin/AdminLogin'
          ]
        }
      }
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    cors: true
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: false,
    cors: true
  },
  esbuild: {
    target: 'es2020',
    legalComments: 'none'
  },
  css: {
    devSourcemap: false
  }
});