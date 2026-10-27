# @sirius-ui/vue

Reusable Vue 3 components and composables styled with the SiriusUI theme.

## Status

The build and type declaration pipeline are configured. The public entry is currently empty; there are no usable components yet. The first planned component is `SButton`.

The package is a private local workspace and has not been published. Installation instructions for external projects will be added when distribution is configured.

## Implementation contract

- Components use Vue 3 single-file components, TypeScript, and `<script setup lang="ts">`.
- Public component names use the `S` prefix. Exports belong in `src/index.ts`.
- Props, events, slots, and relevant states form the documented component API.
- Styles use semantic tokens from `@sirius-ui/theme`; applications control branding and appearance.
- Vue is a peer dependency and stays outside the library bundle.
- Routing, API calls, application stores, and preference persistence belong to consuming apps.

As components land, document their imports, props, events, slots, accessibility behavior, and examples here or in linked component guides. Include corresponding playground examples.

## Local development

From the repository root:

```sh
npm run dev
npm run check
```

The first command serves the playground with live source updates. The second checks all workspace types, builds the packages and playground, and runs the available integration tests.

See [the contributor guide](../../CONTRIBUTING.md), [architecture](../../docs/architecture.md), and [theme guide](../theme/readme.md).
