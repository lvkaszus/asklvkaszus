import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    allowedHosts: mode !== 'production'
      ? ['ask.lvkaszus.dev']
      : []
  }
}))
