import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.ngrok-free.app', '8b86-2409-40c1-2009-1995-9ddd-cd28-4378-8bd2.ngrok-free.app']
  }
})
