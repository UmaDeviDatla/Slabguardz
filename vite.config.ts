import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'hostinger-spa-fallback',
      apply: 'build',
      closeBundle() {
        copyFileSync(
          new URL('./public/.htaccess', import.meta.url),
          new URL('./dist/.htaccess', import.meta.url),
        )
      },
    },
  ],
  server: {
    host: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
})
