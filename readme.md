# SiriusUI

Reusable Vue 3 components, CSS tokens, optional charts, and dashboard compositions for building interfaces with AI agents.

Start with the [component catalog](docs/component-catalog.md) to choose public exports and read their contracts. Use [dashboard patterns](docs/dashboard-patterns.md) when assembling pages. Agents should preserve component defaults, models, slots, events, and keyboard and focus behavior unless the task calls for a change. Applications own routes, API calls, permissions, and state.

## Installation

The four libraries are prepared for an initial `0.1.0-alpha.0` release. These registry commands apply after publication under the `alpha` tag. Vue components require Vue `^3.5.0`.

```sh
yarn add @sirius-ui/vue@alpha
```

For dashboard layouts and composed cards, add the dashboard package. Charts are optional.

```sh
yarn add @sirius-ui/dashboard@alpha
# Optional
yarn add @sirius-ui/charts@alpha
```

Import the styles for the packages you use once in your application entry.

```ts
import '@sirius-ui/vue/style.css'
import '@sirius-ui/dashboard/style.css'
import '@sirius-ui/charts/style.css'
```

Compiled CSS includes theme tokens and component styles. Your application can use its own CSS or Tailwind to style slot content. The application owns resets, font loading, appearance, and its preferred icon set. See [icon configuration](docs/icons.md).

```vue
<script setup lang="ts">
import { SButton, SCard } from '@sirius-ui/vue'
</script>

<template>
  <SCard>
    <template #header><h2>Workspace</h2></template>
    <SButton>Continue</SButton>
  </SCard>
</template>
```

| Package | Purpose | Guide |
| --- | --- | --- |
| `@sirius-ui/theme` | CSS tokens and optional Tailwind 4 mappings | [Theme](packages/theme/readme.md) |
| `@sirius-ui/vue` | Vue primitives, forms, overlays, and data display | [Vue](packages/vue/readme.md) |
| `@sirius-ui/dashboard` | Dashboard shell, navigation, cards, lists, and timelines | [Dashboard](packages/dashboard/readme.md) |
| `@sirius-ui/charts` | SVG line, bar, donut charts, and sparklines | [Charts](packages/charts/readme.md) |

The theme is installed through the component packages' dependencies. Install `@sirius-ui/theme@alpha` directly if your application imports its CSS tokens or Tailwind entry.

## Agent documentation

Each library includes a documentation bundle at `node_modules/@sirius-ui/<package>/dist/docs/readme.md`. Follow that entry to the catalog and read the relevant contracts. The bundle contains the guides for all four packages, so agents can choose components before adding an optional package. Source and working-example links point to the corresponding Git release tag.

## Getting started

To develop SiriusUI itself, use the supported Node version from package.json and Yarn Classic 1.x.

```sh
yarn install --frozen-lockfile
npm run dev
npm run dev:dashboard
```

The primitive playground normally runs at http://127.0.0.1:5173 and the Acme dashboard at http://127.0.0.1:5180. Acme includes Overview, Cards, Tables, Calendar, Charts, and Settings.

```sh
npm run check
npm run check:packages
```

The first command checks library builds, consumer types, both demos, and component tests. The second installs actual package archives in a temporary consumer and checks types, production bundling, server rendering, and documentation links.

See [contributing](CONTRIBUTING.md), [implementation rules](AGENTS.md), and [release preparation](docs/releasing.md).

## License

[MIT](LICENSE).
