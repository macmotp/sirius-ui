# SiriusUI

A shared design system and Vue component library for building consistent interfaces across projects.

SiriusUI brings together reusable styles, design tokens, and UI components so that applications such as Nannaò’s dashboard and, eventually, Tobbone can share a common foundation. Each application keeps its own branding, layouts, and business logic.

## Repository structure

One repository, with two packages:

```text
sirius-ui/
├── apps/
│   └── playground/ # Local Vue app for exploring the theme and components
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

Use Node.js 22.12 or newer in the Node 22 line, or Node.js 24 or newer, with npm 10 or newer and Yarn Classic 1.x. The `.nvmrc` file selects Node 22 for nvm users. Yarn manages installation using the existing `yarn.lock`; npm runs the workspace scripts.

Run these commands from the repository root:

```sh
yarn install --frozen-lockfile
npm run check
```

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the theme, the Vue library with declarations, and the playground. |
| `npm run dev` | Open the playground development server (normally `http://127.0.0.1:5173`). |
| `npm run preview` | Serve the built playground locally after running `npm run build`. |
| `npm run typecheck` | Check Vue components, TypeScript source, and Vite configurations across workspaces. |
| `npm test` | Build the theme and test its CSS exports and Tailwind integration. |
| `npm run check` | Run type checking, all workspace builds, and theme integration tests. |

Tailwind CSS 4 and its Vite plugin are configured for the Vue library and playground. The theme provides CSS tokens, light/dark modes, and an optional Tailwind mapping.

## Preview the playground

From the repository root:

```sh
npm run dev
```

Open the local URL Vite prints in the terminal, normally [http://127.0.0.1:5173](http://127.0.0.1:5173). Stop the server with Ctrl+C.

The playground includes semantic color swatches, status colors, typography, spacing, radii, shadows, and native interaction examples. Use the controls at the top to switch between teal and indigo branding and light, dark, or system appearance. Preferences are saved in your browser. The interaction form is a local demo; it does not send data anywhere.

The playground resolves the theme and Vue packages directly from their source files. Edits update live without rebuilding either library. Its indigo override is application-specific and does not change the shared default theme. Shared Vue components will appear here as they are implemented.

To inspect a production build:

```sh
npm run build
npm run preview
```

Open the URL printed by the preview server, normally [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Shared theme

The default theme uses teal for brand colors and mist for neutrals. It includes semantic colors, typography, spacing, radii, and shadows. Applications can override the palette and tokens.

- Import `@sirius-ui/theme` for plain CSS variables.
- Import `@sirius-ui/theme/tailwind.css` after Tailwind for semantic utilities such as `bg-surface`, `text-content`, and `bg-primary`.
- Set `data-theme="light"` or `data-theme="dark"` on the document element to choose an appearance. Light is the default; applications own persistence and system preference detection.

See [the theme guide](packages/theme/readme.md) for setup, available tokens, and branding examples.

Dependencies are managed from the repository root with Yarn Classic. Keep the root `yarn.lock` tracked and use `yarn install --frozen-lockfile` for reproducible installs. Do not add separate package lockfiles or a second root lockfile.

## Contributing and documentation

- [Contributor guide](CONTRIBUTING.md): setup, workflow, verification, and pull requests.
- [Architecture](docs/architecture.md): package boundaries, styling decisions, and current status.
- [Theme guide](packages/theme/readme.md): tokens, appearance, and application overrides.
- [Vue package guide](packages/vue/readme.md): component conventions and implementation status.
- [Agent guidelines](AGENTS.md): repository instructions for coding assistants.

These documents are shared project files and belong in Git. Generated artifacts, dependencies, local environment files, and test reports are ignored.

## License

SiriusUI is licensed under the [MIT License](LICENSE), copyright 2026 Marco Gava. Commercial use, modification, and redistribution are permitted. Copies or substantial portions of the software must retain the copyright and license notice. Visible credit in an application's interface is not required.

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

The workspace, shared theme, and local playground are implemented. Shared Vue components have not been implemented yet; the playground currently uses native elements to demonstrate the tokens.

Next steps:

1. Build the first component, `SButton`, to validate the theme and component API.
2. Consume the packages in the Nannaò dashboard and validate the APIs against real screens.
3. Add component documentation, targeted tests, and release tooling as the library matures.
