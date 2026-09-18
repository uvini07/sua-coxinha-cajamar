import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE_URL } from './site.config.js'

// Troca %SITE_URL% no index.html pelo endereço público (site.config.js).
const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
})

export default defineConfig({
  plugins: [react(), siteUrl()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion'
          if (id.includes('node_modules/react')) return 'react'
        },
      },
    },
  },
})
