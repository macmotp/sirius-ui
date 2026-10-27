import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import tailwindcss from '@tailwindcss/vite'
import { build } from 'vite'

test('the plain CSS export works independently of Tailwind', async () => {
  const css = await readFile(fileURLToPath(import.meta.resolve('@sirius-ui/theme')), 'utf8')

  assert.match(css, /color-scheme: light/)
  assert.match(css, /color-scheme: dark/)
  assert.doesNotMatch(css, /@(?:import|theme|custom-variant)\b/)
  assert.doesNotMatch(css, /box-sizing:/)
})

test('the published Tailwind entry generates runtime semantic utilities without a reset', async () => {
  const result = await build({
    configFile: false,
    root: fileURLToPath(new URL('.', import.meta.url)),
    plugins: [tailwindcss()],
    logLevel: 'silent',
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      rollupOptions: {
        input: fileURLToPath(new URL('./fixture.css', import.meta.url)),
      },
    },
  })
  const css = result.output
    .filter((file) => file.type === 'asset' && file.fileName.endsWith('.css'))
    .map((file) => String(file.source))
    .join('\n')

  assert.match(css, /\.bg-primary\s*\{\s*background-color: var\(--sirius-primary\)/)
  assert.match(css, /\.text-on-primary\s*\{\s*color: var\(--sirius-on-primary\)/)
  assert.match(css, /\.border-line\s*\{\s*border-color: var\(--sirius-line\)/)
  assert.match(css, /\.rounded-md\s*\{\s*border-radius: var\(--sirius-radius-md\)/)
  assert.match(css, /calc\(var\(--sirius-spacing\) \* 4\)/)
  assert.match(css, /:root\[data-theme=["']?dark/)
  assert.doesNotMatch(css, /@(?:import|theme|custom-variant)\b/)
  assert.doesNotMatch(css, /box-sizing:/)
})
