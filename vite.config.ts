import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Project Pages are served from /<repo-name>/
  base: '/EHT-15-PERIODS/',
  plugins: [react()],
})
