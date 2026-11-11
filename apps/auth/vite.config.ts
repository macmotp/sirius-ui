import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@sirius-ui/theme/tailwind.css', replacement: fileURLToPath(new URL('../../packages/theme/src/tailwind.css', import.meta.url)) },
      { find: '@sirius-ui/theme', replacement: fileURLToPath(new URL('../../packages/theme/src/index.css', import.meta.url)) },
      { find: '@sirius-ui/auth', replacement: fileURLToPath(new URL('../../packages/auth/src/index.ts', import.meta.url)) },
      { find: '@sirius-ui/vue', replacement: fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)) },
    ],
    dedupe: ['vue'],
  },
})
