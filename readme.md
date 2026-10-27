# SiriusUI

A shared design system and Vue component library for building consistent interfaces across projects.

SiriusUI brings together reusable styles, design tokens, and UI components so that applications such as Nannaò’s dashboard and, eventually, Tobbone can share a common foundation. Each application keeps its own branding, layouts, and business logic.

## Repository structure

One repository, with two packages:

```text
sirius-ui/
├── packages/
│   ├── theme/     # Design tokens, CSS variables, and shared Tailwind theme
│   └── vue/       # Reusable Vue 3 components and composables
├── package.json  # npm workspaces and shared development commands
├── tsconfig.json # Shared TypeScript configuration
└── readme.md
```

| Package | Purpose |
| --- | --- |
| `@sirius-ui/theme` | Shared colors, typography, spacing, radii, shadows, and light/dark theme definitions. |
| `@sirius-ui/vue` | Vue 3 components built with Tailwind CSS and the shared theme, with explicit props, events, and slots. |

Both packages are local npm workspaces and are private until publishing is deliberately configured. Builds produce ES modules and TypeScript declarations for the Vue package, and a CSS entry for the theme package. Vue is a peer dependency and is excluded from the library bundle.

## Getting started

Use Node.js 22.12 or newer in the Node 22 line, or Node.js 24 or newer, with npm 10 or newer. The `.nvmrc` file selects Node 22 for nvm users.

Run these commands from the repository root:

```sh
npm install
npm run check
```

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the theme, then the Vue library and its TypeScript declarations. |
| `npm run typecheck` | Check Vue components, TypeScript source, and the Vite configuration. |
| `npm test` | Build the theme and test its CSS exports and Tailwind integration. |
| `npm run check` | Run type checking, both package builds, and theme integration tests. |

Tailwind CSS 4 and its Vite plugin are configured for the Vue library. The theme provides CSS tokens, light/dark modes, and an optional Tailwind mapping. There is no preview app or `dev` command yet.

## Shared theme

The default theme uses teal for brand colors and mist for neutrals. It includes semantic colors, typography, spacing, radii, and shadows. Applications can override the palette and tokens.

- Import `@sirius-ui/theme` for plain CSS variables.
- Import `@sirius-ui/theme/tailwind.css` after Tailwind for semantic utilities such as `bg-surface`, `text-content`, and `bg-primary`.
- Set `data-theme="light"` or `data-theme="dark"` on the document element to choose an appearance. Light is the default; applications own persistence and system preference detection.

See [the theme guide](packages/theme/readme.md) for setup, available tokens, and branding examples.

Dependencies are managed from the repository root. Once generated, commit the root `package-lock.json` and use `npm ci` for reproducible installs. Do not create separate lockfiles inside the packages.

## Design principles

- **Build from real use cases.** Start with components needed by the first dashboard and extend them as other projects adopt the library.
- **Keep components reusable.** Application routes, API requests, authentication, and domain logic belong in consuming applications.
- **Make styling explicit.** Shared components provide their own styling without automatically restyling every native HTML element.
- **Support branding through tokens.** Applications can customize the theme while keeping a consistent component API.
- **Include accessibility from the start.** Components should provide semantic markup, keyboard interaction, visible focus states, and appropriate labels.
- **Support light and dark modes.** Theme values should cover both appearances.

## Initial scope

The first components will focus on common dashboard needs:

- Buttons, links, badges, and alerts.
- Inputs, selects, checkboxes, and form field wrappers.
- Cards, dialogs, dropdowns, and tabs.
- Tables, pagination, and empty states.

Dashboard layouts and ecommerce templates can compose these primitives. Project-specific page templates will remain in their respective applications initially.

## Development status

The workspace and shared theme are implemented. Components and the playground have not been implemented yet.

Next steps:

1. Add a local playground for previewing components.
2. Build the first component, `SButton`, to validate the theme and component API.
3. Consume the packages in the Nannaò dashboard and validate the APIs against real screens.
4. Add component documentation, targeted tests, and release tooling as the library matures.
