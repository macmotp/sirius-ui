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
| `npm test` | Build both libraries and run theme integration and component behavior tests. |
| `npm run check` | Run type checking, all workspace builds, and theme/component tests. |

Tailwind CSS 4 and its Vite plugin are configured for the Vue library and playground. The theme provides CSS tokens, light/dark modes, and an optional Tailwind mapping.

## Preview the playground

From the repository root:

```sh
npm run dev
```

Open the local URL Vite prints in the terminal, normally [http://127.0.0.1:5173](http://127.0.0.1:5173). Stop the server with Ctrl+C.

The playground includes semantic color swatches, status colors, typography, spacing, radii, shadows, native field examples, and dedicated button and form showcases. Use the controls at the top to choose an accent (teal, emerald, cyan, indigo, pink, or orange), a background (mist, slate, or stone), and light, dark, or system appearance. Your choices are saved in your browser. The interaction form is a local demo; it does not send data anywhere.

All playground select controls use the shared `SSelect`, including theme preferences and showcase configurators.

The playground resolves the theme and Vue packages directly from their source files. Edits update live without rebuilding either library. Palette definitions belong to the shared theme package; preference controls, persistence, and demo state belong to the playground. The Buttons section includes a live configurator, all color/variant combinations, sizes, icon slots, loading and disabled states, and responsive examples, including native downloads and custom navigation links.

The default logo is [sirius_ui.svg](sirius_ui.svg). The playground displays it as a CSS mask with `bg-primary`, so its color follows the accent selection without modifying the original SVG. The adjacent wordmark provides the accessible link name; the logo itself is decorative.

To inspect a production build:

```sh
npm run build
npm run preview
```

Open the URL printed by the preview server, normally [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Shared theme

Choose one accent color and one neutral background independently. Accents are teal, emerald, cyan, indigo, pink, and orange; backgrounds are mist, slate, and stone. Primary uses the selected accent at shade 400. Success (green), warning (yellow), and danger (red) remain fixed. The defaults are teal and mist. InterVariable is the default sans font. Light page and navigation backgrounds are white; cards use translucent neutral fills and subtle inset rings. General corners default to 2xl; buttons and inputs use full rounding.

- Import `@sirius-ui/theme` for plain CSS variables.
- Import `@sirius-ui/theme/tailwind.css` after Tailwind for semantic utilities such as `bg-surface`, `text-content`, and `bg-primary`.
- Set `data-sirius-color="teal"` to choose an accent and `data-sirius-background="mist"` to choose a neutral background.
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

The workspace, shared theme, playground, and Vue components (`SButton`, `SForm`, `SField`, `SInput`, `STextarea`, `SSelect`) are implemented. Buttons in the interaction form use the shared component; form fields remain native theme examples. See [the Vue package guide](packages/vue/readme.md) for imports, styling setup, and component APIs.

Next steps:

1. Extend forms with checkbox, radio, and switch controls based on application needs.
2. Consume the packages in the Nannaò dashboard and validate the APIs against real screens.
3. Add component documentation, targeted tests, and release tooling as the library matures.
