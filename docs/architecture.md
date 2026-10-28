# Architecture

SiriusUI provides a shared foundation for multiple applications while allowing each application to keep its own identity and business logic.

## Package boundaries

| Workspace | Owns | Depends on |
| --- | --- | --- |
| `@sirius-ui/theme` | CSS palettes, semantic tokens, appearance definitions, optional Tailwind mapping | No runtime framework |
| `@sirius-ui/vue` | Reusable components, composables, and typed public exports | Theme and Lucide; Vue as a peer dependency |
| `@sirius-ui/playground` | Demonstrations, branding examples, appearance controls, local demo state | Theme and Vue workspaces |

The theme never imports Vue. Shared components do not own routing, authentication, API clients, or application state. Dashboard and ecommerce templates remain in consuming applications until real reuse justifies a shared abstraction.

## Styling decisions

- The runtime API is plain CSS custom properties prefixed with `--sirius-`. It works independently of Tailwind.
- The default sans font is InterVariable with system fallbacks. Applications load the font; the playground uses Inter's official hosted stylesheet. The theme does not initiate font downloads itself.
- Accent and neutral background palettes are selected independently through `data-sirius-color` and `data-sirius-background`. Accents are teal, emerald, cyan, indigo, pink, and orange; backgrounds are mist, slate, and stone. Defaults are teal and mist. There are no named theme presets.
- Primary uses the selected accent at shade 400 in both modes. Success/warning/danger retain fixed green/yellow/red palettes. Secondary and info roles are not provided.
- Palette selection and light/dark appearance are independent. Palette definitions belong in the theme package; the playground owns selection controls and preference persistence.
- Role fills use their dark `on-*` foregrounds; solid buttons instead use the shared white `on-solid` foreground by design. White text on shade-400 fills does not meet normal-text AA contrast, and is documented separately from the passing role-pair contrast tests. Soft surfaces use `*-content` foregrounds.
- The light canvas and navigation are white; dark canvas uses neutral 700. Card surfaces use selected neutral 200 at 10% in light mode and 600 at 80% in dark mode. Decorative lines/rings use neutral 400 at 15%; cards opt into a 1px inset ring. Native border-based controls can use `line-strong`; shared inputs use the separate control ring tokens.
- Bright shade-400 fills are not alert text colors.
- The general radius defaults to 2xl (1.5rem); the control radius defaults to full (9999px). Components opt in with `rounded` and `rounded-control`, without automatic element styling.
- `@sirius-ui/theme` exposes plain CSS. `@sirius-ui/theme/tailwind.css` adds Tailwind CSS 4 mappings through `@theme inline`.
- Theme defaults use low-specificity selectors in the `theme` cascade layer so applications can override them.
- Light is the default. A `data-theme` attribute selects light or dark. Applications decide how to detect, store, and restore preferences.
- Semantic colors support explicitly themed subtrees. Tailwind `dark:` follows the document appearance; it is not the mechanism for nested semantic colors.
- The theme includes no reset or automatic native element styling. The playground chooses Tailwind Preflight for its own page.

See [the theme guide](../packages/theme/readme.md) for the supported tokens and customization examples.

Input defaults use reusable `control` color tokens: white in light mode and neutral 600 at 80% with white text in dark mode, neutral 300 inset rings, neutral 400 placeholders, and accent 500/400 focus rings. Inputs have no border, use an extra-small token-driven shadow, and use fixed green-500/red-500 validation rings in both appearances, including on focus.

## Icons

Built-in Vue icons use individual imports from `@lucide/vue`, starting with the button loading spinner. The playground uses the same icon set. Button slots accept other SVG libraries; there is no public icon wrapper or global icon registry.

## Builds and local development

The repository uses workspaces with a root Yarn Classic lockfile. Root npm scripts orchestrate workspace commands. Install once at the root.

The theme build copies its CSS entries into `dist`. Tailwind directives in the optional mapping are processed by the consuming application's Tailwind pipeline. The Vue library uses Vite library mode for ES modules and `vue-tsc` for declarations; Vue is excluded from its bundle. The library exports compiled component utilities and theme tokens through `@sirius-ui/vue/style.css`, with no Preflight. Components use static utility maps so every variant can be compiled without runtime class construction.

The playground aliases workspace imports to source for live updates and a single Vue instance. This validates source integration; the separate theme integration tests validate built CSS exports. Before publishing, add checks against packed packages so consumer installation is tested as well.

Generated builds and dependencies are ignored. Public docs, `AGENTS.md`, source, and the root lockfile belong in Git.

## Current state and next steps

The theme, playground, `SButton`, and form primitives are implemented. The playground has a dedicated button showcase and uses SButton in its interaction form; fields remain native token examples. The button separates color, variant, and size, keeps native form semantics, and disables activation while loading. Applications own async operations and status announcements. SButton also renders native anchors for downloads or an application-supplied link component through `as`; SiriusUI does not depend on Inertia. Blocked links render inert spans, unmounting custom navigation components until enabled.

The project uses the [MIT License](../LICENSE). Both library packages carry a copy so package distributions retain the required notices.

Form primitives are `SForm` (native form and responsive column layout), `SField` (label, hint, error, and scoped control attributes), and `SInput`, `STextarea`, and `SSelect` (native controls with string v-model). The three controls share an internal styling helper for fill, rings, shadow, sizing, native attributes, and invalid-state priority. STextarea uses the explicit 2xl corner token; SSelect uses control rounding and an options array with a disabled placeholder. The select remains a native single-select and has no router or menu dependency. Fields do not inject hidden context: scoped attributes explicitly connect labels and descriptions to the control. Form submission, model resets, validation, focus management after errors, and Inertia integration remain application responsibilities. Expand based on actual application needs. Built-component tests use a custom Vue renderer for attributes, event forwarding, and state updates; they do not provide browser layout or keyboard verification. Publishing, automated browser coverage, and release tooling remain future work.
