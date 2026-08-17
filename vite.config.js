import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import edgeTtsDev from './plugins/edgeTtsDev.js'
import geminiProxy from './plugins/geminiProxy.js'
import paymentsProxy from './plugins/paymentsProxy.js'
import youtubeProxy from './plugins/youtubeProxy.js'
import brollProxy from './plugins/brollProxy.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      edgeTtsDev(),
      geminiProxy(),
      paymentsProxy(),
      youtubeProxy(),
      brollProxy()
    ],
    define: {
      'process.env.YOUTUBE_API_KEY': JSON.stringify(env.YOUTUBE_API_KEY || env.VITE_YOUTUBE_API_KEY),
      'import.meta.env.YOUTUBE_API_KEY': JSON.stringify(env.YOUTUBE_API_KEY || env.VITE_YOUTUBE_API_KEY),
    },
    server: {
      host: true,
      port: 5173,
      open: true
    },
    build: {
      target: 'es2020',
      outDir: 'dist'
    }
  }
})