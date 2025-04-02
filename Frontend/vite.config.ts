import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    define: {
        global: 'window',
    },
    server: {
        proxy: {
            '/ws': {
                target: 'https://j12a205.p.ssafy.io',
                ws: true,
                changeOrigin: true,
            },
        },
    },
});
