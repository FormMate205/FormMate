import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        visualizer({
            open: true, // Automatically opens the visualizer in your browser
        }),
        VitePWA({
            registerType: 'prompt',
            injectRegister: false,
            includeAssets: ['formmate-192x192.png', 'formmate-512x512.png'],
            manifest: {
                name: 'FormMate',
                short_name: 'FormMate',
                description:
                    '지인 간 금전 거래에서 신뢰는 유지하고, 번거로움은 줄이는 스마트한 계약 & 중개 플랫폼',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                start_url: '/',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                prefer_related_applications: false,
                icons: [
                    {
                        src: 'formmate-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'formmate-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
            },
            devOptions: {
                enabled: false,
                navigateFallback: 'index.html',
                suppressWarnings: true,
                type: 'module',
            },
        }),
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    define: {
        global: 'window',
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'jspdf-vendor': ['jspdf'],
                    'html2canvas-vendor': ['html2canvas'],
                },
            },
        },
    },
});
