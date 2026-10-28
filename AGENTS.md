# Working on SiriusUI

These instructions apply throughout this repository. Read `readme.md`, `CONTRIBUTING.md`, and the relevant package guide before changing its public API.

## Project boundaries

- `packages/theme` owns framework-independent CSS tokens and the optional Tailwind CSS 4 mapping.
- `packages/vue` owns reusable Vue 3 components and composables. It depends on the theme; the theme must not depend on Vue.
- `apps/playground` demonstrates the packages. Application branding, appearance persistence, and demo state belong here, rather than in the library.
- Keep routes, authentication, API calls, store-specific state, and other business logic in consuming applications.
- The packages are private scaffolds for an open-source project. Do not change publication flags or introduce release automation as an incidental change.

## Implementation conventions

- Use TypeScript, Vue single-file components with `<script setup lang="ts">`, and explicit props, events, and slots.
- Name public Vue components with the `S` prefix and PascalCase filenames, for example `SButton.vue`. Export public APIs from `packages/vue/src/index.ts`.
- Follow existing formatting: two spaces, single quotes in JavaScript/TypeScript, and no semicolons.
- Use semantic theme utilities such as `bg-surface`, `text-content`, `border-line`, and `bg-primary` in shared components. Avoid hard-coded brand palettes in components.
- Keep `--sirius-` custom properties as the runtime token API. Maintain the plain CSS entry separately from Tailwind directives and keep runtime aliases in `@theme inline`.
- Keep theme defaults in the low-specificity `theme` layer. The theme must not add a reset or style native elements automatically.
- Use InterVariable as the default sans font, with system fallbacks. Applications own font loading; the shared theme only defines the font stack.
- Select one accent through `data-sirius-color` (teal, emerald, cyan, indigo, pink, orange) and one neutral background through `data-sirius-background` (mist, slate, stone). Defaults are teal and mist. Do not reintroduce named theme presets.
- Success, warning, and danger use fixed green, yellow, and red palettes independently of those selections. Secondary and info roles are not provided.
- Primary and other filled roles use shade 400 in both modes. Pair role fills with their `on-*` foregrounds and soft colors with `*-content` foregrounds. Solid buttons use the white `on-solid` token as a deliberate design exception; document its contrast limitation with shade-400 fills rather than claiming AA contrast for those labels. SButton has no neutral color option.
- General corners default to 2xl; buttons, inputs, and selects use full rounding via `rounded-control`. Keep these defaults token-driven rather than styling native elements globally.
- Light is the theme default. Explicit appearance uses `data-theme="light"` or `data-theme="dark"`. Applications own system preference detection and persistence.
- Prefer semantic colors for nested appearance regions. The optional Tailwind `dark:` variant follows the document theme only.
- Keep Vue external to library bundles and preserve CSS side-effect metadata and TypeScript declaration exports. Keep the compiled `@sirius-ui/vue/style.css` export usable without Tailwind or Preflight in the consuming app.
- Introduce abstractions and dependencies when a real component needs them; do not scaffold speculative APIs or components.

## Accessibility and demos

- Use native HTML semantics first. Provide accessible names, appropriate keyboard behavior, visible focus, and correct disabled behavior.
- Verify relevant foreground/background pairs in both appearances. Use `line-strong` when a border is needed to identify a control.
- Include relevant variants and states in the playground when implementing a component. Clearly distinguish native theme demonstrations from shared Vue components.
- Check narrow layouts, long labels, keyboard navigation, and light/dark modes when changing visible UI.
- Keep shared component behavior independent of browser storage and application preferences.

## Dependencies and checks

- Install from the repository root with Yarn Classic 1.x. `yarn.lock` is the existing lockfile; keep it tracked. Do not add a second lockfile or switch package managers incidentally.
- Root scripts use npm workspace commands and can be run with `npm run <script>` after a Yarn install. Do not install dependencies independently inside packages.
- Run `npm run check` for implementation changes. It checks workspace types, builds the packages and playground, and runs theme integration and built-component behavior tests.
- Add focused tests for meaningful behavior or integration risks. Avoid tests that only duplicate implementation details. Documentation-only edits need link/path and diff checks, not a full rebuild.
- Use `npm run dev` for visual verification. Report any checks that could not run and why; do not claim browser verification from a successful build alone.
- Do not edit generated `dist/`, dependency directories, or lockfiles by hand.
- Preserve unrelated work. Keep changes scoped to the request.

## Documentation

- Update usage examples when public exports, tokens, component behavior, or commands change.
- Record architectural decisions in `docs/architecture.md`, theme usage in `packages/theme/readme.md`, and component usage in `packages/vue/readme.md`.
- Keep these shared instructions and contributor docs in Git. Do not put credentials, personal notes, machine-specific paths, or session transcripts in them.
- The project is MIT-licensed. Preserve the copyright and license notice, keep library package `LICENSE` copies identical to the root `LICENSE`, and retain `"license": "MIT"` metadata.
