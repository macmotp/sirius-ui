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

Form primitives are `SForm` (native form and responsive column layout), `SField` (label, hint, error, and scoped control attributes), and `SInput`, `STextarea`, and `SSelect` (native controls with string v-model). SInput exposes native date/time, numeric, color, and range types while keeping raw string values. Its input/change and composition handlers avoid implicit numeric coercion, preserve decimal entry, and defer IME updates until commit. Pickers and constraints remain browser-owned; currency context and display formatting belong in applications. The three controls share an internal styling helper for fill, rings, shadow, sizing, native attributes, and invalid-state priority. STextarea uses the explicit 2xl corner token; SSelect uses control rounding and an options array with a disabled placeholder. The select remains a native single-select and has no router or menu dependency. Fields do not inject hidden context: scoped attributes explicitly connect labels and descriptions to the control. Form submission, model resets, validation, focus management after errors, and Inertia integration remain application responsibilities. Native choice controls are SCheckbox (boolean and separate indeterminate state), SRadio (named string selection), and SSwitch (boolean checkbox with switch semantics). Their internal ChoiceControl renderer shares labels, descriptions, validation rings, and styling, while each public component owns its model semantics. Native keyboard behavior and form serialization remain with the browser; application-owned selection logic, reset handlers, and errors stay in the playground or consuming app. Expand based on actual application needs. Built-component tests use a custom Vue renderer for attributes, event forwarding, and state updates; they do not provide browser layout or keyboard verification. Publishing, automated browser coverage, and release tooling remain future work.


`SGrid` owns responsive equal-column layout (1/2/3/4/6), independent of form semantics. `SCard` owns surface, padding, slots, and explicit bento corner selection using the theme's 4xl radius token. Its overlay ring follows inherited radii without clipping focus outlines. Neither component infers content or grid position. `SBadge` is a non-interactive label with decorative icon slots and existing semantic color roles; applications own actions and status announcements.


`SAlert` composes inline feedback, decorative Lucide icons, and application-owned action slots using existing theme roles. Visibility uses `v-model:open` (or internal state when unbound); dismissal emits the original event. Announcement urgency is explicit via `role` rather than inferred from color. Applications own message timing, recovery actions, localization, and focus restoration after dismissal.


`SDialog` uses native `<dialog>.showModal()` rather than recreating focus containment or applying background inertness itself. It stays in place in the DOM to inherit theme values while the native top layer handles stacking. The `open` model drives native modal state, Escape is prevented until the model permits closure, and backdrop dismissal requires an interaction that begins and ends outside the panel. Slot content remains mounted through the exit animation, then unmounts; the hidden dialog shell supports SSR. A guarded animation-end handler closes the native modal, with a fallback timer if consumer styles cancel the animation. Reopening cancels pending closure. Applications own async workflows and alternative focus restoration if an opener disappears.


`STagsInput` edits a string array and serializes committed values with repeated hidden inputs. `SCombobox` separates its stored string selection from a transient search query and owns an inline ARIA listbox with custom option slots. Both reuse control styles, forward field associations to native editors, and validate committed values through the native constraint API. Applications own reset and data loading. Range inputs retain native interaction with custom track/thumb styling, runtime progress, and focus on the thumb.


`SDropdown` is a menu for actions and navigation, separate from selection controls. It composes SButton with native buttons/anchors, disabled inert entries, roving focus, and typeahead. Popup positioning stays in the DOM to preserve theme inheritance and repositions for viewport edges; ancestor clipping still applies. Application handlers own the selected action and may cancel default selection behavior through the original event.


`STabs` pairs native tab buttons with hidden, labelled panels using unique Vue IDs. It separates roving keyboard focus from selection for manual activation, supports logical horizontal navigation in RTL, and falls back to the first enabled item without mutating a parent's model during render. Panel content unmounts by default; keepAlive keeps every panel mounted. Applications own draft persistence, async work, and URL synchronization.


`STooltip` binds descriptions and focus handling to an application-provided trigger through a scoped slot. Hover/focus ownership keeps the hint persistent, Escape suppresses it for the current interaction, and manual native popovers provide top-layer rendering where supported. It remains in its themed subtree and falls back to fixed positioning without a portal. `SAvatar` uses native image events for loading/error fallback and a single accessible image name around decorative image/initials/icon content. Both remain independent of application data and navigation.


`SSkeleton` is purely decorative and uses a neutral theme fill with motion-safe animation; applications own loading-region semantics. `SDivider` uses native horizontal separators where possible and associates custom labels with semantic separators through generated IDs. `SEmptyState` owns presentation, heading hierarchy, and optional action slots without inferring loading, live announcements, or application state.

SDrawer uses a native modal dialog with physical left/right slide animations and reuses dialog semantic color tokens. Application navigation and panel state remain consumer-owned.

SAccordion uses heading buttons and hidden controlled panels. It owns disclosure state and keyboard navigation; content and application behavior remain consumer-owned. Single and multiple modes share a string-array model.

### Vue implementation maintenance

SDialog and SDrawer share an internal `useModalDialog` composable that owns each instance's native modal lifecycle, animated exit, dismissal policy and cleanup. The components retain their layout, accessible naming, slots and public events. The composable is not a public export. Shared component DOM handles use Vue 3.5 `useTemplateRef`; primitive local state uses `shallowRef`. Attribute and slot dependent helpers remain render-time functions where those inputs are not reactive, avoiding stale computed caches.

SBreadcrumbs owns navigation/list semantics and current-page rendering. Consumers supply the trail and optional link adapter; route lookup and navigation policy stay in the application. It has no internal state or router dependency.

### Server-owned tabular data

STable renders the supplied current-page rows in their given order. Typed column accessors and slots own presentation; sort is a controlled request event, never a client-side reorder. Required stable row keys preserve row identity when responses change. Selection and domain actions remain app-owned cell-slot content.

SPagination accepts Laravel paginator metadata or API Resource links/meta. A private pure adapter normalizes those shapes and decodes label entities as escaped text. Only supplied server URLs are navigable; numeric metadata never generates links. Link mode uses native anchors or a consumer-supplied adapter; event mode requests an API URL without fetching or changing displayed page state. Parent components own authentication, requests, cancellation, errors and announcements. Neither component depends on a router, store or request library. The playground's separate demo service simulates a backend; no endpoint is bundled with the components.

### Scoped notifications

useToasts owns an instance-local readonly message collection and immutable add/remove operations. SToast owns the notification UI, focus context, per-message announcement and browser pause events; its internal useToastTimer capability owns countdown accounting and cleanup. SToaster owns only stack positioning and composition, emitting dismissal requests to the collection owner. No global store, teleport or application action handler is introduced. Live text is separate from interactive actions, and each toast instance generates its own DOM IDs independently of collection IDs.

SProgress derives its accessible range and fill width from application-supplied values. It owns presentation only; requests, job lifetime, busy regions, announcements and completion policy remain application-owned. Unknown progress has no aria-valuenow and uses reduced-motion-aware CSS animation.


SPopover owns a nonmodal interactive panel, slotted trigger ARIA contract, viewport positioning, focus entry/restoration and outside/Escape dismissal. It uses manual native popovers for top-layer stacking without moving the themed subtree, with a fixed-position fallback. Tab stays in normal document order. The app owns form drafts and action effects; tooltip examples compose a separate popover demo.

SFileUpload owns native file selection/drop/removal and accessible selection feedback. Its pure internal fileSelection helper applies selection limits, accept matching and deduplication. The File[] model is the source of truth; native FileList synchronization and constraint validation follow it. The app owns reset, HTTP requests, upload progress, server media, deletion, conversion and backend validation. No upload provider or temporary-media protocol is assumed. Stepper and Sidebar are intentionally not added: app-specific flows and SDrawer cover the current needs.


### Playground organization

The playground's `showcaseGroups.ts` is the single ordered catalog for group navigation and page composition. App.vue owns appearance preferences and renders the eight named clusters: Foundations, Actions, Forms, Layout, Navigation, Overlays, Data display, and Feedback. Each showcase continues to own its example state. Foundations, badges, dividers, skeletons, and empty states have separate showcase owners so unrelated examples can be grouped without coupling their state. File uploads belong to Forms; tables and server pagination stay together in Data display; tooltips and popovers stay together in Overlays. Group headings use h2, showcase headings h3, and examples follow below. Legacy numeric section labels are removed; individual component anchors are retained, with #forms now naming the cluster and #form-controls naming its first example.
