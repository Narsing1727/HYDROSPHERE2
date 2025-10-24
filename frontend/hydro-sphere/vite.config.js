import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ✅ Fully customized Vite config
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',  // or '0.0.0.0' if you want to test on mobile
    port: 5174,         // ✅ use the working port
    open: true,         // ✅ auto-open in browser
    strictPort: true,   // ✅ fail if port already in use (no auto change)
    cors: true,         // ✅ enables CORS headers during dev
  },
  preview: {
    port: 5174,         // also use 5174 when running `vite preview`
  },
})
