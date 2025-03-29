/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  root: `${import.meta.dirname}/src`,
  publicDir: `${import.meta.dirname}/public`,
  plugins: [ViteMinifyPlugin({})],
  build: {
    outDir: '../dist',
    assetsDir: './',
    emptyOutDir: true,
    target: 'esnext',
  },
});
