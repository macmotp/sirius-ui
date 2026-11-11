import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const directory = await mkdtemp(join(tmpdir(), 'sirius-packages-'))
const packages = ['theme', 'vue', 'charts', 'dashboard']
const dependencies = {}
const license = await readFile(join(root, 'LICENSE'), 'utf8')
const offline = process.argv.includes('--offline')

function run(command, args, cwd = directory) {
  execFileSync(command, args, { cwd, stdio: 'inherit' })
}

function exportTargets(value) {
  return typeof value === 'string' ? [value] : Object.values(value).flatMap(exportTargets)
}

for (const name of packages) {
  const location = join(root, 'packages', name)
  const manifest = JSON.parse(await readFile(join(location, 'package.json'), 'utf8'))
  assert.equal(manifest.private, undefined)
  assert.equal(manifest.publishConfig.access, 'public')
  assert.equal(manifest.publishConfig.tag, 'alpha')
  assert.equal(await readFile(join(location, 'LICENSE'), 'utf8'), license)
  for (const [dependency, version] of Object.entries(manifest.dependencies ?? {})) {
    if (dependency.startsWith('@sirius-ui/')) assert.equal(version, manifest.version)
  }
  const result = JSON.parse(execFileSync('npm', [
    'pack', '--ignore-scripts', '--json', '--pack-destination', directory, '--cache', join(directory, 'npm-cache'),
  ], { cwd: location, encoding: 'utf8' }))[0]
  const paths = result.files.map(file => file.path)
  assert.ok(paths.includes('LICENSE'))
  assert.ok(paths.includes('readme.md'))
  assert.ok(paths.includes('dist/docs/docs/component-catalog.md'))
  assert.ok(paths.includes('dist/docs/packages/vue/readme.md'))
  assert.ok(paths.every(path => path === 'package.json' || path === 'LICENSE' || path.endsWith('.md') || path.startsWith('dist/')))
  for (const target of exportTargets(manifest.exports)) assert.ok(paths.includes(target.slice(2)), `${name} missing ${target}`)
  dependencies[manifest.name] = `file:${join(directory, result.filename)}`
  console.log(`${manifest.name}@${manifest.version}: ${result.files.length} files, ${Math.round(result.size / 1024)} KiB packed`)
}

// Resolve the toolchain from the installed checkout, then install real archives
// in an isolated consumer. No workspace aliases or links are available there.
for (const name of ['vue', '@vue/server-renderer', 'typescript', 'vue-tsc', 'vite', '@vitejs/plugin-vue']) {
  const manifest = JSON.parse(await readFile(join(root, 'node_modules', name, 'package.json'), 'utf8'))
  dependencies[name] = manifest.version
}
await writeFile(join(directory, 'package.json'), JSON.stringify({
  name: 'sirius-package-consumer', private: true, type: 'module', dependencies,
  // Resolve unpublished internal versions to the actual archives under test.
  resolutions: Object.fromEntries(Object.entries(dependencies).filter(([name]) => name.startsWith('@sirius-ui/'))),
}, null, 2))
run('yarn', ['install', '--non-interactive', '--ignore-scripts', '--no-progress', ...(offline ? ['--offline'] : [])])
await mkdir(join(directory, 'src'))
await writeFile(join(directory, 'index.html'), '<div id="app"></div><script type="module" src="/src/main.ts"></script>')
await writeFile(join(directory, 'src/main.ts'), `import { createApp } from 'vue'
import '@sirius-ui/vue/style.css'
import '@sirius-ui/dashboard/style.css'
import '@sirius-ui/charts/style.css'
import App from './App.vue'
createApp(App).mount('#app')
`)
await writeFile(join(directory, 'src/App.vue'), `<script setup lang="ts">
import { shallowRef } from 'vue'
import { SButton, SCard, SField, SInput, STable, SPagination } from '@sirius-ui/vue'
import type { STableColumn, SPaginationData } from '@sirius-ui/vue'
import { SDashboardLayout, SMetricCard } from '@sirius-ui/dashboard'
import { SLineChart } from '@sirius-ui/charts'
const title = shallowRef('')
const columns: STableColumn<{ id: number }>[] = [{ key: 'id', label: 'Order' }]
const pagination: SPaginationData = { current_page: 1, last_page: 1, total: 1 }
</script>
<template>
  <SDashboardLayout main-labelledby="page-title">
    <template #brand>Acme</template>
    <template #navigation><a href="/">Overview</a></template>
    <h1 id="page-title">Overview</h1>
    <SMetricCard label="Orders" value="1" />
    <SCard>
      <SField v-slot="{ control }" label="Title"><SInput v-bind="control" v-model="title" /></SField>
      <SButton>Save</SButton>
      <STable :rows="[{ id: 1 }]" :columns="columns" row-key="id" caption="Orders" />
      <SPagination :pagination="pagination" />
      <SLineChart title="Orders over time" :data="[{ label: 'Mon', value: 1 }]" />
    </SCard>
  </SDashboardLayout>
</template>
`)
await writeFile(join(directory, 'vite.config.ts'), `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({ plugins: [vue()] })
`)
await writeFile(join(directory, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, skipLibCheck: false, lib: ['ES2022', 'DOM', 'DOM.Iterable'], types: ['vite/client'] },
  include: ['src/**/*.vue', 'src/**/*.ts'],
}))
run(join(directory, 'node_modules/.bin/vue-tsc'), ['--noEmit'])
run(join(directory, 'node_modules/.bin/vite'), ['build'])
await writeFile(join(directory, 'render.mjs'), `import assert from 'node:assert/strict'
import { h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { SButton } from '@sirius-ui/vue'
import { SMetricCard } from '@sirius-ui/dashboard'
import { SLineChart } from '@sirius-ui/charts'
assert.match(await renderToString(h(SButton, {}, () => 'Ready')), /Ready/)
assert.match(await renderToString(h(SMetricCard, { label: 'Orders', value: '1' })), /Orders/)
assert.match(await renderToString(h(SLineChart, { title: 'Orders over time', data: [{ label: 'Mon', value: 1 }] })), /Orders over time/)
`)
run('node', ['render.mjs'])

// Every local Markdown link in an installed guide must stay inside this bundle.
async function checkDocs(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) await checkDocs(file)
    else if (file.endsWith('.md')) {
      const content = await readFile(file, 'utf8')
      for (const [, link] of content.matchAll(/\]\(([^)]+)\)/g)) {
        if (/^(?:[a-z]+:|#)/i.test(link)) continue
        await readFile(join(dirname(file), link.split('#')[0]))
      }
    }
  }
}
for (const name of packages) await checkDocs(join(directory, 'node_modules/@sirius-ui', name, 'dist/docs'))
console.log(`Packed consumer passed type checks, production build, SSR, and documentation links. Archives and consumer are in ${directory}`)
