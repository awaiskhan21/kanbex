/** @type {import('vite').UserConfig} */

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePluginFonts } from 'vite-plugin-fonts'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'

import config from './config.js'
import postcss from './postcss.config.js'

const isHttps = process.env.HTTPS ?? false

const { imagemin } = config

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin(imagemin),
    createHtmlPlugin({
      minify: true,
      entry: 'src/main.tsx'
    }),
    VitePluginFonts({
      // Custom fonts
      custom: {
        families: [
          {
            name: 'CascadiaCodePL',
            src: './src/assets/fonts/*.woff2'
          }
        ],
        display: 'swap',
        preload: true,
        prefetch: false,
        injectTo: 'head-prepend'
      }
    })
  ],
  css: {
    postcss
  },
  resolve: {
    alias: [
      { find: '@/', replacement: '/src' },
      { find: '@/Assets', replacement: '/src/assets' }
    ]
  },
  server: {
    https: !!isHttps,
    proxy: {
      '/api/': {
        target: 'http://localhost:9000',
        changeOrigin: true
      }
    }
  }
})
