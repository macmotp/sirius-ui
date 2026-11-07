import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: [
      // Resolve workspace sources for live updates without rebuilding packages.
      { find: '@sirius-ui/theme/tailwind.css', replacement: fileURLToPath(new URL('../../packages/theme/src/tailwind.css', import.meta.url)) },
      { find: '@sirius-ui/theme', replacement: fileURLToPath(new URL('../../packages/theme/src/index.css', import.meta.url)) },
      { find: '@sirius-ui/charts/style.css', replacement: fileURLToPath(new URL('../../packages/charts/src/style.css', import.meta.url)) },
      { find: '@sirius-ui/charts', replacement: fileURLToPath(new URL('../../packages/charts/src/index.ts', import.meta.url)) },
      { find: '@sirius-ui/dashboard', replacement: fileURLToPath(new URL('../../packages/dashboard/src/index.ts', import.meta.url)) },
      { find: '@sirius-ui/vue', replacement: fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)) },
    ],
    dedupe: ['vue'],
  },
})
