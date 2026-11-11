# Architecture

SiriusUI provides a shared foundation for multiple applications while allowing each application to keep its own identity and business logic.

## Package boundaries

| Workspace | Owns | Depends on |
| --- | --- | --- |
| `@sirius-ui/theme` | CSS palettes, semantic tokens, appearance definitions, optional Tailwind mapping | No runtime framework |
| `@sirius-ui/vue` | Reusable components, composables, and typed public exports | Theme and Lucide; Vue as a peer dependency |
| `@sirius-ui/dashboard` | Composed dashboard shells and mobile navigation frame | Vue primitives and theme; Vue as a peer dependency |
| `@sirius-ui/dashboard-demo` | Example application navigation, pages, branding and preferences | Dashboard shell and primitives |
| `@sirius-ui/playground` | Demonstrations, branding examples, appearance controls, local demo state | Theme and Vue workspaces |

The theme never imports Vue. Shared components do not own routing, authentication, API clients, or application state. Application-specific dashboard pages and ecommerce templates remain in consuming applications. Shared dashboard framing lives in the dashboard package; business data and routing remain app-owned.

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

The playground aliases workspace imports to source for live updates and a single Vue instance. This validates source integration; the separate theme integration tests validate built CSS exports. `npm run check:packages` builds and packs the four libraries, installs their archives in an isolated consumer, and checks public imports, declarations, CSS, SSR, and bundled documentation links.

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


### Composed dashboard shells

SDashboardLayout lives in packages/dashboard, which depends on primitives without being re-exported by them. It owns desktop framing, a sticky header, named navigation, a skip link and mobile SDrawer visibility. The existing drawer owns native modality, animation and Escape/backdrop handling; the layout adds content focus after navigation or a desktop breakpoint change. A single media-query listener is removed on unmount. It does not import a router, store, request client or purchased template.

The brand/navigation/footer slots provide an explicit mobile context and close callback. Apps own links, active/permission state and slot content. Navigation may render in both desktop and mobile contexts during a drawer lifecycle; explicit IDs must be unique and business state remains app-owned. The separate apps/dashboard demo displays one fictional Acme business with the Sirius logo and local fixtures through that API. It contains no real-project branding or business switcher. New shell variants should arise from consuming-project requirements rather than adding every possible layout option to the first component.

The root check builds packages in dependency order (theme, vue, dashboard) before consumer type checks, then builds both apps and runs package tests. This lets new workspaces resolve generated declaration exports on a clean checkout. Dashboard ESM keeps Vue and @sirius-ui/vue external, and exports compiled CSS without Preflight. The four libraries use aligned alpha versions and exact internal dependencies. The root and demos remain private. Each library builds before packing and includes the agent guides in dist/docs.


SDashboardNav owns grouped link presentation, unique group labels, disabled adapter unmounting, current-link semantics and badge rendering. It renders inside the shell's existing nav landmark, owns no route state, and emits the original click event without preventing navigation. The Acme demo retains its own navigation data and hash-routing policy. SDashboardPageHeader composes a single page h1, optional metadata, SBreadcrumbs and wrapping actions; consuming pages own spacing and action effects. Both live in packages/dashboard and are used by the separate Acme demo. Planned settings, filtered-table, chat, timeline and chart pages will use these contracts; they are not bundled as speculative library components.


The Acme account/header workflows are separate demo owners: DemoAccountMenu (identity popover and account actions), DemoSearch (dialog, query and local result catalog), DemoActions (example actions), and DemoNotifications (drawer and unread state). App.vue owns demo navigation, appearance models and toast feedback. DemoAppearance is controlled so Settings can unmount without resetting global appearance. Account/profile links and notification/search results navigate through app events; overlay visibility stays with its owning component. SPopover adds a custom header slot while retaining an internal accessible title, description association and close control. Demo integration tests compile actual client SFCs into a temporary directory and exercise them through the shared Vue renderer; they do not substitute for browser layout/focus checks.

## Icon ownership

The Vue package owns SIcon, typed semantic control names, dependency-free fallback paths and app-scoped configuration through createSiriusIcons/provideSiriusIcons. Internal icon components resolve their names through the nearest provider, including controls composed by the dashboard package. Partial maps inherit outer entries before using fallback paths. No mutable global registry, storage, dynamic package import, or icon-library dependency belongs in either shared package.

Apps choose/install icon libraries and own mappings, application icon names, selection and persistence. apps/shared holds the two demo adapters and reactive selector; only the demos install both Lucide and Heroicons. Heroicons render functions are adapted to forward full SVG attributes. Component-valued custom icons and existing slots retain their contracts. See icons.md for the public API and full internal map. Focused tests cover configuration isolation, reactive internal/application icon replacement, nested overrides, accessibility and dashboard selection surviving navigation.

## Representative Settings page

The Acme demo's first representative page is Settings. DemoSettings owns tab composition and DOM focus restoration; Profile, Workspace and Notifications panels own their respective UI, and DemoAppearance owns immediate appearance controls and preview. App.vue creates useDemoSettings so drafts, the saved snapshot and active tab outlive route-mounted panels. The profile, workspace and notification groups participate in one local save/discard transaction. Appearance remains immediate, with its state owned separately by App and the icon provider.

Validation covers the entire draft, selects the first invalid tab and uses SField's existing error associations. Successful saves normalize text, copy independent snapshots and update the account identity/workspace context. The sticky pending-changes bar submits SForm through a generated form ID; after saving/discarding, focus moves to a persistent status. All sample data/state stays in apps/dashboard, with no new library exports or backend behavior. Real integrations must replace the local save action with their request lifecycle and server validation. See packages/dashboard/readme.md for ownership and integration details.

Dashboard page context belongs in the shell header; the Acme sample pages supply only a compact h1 through SDashboardPageHeader. Optional metadata remains available in the shared component, while the demo avoids duplicating shell breadcrumbs or stacking marketing-style labels above titles. STabs line hover uses surface-muted so it remains distinct from the neutral-700 dark canvas, with rounded top corners on both selected and unselected enabled tabs.

## Core date range control

SDateRange lives in the Vue primitives and composes SField, SInput and SButton. Its controlled date-only model supports open bounds, optional required dates and inclusive min/max limits. It shares calendar and range validation with the app through getDateRangeError. Applications supply preset dates and own the decision to apply them to an API query. Acme supplies presets relative to its fictional dataset and applies changes through the existing Orders filter draft.

## Representative Orders page

The Acme Orders page keeps STable and SPagination controlled by API results. App.vue owns a mock OrdersApi instance; mockOrdersApi.ts stands in for the server and alone filters, sorts, aggregates, slices pages and mutates fixture records. useDemoOrders owns requests, abort/sequence protection, issued query and result/mutation error states. useOrderSelection independently owns selection of the current response. DemoOrders coordinates those capabilities with filters, table presentation, CSV exports, row popovers, a details drawer and a fulfillment confirmation dialog.

Laravel-style paginator metadata and URLs drive navigation; query changes request page one. Custom summary fields describe the whole matching result. Amounts remain integer SGD cents. Fulfillment operates through the adapter, validates a batch before mutation, and refreshes rather than editing table rows optimistically. The app's backend replacement must retain server-side filtering/paging and own authorization/validation. CSV exports include only available page/selected records; full-query exports require a backend endpoint. The primitive package gains no routing, data-fetching or business logic. See packages/dashboard/readme.md for contracts, lifecycle, states and integration guidance.

The Orders mobile check exposed absolutely positioned table content escaping the horizontal scroll boundary when its containing block lived outside the overflow region. STable's scroll region now establishes a relative containing block, retaining accessible hidden labels and positioned descendants within that boundary while top-layer SPopover panels can still escape clipping.

## Compact example shell and table controls

The Acme shell now owns one visible h1 in its sticky header, rather than repeating the page name above the main content. SDashboardLayout.mainLabelledby associates main with that generated heading ID. SDashboardPageHeader remains available for consumers that place titles in content. The example navigation is flat and grouped under Page examples; Tables uses #tables with #orders retained as an alias. Cards contains the people directory and Activity. The former #lists and #activity hashes open their corresponding cards. Calendar is a separate demo page with day, week and month views.

DemoOrders uses a compact toolbar, a transactional filter draft in SDrawer and an Actions dropdown. Requests still go through useDemoOrders; only a successful filter submission closes its drawer, and failed requests remain visible there. Draft values reset from the issued query when reopening. Result summaries and active-filter badges retain context without occupying card rows. Overview composes an API-paginated five-row DemoOrdersPreview inside SCard, sharing the app's adapter but owning an independent request scope. The mock backend supports five-row requests and emits compact link windows so pagination is also usable inside cards.

SPopover.block is a real sizing requirement from the account menu: it stretches the trigger wrapper while leaving popup styling/focus behavior unchanged. The account button fills that wrapper and pins its chevrons to the trailing edge.

SDashboardLayout uses shared contentGutters and contentFrame class constants for header and main. Their responsive side padding and centered maximum width must stay identical; otherwise desktop gutters or wide-screen centering can drift. Header context font sizing belongs to the consuming app: Acme uses text-xs throughout, emphasizing only the current page through font weight.

## Optional SVG charts package

packages/charts is a fourth, optional library alongside theme, vue and dashboard. It owns SLineChart, SBarChart and SDonutChart and depends only on the framework-independent theme plus external Vue. Core primitives and dashboard shells must not import it. Build libraries before app type checks so its declaration export exists on clean installs. It emits scoped plain CSS/tokens without Tailwind/Preflight; consumers import @sirius-ui/charts/style.css once. No chart engine or icon dependency is introduced.

SLineChart owns single/multiple-series SVG presentation and inspection. Pure chartData aligns series by categorical label and collects the shared numeric domain; no sorting or aggregation occurs. Pure lineLayout computes finite linear scales, gap-preserving segments, rounded ticks and width-dependent labels; useChartWidth owns observation/fallback listener lifetimes as the plot ref mounts/replaces. Component state contains only focus/inspection. Ordered categorical data, aggregation, periods, units, fetching and business summaries stay with the app. The floating inspection tooltip, hidden live status, one keyboard stop and native full-data disclosure complement the named SVG.

The separate Charts example and Overview card use app-local fixed sales fixtures and period controls. Request-state examples are explicit demo controls. SVG chart colors use existing semantic tokens, especially primary-content for the line, so theme changes need no JavaScript palette registry. The optional series prop replaces single data/seriesLabel, retaining the original API. Multiple series share a scale/tooltip/table and differ by themed strokes and line patterns. smooth enables a small monotone cubic path generator that preserves gaps and does not overshoot observations. xLabels=all preserves category labels through horizontal scrolling, while auto samples based on estimated label width. No chart-engine selection, continuous time scale, zooming, export or unrelated chart types are scaffolded. The package guide is the agent-facing API/behavior contract.


Each SLineChartSeries optionally specifies a CSS color and a typed solid/dashed/dotted pattern. chartData resolves defaults independently, and the SVG and legend share the result. The chart never owns palette selection UI. DemoChartComparison owns its editable series styles and uses an application CSS palette with inherited light/dark color-scheme; its controls do not change data values. The charts package guide lists every prop, data field, slot, default and exported type.


SBarChart extends the optional charts package with vertical/horizontal grouped comparisons. It shares categorical alignment, responsive measurement, token CSS and the finite numeric-domain helper with SLineChart. Its pure barLayout always includes zero, preserves missing slots within groups, draws signed rectangles from the zero baseline, and expands the SVG rather than dropping labels or bars. The measured plot viewport scrolls horizontally for wide vertical groups or vertically for many horizontal groups; keyboard inspection reveals the active category. The component owns only inspection/focus; application fixtures, series-count and color controls live in DemoBarCharts. Bar-specific fields and all shared props are documented in packages/charts/bar-chart.md. No chart engine, stacking or area chart is introduced.


Chart inspection values render through the internal ChartTooltip in a relative viewport beside the scrollable SVG, outside document flow. Chart legends remain static during hover/focus. ChartTooltip owns its measured positioning, bounds clamping, scroll/resize observations, Escape listener and cleanup; it has no public API or dependency on core overlays. Charts own active category/keyboard state and a hidden live status; the visual panel is hidden from assistive technology to avoid duplicate announcements. The panel preserves theme/custom series colors, wraps long content and scrolls internally when many series exceed the viewport. Data tables remain the complete accessible alternative.


SDonutChart completes the small SVG chart set for part-to-whole composition. Its independent pure donutLayout normalizes nonnegative finite amounts before computing proportions, draws closed annular paths (including complete single-slice rings), and preserves all input rows in the table when a nonempty chart is present. Zero/invalid entries do not create wedges; all-zero totals use the empty state. An overflowing raw total is shown as an em dash without discarding valid slice proportions or passing Infinity to formatters. The component reuses measured width, the floating ChartTooltip and hidden live status, owns only slice inspection/focus, and keeps its center total/legend fixed during hover. Applications own slice colors, financial units and data controls. DemoDonutCharts demonstrates these boundaries; packages/charts/donut-chart.md is its complete agent-facing contract. Area charts and complex chart types remain out of scope.


## Dashboard metric cards

SMetricCard composes SCard, SBadge and SSkeleton in the dashboard package. It presents app-formatted values and optional comparison context, with a decorative icon slot. Applications own calculations, comparison meaning and loading state. Acme uses it in the Overview summary and the Cards example page. Its chart slot accepts caller-supplied graphics, including SSparkline from the optional charts package. SUserCard composes SCard and SAvatar and lets the app supply statuses and actions. SUtilityCard adds a compact record summary with an identity header and labelled values. The demo owns the invoice data, status styles and actions. The Cards demo also assembles quota and task cards directly from core primitives.


## Dashboard lists

SPeopleList presents app-owned directory records with initials fallbacks, optional native profile and email links, roles and explicit presence. The profile link can cover the row while the email remains independently actionable. DemoPeopleCard uses the saved Acme account for the linked profile and fictional records for the remaining people.

STimeline owns the ordered list, connecting rail and timestamp rendering. Its marker and detail slots let applications distinguish statuses, comments, assignments and tags. DemoActivityCards owns the two card compositions and the local comment draft and entries.

DemoCalendar owns the selected date and view. It uses UTC date-only values for arithmetic, with Today resolved in Singapore. Day and Week share a scrollable schedule table that groups timed events by hour and shows all-day events separately. The Day picker browses months independently and updates the selected date when a day is chosen. The calendar renders app-owned events using native tables and buttons.
