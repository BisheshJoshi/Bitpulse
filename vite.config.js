import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/price': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/candles': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/tickers': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
