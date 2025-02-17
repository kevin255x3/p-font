import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src 'self' https://formspree.io; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://upload-widget.cloudinary.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.cloudinary.com https://*.cloudinary.net; connect-src 'self' https://api.cloudinary.com https://formspree.io; frame-src 'self' https://upload-widget.cloudinary.com;"
    }
  }
})