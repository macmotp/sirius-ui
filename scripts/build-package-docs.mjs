import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(await readFile(resolve('package.json'), 'utf8'))
const destination = resolve('dist/docs')
const files = [
  'docs/agent-guide.md',
  'docs/website-patterns.md',
  'docs/component-catalog.md',
  'docs/dashboard-patterns.md',
  'docs/icons.md',
  'packages/theme/readme.md',
  'packages/vue/readme.md',
  'packages/dashboard/readme.md',
  'packages/auth/readme.md',
  'packages/website/readme.md',
  'packages/charts/readme.md',
  'packages/charts/bar-chart.md',
  'packages/charts/donut-chart.md',
]
const included = new Set(files)
const repository = `https://github.com/macmotp/sirius-ui/blob/v${manifest.version}/`

// Keep guide links local to the installed version. Examples and implementation
// links point to the corresponding release tag in the source repository.
for (const file of files) {
  const content = await readFile(resolve(root, file), 'utf8')
  const output = content.replace(/\]\(([^)]+)\)/g, (match, link) => {
    if (link.startsWith(repository)) {
      const [target, anchor] = link.slice(repository.length).split('#')
      return included.has(target)
        ? `](${relative(dirname(file), target)}${anchor ? `#${anchor}` : ''})`
        : match
    }
    if (/^(?:[a-z]+:|#)/i.test(link)) return match
    const [path, anchor] = link.split('#')
    const target = relative(root, resolve(root, dirname(file), path))
    return included.has(target) ? match : `](${repository}${target}${anchor ? `#${anchor}` : ''})`
  })
  await mkdir(resolve(destination, dirname(file)), { recursive: true })
  await writeFile(resolve(destination, file), output)
}

await writeFile(resolve(destination, 'readme.md'), `# SiriusUI ${manifest.version}

Start with the [agent guide](docs/agent-guide.md), choose public exports from the [component catalog](docs/component-catalog.md), then read only the relevant contracts. Use [dashboard patterns](docs/dashboard-patterns.md) or [website patterns](docs/website-patterns.md) when composing a page.

For generic requests, map the user’s intent to the appropriate collection and a minimal page composition. Follow the agent guide’s composition rules; adapt app-owned content and supported variants while preserving chosen component internals. Reuse public exports and preserve their defaults, models, events, slots, and keyboard and focus behavior unless the task calls for a change. Keep project-specific routes, requests, permissions, and state in the consuming app. Configure the app's preferred icon set through [icon mappings](docs/icons.md).

This bundle contains the SiriusUI package guides, including previews whose release status is described in their guide. Install the packages needed by your app. Source and working-example links use the matching repository release tag.
`)
