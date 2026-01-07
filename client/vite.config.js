import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 4173,
    host: true, // This exposes the app to the internet
    allowedHosts: [
      "https-github-com-xicoldes-anime-api.onrender.com", // The exact host from your error
      "anime-api-mvc.onrender.com" // Just in case you use the shorter one later
    ]
  }
})