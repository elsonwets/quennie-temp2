import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

// Keep in sync with SITE_URL in src/content.ts
const SITE_URL = 'https://www.quennie.com'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      // every page is pre-rendered to static HTML at build time → instant first paint, perfect for SEO
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
        // skip in-page anchors and the trailing-slash duplicate of /projetos
        filter: (page) => !page.path.includes('#') && !(page.path.length > 1 && page.path.endsWith('/')),
      },
      sitemap: { enabled: true, host: SITE_URL },
    }),
    viteReact(),
  ],
  build: {
    rollupOptions: {
      output: {
        // three.js lives in its own lazily-loaded chunk
        manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined),
      },
    },
  },
})
