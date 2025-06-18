import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    basicSsl()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: true,
    proxy: {
      // --- FIX ---
      // Simplified proxy rules to be more direct.

      // Proxy requests to /api/token to the Spotify accounts server
      '/api/token': {
        target: 'https://accounts.spotify.com',
        changeOrigin: true,
      },
      // Proxy requests to /v1/... to the main Spotify API server
      '/v1': {
        target: 'https://api.spotify.com',
        changeOrigin: true,
      }
    }
  }
})
