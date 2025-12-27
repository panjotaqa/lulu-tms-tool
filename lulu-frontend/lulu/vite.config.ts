import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001, // Porta fixa (compatível com o backend que espera frontend em 3001)
    strictPort: false, // se 3001 estiver ocupada, tenta outra
    host: true,
  },
})