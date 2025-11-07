import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

async function buildProject() {
  try {
    console.log('🚀 Starting build process...');
    
    const result = await build({
      plugins: [react()],
      build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        target: 'es2015',
        rollupOptions: {
          input: {
            main: resolve(process.cwd(), 'index.html')
          },
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['react-router-dom'],
              ui: ['framer-motion', 'lucide-react'],
              stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js']
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': resolve(process.cwd(), 'src')
        }
      },
      optimizeDeps: {
        include: ['react', 'react-dom']
      }
    });
    
    console.log('✅ Build completed successfully!');
    return result;
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();