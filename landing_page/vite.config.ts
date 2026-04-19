import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // CRITICAL: Disable StrictMode in dev.
      // React StrictMode double-invokes every component, effect, and
      // useFrame callback. With GSAP ScrollTrigger + Three.js this means:
      //   - ScrollTriggers are registered twice → duplicate scroll listeners
      //   - useFrame runs 2× per tick → double GPU draw calls
      //   - useGSAP fires twice → conflicting animation timelines
      // This is the #1 cause of dev-mode jitter that disappears in prod.
      // jsxRuntime: 'automatic' ensures no extra re-render overhead.
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],

  build: {
    // Increase chunk size limit to prevent GLB/HDR from being split
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Keep Three.js + R3F in one chunk to prevent module load stalls
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'gsap-vendor':  ['gsap'],
        },
      },
    },
  },

  // Dev server optimisations
  server: {
    // Pre-bundle these so they're available instantly without HMR stalls
    warmup: {
      clientFiles: [
        'src/component/ProductDetailSection.tsx',
        'src/component/Basketball3D.tsx',
      ],
    },
  },

  optimizeDeps: {
    // Force pre-bundling of heavy deps so they don't stall on first load
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'gsap',
      '@gsap/react',
    ],
  },
});