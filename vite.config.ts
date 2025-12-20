import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 백엔드 API 프록시 설정 (CORS 우회)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // 디버깅용 로그
        configure: (proxy) => {
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:8080${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`[Proxy] Response: ${proxyRes.statusCode} for ${req.url}`);
          });
          proxy.on('error', (err, req) => {
            console.error(`[Proxy] Error for ${req.url}:`, err.message);
          });
        },
      },
    },
  },
})
