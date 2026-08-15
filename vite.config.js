import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import edgeTtsDev from './plugins/edgeTtsDev.js'
import geminiProxy from './plugins/geminiProxy.js'
import paymentsProxy from './plugins/paymentsProxy.js'

export default defineConfig({
  plugins: [react(), edgeTtsDev(), geminiProxy(), paymentsProxy()],
  server: {
    host: true,
    port: 5173,
    open: true
  },
  build: {
    target: 'es2020',
    outDir: 'dist'
  }
})