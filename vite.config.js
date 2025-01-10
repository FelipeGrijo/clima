/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  root: `${import.meta.dirname}/src`,
  plugins: [
    // input https://www.npmjs.com/package/html-minifier-terser options
    ViteMinifyPlugin({}),
  ],
  build: {
    outDir: '../dist',
    assetsDir: './',
    emptyOutDir: true,
    target: 'esnext',
  },
});
