import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import router from 'unplugin-vue-router/vite'
import { ClientSideLayout } from 'vite-plugin-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import legacy from '@vitejs/plugin-legacy'
import TurboConsole from 'unplugin-turbo-console/vite'
import { analyzer } from 'vite-bundle-analyzer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    router({
      dts: './types/routes.d.ts',
      routesFolder: {
        src: './src/views',
      },
    }),
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    ClientSideLayout(),
    Components({
      dts: './types/components.d.ts',
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
    }),
    AutoImport({
      dts: './types/auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'pinia'],
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    TurboConsole({
      highlight: {
        extendedPathFileNames: ['index'],
      },
    }),
    analyzer({
      // enable if need
      enabled: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    warmup: {
      clientFiles: ['src/main.ts'],
    },
  },
  optimizeDeps: {},
})
