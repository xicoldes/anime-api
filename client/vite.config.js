import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      "https-github-com-xicoldes-anime-api.onrender.com", // Add your specific Render URL
      "anime-api-mvc.onrender.com", // Add this if you have a shorter custom name
      "localhost"
    ]
  }
})