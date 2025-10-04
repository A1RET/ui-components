import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        VitePluginSvgSpritemap('./src/assets/icons/**/*.svg', {
            styles: false,
            prefix: false,
            route: 'sprite',
            svgo: {
                plugins: ['preset-default', 'removeDimensions'],
            },
            output: {
                name: 'sprite.svg',
                view: false,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
