import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    port: 9080,
  },
  build: {
    outDir: 'dist/render',
    emptyOutDir: true,
  },
})
