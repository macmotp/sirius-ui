# Architecture

SiriusUI provides a shared foundation for multiple applications while allowing each application to keep its own identity and business logic.

## Package boundaries

| Workspace | Owns | Depends on |
| --- | --- | --- |
| `@sirius-ui/theme` | CSS palettes, semantic tokens, appearance definitions, optional Tailwind mapping | No runtime framework |
| `@sirius-ui/vue` | Reusable components, composables, and typed public exports | Theme; Vue as a peer dependency |
| `@sirius-ui/playground` | Demonstrations, branding examples, appearance controls, local demo state | Theme and Vue workspaces |

The theme never imports Vue. Shared components do not own routing, authentication, API clients, or application state. Dashboard and ecommerce templates remain in consuming applications until real reuse justifies a shared abstraction.

## Styling decisions

- The runtime API is plain CSS custom properties prefixed with `--sirius-`. It works independently of Tailwind.
- Teal and mist are the default brand and neutral palettes. Components use semantic roles rather than specific palette shades.
- `@sirius-ui/theme` exposes plain CSS. `@sirius-ui/theme/tailwind.css` adds Tailwind CSS 4 mappings through `@theme inline`.
- Theme defaults use low-specificity selectors in the `theme` cascade layer so applications can override them.
- Light is the default. A `data-theme` attribute selects light or dark. Applications decide how to detect, store, and restore preferences.
- Semantic colors support explicitly themed subtrees. Tailwind `dark:` follows the document appearance; it is not the mechanism for nested semantic colors.
- The theme includes no reset or automatic native element styling. The playground chooses Tailwind Preflight for its own page.

See [the theme guide](../packages/theme/readme.md) for the supported tokens and customization examples.

## Builds and local development

The repository uses workspaces with a root Yarn Classic lockfile. Root npm scripts orchestrate workspace commands. Install once at the root.

The theme build copies its CSS entries into `dist`. Tailwind directives in the optional mapping are processed by the consuming application's Tailwind pipeline. The Vue library uses Vite library mode for ES modules and `vue-tsc` for declarations; Vue is excluded from its bundle.

The playground aliases workspace imports to source for live updates and a single Vue instance. This validates source integration; the separate theme integration tests validate built CSS exports. Before publishing, add checks against packed packages so consumer installation is tested as well.

Generated builds and dependencies are ignored. Public docs, `AGENTS.md`, source, and the root lockfile belong in Git.

## Current state and next steps

The theme and playground are implemented. The Vue entry is intentionally empty. Native controls in the playground demonstrate token usage and are not yet shared library components.

The project uses the [MIT License](../LICENSE). Both library packages carry a copy so package distributions retain the required notices.

The next component is `SButton`: use it to establish component exports, props and slots, states, accessibility behavior, and playground documentation. Expand into form controls based on actual application needs. Publishing, automated browser coverage, and release tooling remain future work.
