import dts from 'vite-plugin-dts';
import path from 'node:path';
import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'auto-typer-vue': path.resolve(import.meta.dirname, './src/index.ts'),
    },
  },
  build: {
    minify: true,
    lib: {
      fileName: (type) => {
        if (type === 'es') return 'esm/index.js';
        if (type === 'cjs') return 'index.js';
        return 'index.js';
      },
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    // sourcemap: true,
    rollupOptions: {
      external: [
        'vue',
      ],
    },
  },
  plugins: [
    Vue({
      // reactivityTransform: true,
    }),
    // https://www.npmjs.com/package/vite-plugin-dts
    dts({
      include: 'src',
      bundleTypes: true,
    }),
  ],
});
