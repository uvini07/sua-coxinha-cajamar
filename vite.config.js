import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { SITE_URL } from './site.config.js'

// Troca %SITE_URL% no index.html pelo endereço público (site.config.js).
const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
})

export default defineConfig({
  plugins: [
    react(),
    siteUrl(),
    // Service worker só: o manifest é gerado por loja em scripts/gerar-paginas.mjs,
    // porque cada franquia (/cajamar, /jundiai...) instala como um app próprio.
    VitePWA({
      manifest: false,
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Páginas (inclusive as geradas por loja depois do build): tenta a rede
        // primeiro, pra sempre pegar o HTML e o SEO certos; cai pro cache só
        // quando não tem internet.
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'paginas', networkTimeoutSeconds: 3 },
          },
          {
            urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'estaticos' },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'imagens',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
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
