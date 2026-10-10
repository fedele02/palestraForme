import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In sviluppo /api/chat gira dentro Vite (in produzione è la funzione Vercel in api/chat.js)
const devApi = () => ({
  name: 'dev-api',
  configureServer(server) {
    server.middlewares.use('/api/chat', async (req, res) => {
      const { handleChat } = await server.ssrLoadModule('/server/chat.js')
      handleChat(req, res)
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Rende disponibili al codice server (server/chat.js) anche le variabili senza prefisso VITE_, come GROQ_API_KEY
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
    process.env[key] ??= value
  }

  return {
    plugins: [react(), tailwindcss(), devApi()],
    server: {
      historyApiFallback: true,
    },
  }
})
