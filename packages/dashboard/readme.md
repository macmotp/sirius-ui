# @sirius-ui/dashboard

Release preparation targets `0.1.0-alpha.0`. After publication, install with `yarn add @sirius-ui/dashboard@alpha`. Vue components require Vue 3.5 or newer in the Vue 3 line.

For agents using an installed package, start at `node_modules/@sirius-ui/dashboard/dist/docs/readme.md`. It contains the component catalog, usage guides, and dashboard patterns for this version.

Agent usage guide for Sirius dashboard composition: `SDashboardLayout`, `SDashboardNav`, `SDashboardPageHeader`, `SMetricCard`, and `SUserCard`. `SDashboardLayout` composes `@sirius-ui/vue` primitives and the shared theme. Use it for a desktop navigation rail, sticky header and page content, with a native modal SDrawer navigation panel below 64rem. The original shell was built from functional requirements without importing a purchased template.

## Start here

1. Import SDashboardLayout from this package, and import both compiled stylesheets once in the application entry.
2. Supply `brand`, `navigation`, and default page slots. Use header slots for project-specific controls.
3. Keep routes, permissions, menu data, preferences and requests in the application.
4. Use the navigation slot's `close()` after activation, or supply `navigationKey` from the current route.
5. Mount one shell per page. It provides the main landmark; page content should provide its h1 and avoid a nested main landmark.

```ts
import '@sirius-ui/vue/style.css'
import '@sirius-ui/dashboard/style.css'
```

Compiled styles include semantic tokens and utilities without Preflight. The consuming app does not need Tailwind to use the shell. Applications own resets, font loading and appearance selection (`data-theme`, `data-sirius-color`, `data-sirius-background`). Navigation/page slots own their styling; utility classes in your custom slot content need the application's Tailwind build or your own CSS.

```vue
<script setup lang="ts">
import { SDashboardLayout } from '@sirius-ui/dashboard'

const links = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Orders', href: '/orders' },
]
</script>

<template>
  <SDashboardLayout navigation-label="Store navigation">
    <template #brand="{ close }">
      <a href="/dashboard" @click="close">My store</a>
    </template>
    <template #navigation="{ close }">
      <ul>
        <li v-for="item in links" :key="item.href">
          <a :href="item.href" @click="close">{{ item.label }}</a>
        </li>
      </ul>
    </template>
    <template #header>Store workspace</template>
    <template #headerActions><!-- Account, search, or appearance controls --></template>
    <h1>Orders</h1>
    <!-- Your page, RouterView, or Inertia page content -->
  </SDashboardLayout>
</template>
```

For Vue Router, render RouterLink in your navigation and RouterView in the default slot; pass `:navigation-key="route.fullPath"` to close mobile navigation after successful route changes. For Inertia, render its Link in the navigation and the page's content in the default slot; pass the current page URL as navigationKey. Neither integration requires an adapter inside the package. If you call close() immediately, it closes on activation; if you want to keep the drawer open until navigation succeeds, use navigationKey instead. The library does not intercept anchor clicks or infer which application actions should close it.

## Contract

| API | Default | Meaning |
| --- | --- | --- |
| `mainLabelledby` | Unset | ID of an h1 supplied by the app, including in the header slot; labels the main landmark |
| `navigationLabel` | `Main navigation` | Names the desktop/mobile nav and the mobile dialog |
| `openNavigationLabel` | `Open navigation` | Accessible menu-trigger label |
| `closeNavigationLabel` | `Close navigation` | Accessible drawer-close label |
| `skipLinkLabel` | `Skip to content` | Visible-on-focus skip link |
| `navigationKey` | Unset | Route identifier; a change closes open mobile navigation |
| `mainLabelledby` | Unset | ID of the page heading that names the main landmark |
| `#brand` | Required | Project branding; `{ mobile, close }` |
| `#navigation` | Required | Project links and groups; `{ mobile, close }` |
| `#sidebarFooter` | Optional | Account/workspace information; `{ mobile, close }` |
| `#header` | Optional | Header context such as breadcrumbs |
| `#headerActions` | Optional | Search, appearance or account controls |
| Default slot | Required | Application page content |

There is no model or global store. The shell owns only mobile menu visibility. `close()` is a no-op when mobile navigation is closed. Slots can contain native links, Vue Router links or Inertia links. Applications own active states (`aria-current="page"`), permission filtering and user actions. Fallthrough attributes, including class/style, apply to the root.

Brand, navigation and sidebarFooter slots render in a desktop region and, while open/animating, the mobile drawer. The desktop region is hidden from layout and accessibility on mobile. Use the scoped `mobile` value to distinguish explicit HTML IDs, or let child components generate unique IDs with useId. Do not keep independent business state inside each navigation copy; keep shared state in the application.

## Focus, breakpoints and dimensions

- Below 64rem, the labelled menu button opens SDrawer on the left. It inherits the dialog's overlay, animation, focus containment, Escape and backdrop dismissal.
- Escape and ordinary close-button dismissal retain the drawer's native opener focus restoration.
- Slot close(), route-key changes and crossing into desktop close the drawer, then focus the main content after its exit animation. This avoids restoring focus to a mobile trigger hidden at desktop widths.
- At desktop widths, the sidebar is sticky and its navigation region scrolls independently when links are long. Page content uses document scrolling; the header stays sticky.
- The skip-link target is unique per instance. The main region is programmatically focusable.
- Default sidebar width is 17rem. Override `--sirius-dashboard-sidebar-width` on the layout root. Content has a maximum width of 80rem.
- The 64rem breakpoint is part of the current layout contract. Keep Tailwind's lg breakpoint unchanged when building this source; an alternative breakpoint requires updating both CSS and the media query.
- The first version does not include desktop collapse, alternate shell variants, routing, authorization, persistence or dashboard widgets. Navigation groups can be supplied through SDashboardNav.

## Demo and validation

```sh
npm run dev:dashboard
npm run check
```

The demo is a separate app under `apps/dashboard`, normally http://127.0.0.1:5180. It displays one fictional business, Acme, using the Sirius logo, with local hash navigation and a Settings page covering profile, workspace, appearance and notification preferences. Appearance models live in the app and survive page navigation. This demonstrates composition; none of its sample pages, names, data or preferences belong to the shared package. The primitive playground remains separate.

Package builds emit ESM, declarations and compiled CSS. Vue and Sirius primitives stay external. The root check builds libraries before consumer type checks, then builds both apps and runs package tests. Browser checks cover desktop/mobile layouts and native drawer focus behavior; renderer tests do not replace browser checks.


## SDashboardNav

Use this inside SDashboardLayout's navigation slot. It renders grouped lists of ordinary links; the layout already supplies the named nav landmark. When used standalone, wrap it in a labelled `<nav>`. It does not implement an ARIA menu or custom arrow-key navigation: native links retain Tab/Enter, context menus, and modified-click behavior.

```vue
<script setup lang="ts">
import { SDashboardNav } from '@sirius-ui/dashboard'
import type { SDashboardNavGroup } from '@sirius-ui/dashboard'

const groups: SDashboardNavGroup[] = [
  { id: 'workspace', label: 'Workspace', items: [
    { id: 'overview', label: 'Overview', href: '/dashboard' },
    { id: 'orders', label: 'Orders', href: '/orders', badge: 3, badgeLabel: '3 pending orders' },
  ] },
]
</script>

<template>
  <SDashboardNav :groups="groups" current="orders" />
</template>
```

| Contract | Behavior |
| --- | --- |
| `groups` | Required readonly array of `{ id, label?, items }`; empty groups are omitted |
| Item | `{ id, label, href, icon?, badge?, badgeLabel?, disabled?, target?, rel?, linkProps? }` |
| `current` | App-supplied item ID; enabled matching link gets aria-current=page |
| `linkAs` | Native `a` by default; accepts a Vue link component or adapter |
| `select(item, event)` | Enabled-link click notification with the original MouseEvent; no default navigation cancellation |
| `#badge="{ item, active }"` | Optional replacement for each trailing badge |

Group IDs must be unique within the component; item IDs must be unique across its groups. Current selection does not update internally, and URLs are not matched or guessed. Filter links for permissions before passing them in; this component does not enforce authorization. Labels are plain escaped text. Icons are decorative. Use badgeLabel for context, such as `3 unread updates`; zero badges are retained. Keep custom badge slots noninteractive, since they render inside the link.

Disabled entries render inert spans with link/disabled semantics. They receive no href, target, rel or linkProps, do not mount custom link components, and never emit select. An item that is both current and disabled is shown as disabled without aria-current.

For Inertia, supply its Link as linkAs. For Vue Router, supply RouterLink and put its `to` value in each item's linkProps, or use an application adapter that maps href to to. Custom link components must forward presentation/ARIA attributes and expose click events on the actual anchor. Reserved link attributes (href, target, rel and current state) are supplied by the item contract; use linkProps for additional adapter props and attributes.

The app owns activation policy. Prefer SDashboardLayout's navigationKey to close the mobile drawer after a successful router transition. If closing on select instead, inspect the original event: do not close/intercept modified clicks or target=_blank navigation. The Acme demo uses a small local hash-navigation handler that preserves those browser behaviors. Custom adapters may preventDefault themselves, so route-key synchronization is preferable to assuming every prevented event means navigation was cancelled.

Group labels get unique IDs per component instance, including simultaneous desktop/mobile copies. This component owns no global listeners, network requests or preference storage. Class/style and other fallthrough attributes apply to the outer div.

## SDashboardPageHeader

Use once at the beginning of a page's main content. This renders the page h1; do not add a second h1 for the same page. External spacing is application-owned, for example class="mb-8".

```vue
<SDashboardPageHeader
  title="Orders"
  description="Review customer orders and prepare dispatches."
  :breadcrumbs="[
    { value: 'home', label: 'Acme', href: '/dashboard' },
    { value: 'orders', label: 'Orders' },
  ]"
>
  <template #actions><SButton>Create order</SButton></template>
</SDashboardPageHeader>
```

| Contract | Behavior |
| --- | --- |
| `title` | Required nonempty page title; default text inside the h1 |
| `description` | Optional supporting text |
| `eyebrow` | Optional short label above the title |
| `breadcrumbs` | Optional readonly SBreadcrumbsItem array; same links, icons and linkProps as SBreadcrumbs |
| `breadcrumbLabel` | Accessible breadcrumb nav label, defaults to Breadcrumb |
| `breadcrumbLinkAs` | Native a or consuming-app link adapter |
| `#title` | Inline content inside the existing h1; supply meaningful title text |
| `#description` | Custom supporting content, including links |
| `#breadcrumbs` | Replace the default SBreadcrumbs rendering |
| `#actions` | Application controls or status badges in a wrapping action area |

Unused description, action and breadcrumb wrappers are omitted. Long titles and actions wrap at narrow widths. Actions use ordinary controls; this is not an ARIA toolbar. All routing, loading, permissions and action handlers remain application-owned. Class/style and other fallthrough attributes apply to the outer header. Do not put an additional heading or interactive control inside the title slot.

## SMetricCard

Use a metric card for one summary value and its context. It composes the core SCard, SBadge and SSkeleton. Place several cards in SGrid for responsive layout.

```vue
<script setup lang="ts">
import { SMetricCard } from '@sirius-ui/dashboard'
</script>

<template>
  <SMetricCard
    label="Net sales"
    value="S$12,480.50"
    detail="After refunds and discounts"
    :comparison="{ value: '+8.4%', label: 'vs. previous week', color: 'success' }"
  />
</template>
```

| API | Default | Behavior |
| --- | --- | --- |
| `label` | Required | Metric name paired with its value in a definition list |
| `value` | Unset | String or number to display. An omitted value displays an em dash and zero displays as zero. |
| `detail` | Unset | Optional explanation below the metric |
| `color` | Unset | Optional soft card tint and matching chart accent. Use `primary`, `success`, `warning`, or `danger`. |
| `comparison` | Unset | Optional `{ value: string, label?: string, color?: SBadgeColor }`. The badge defaults to primary. Choose color according to business meaning, and include direction and period in visible text where relevant. |
| `loading` | False | Marks the card busy and replaces the value, comparison and optional chart with skeletons. The label and detail stay visible. |
| `loadingLabel` | Loading metric | Accessible loading text |
| `#icon` | Unset | Optional decorative icon, hidden from assistive technology |
| `#chart` | Unset | Optional trend graphic. For example, use SSparkline from the charts package. |

The app owns formatting, comparisons, loading and data. Native attributes fall through to the card root. The card has no model or component events. Public types are `SMetricCardProps` and `SMetricCardComparison`.

Overview uses the component for its summary row. The Cards page starts with neutral surfaces, rounded sparklines and hidden subtitles. Its sparklines show daily values on hover and keyboard focus. Its switches preview tinted backgrounds, straight lines, subtitles and loading. The demo also composes information cards using SCard, SProgress and SButton for storage usage and orders requiring attention.

## SUserCard

Use a user card in a directory, assignment picker or team summary. It uses SCard and SAvatar. Omit the image URL to show initials as a placeholder.

```vue
<SUserCard name="Alex Morgan" role="Operations manager" layout="stacked">
  <template #badge><SBadge color="success">Active</SBadge></template>
  <template #actions><SButton href="/team/alex">View profile</SButton></template>
</SUserCard>
```

| API | Default | Behavior |
| --- | --- | --- |
| `name` | Required | Visible name and source of avatar initials |
| `role`, `detail` | Unset | Optional secondary text |
| `avatarSrc` | Unset | Optional image URL. Initials cover missing, loading or failed images. |
| `layout` | `inline` | Use `stacked` for a larger centered avatar and text. |
| `#badge` | Unset | Optional status or role badge |
| `#actions` | Unset | App-owned buttons and links. Stacked cards give each direct child an equal share of a divided footer. |

The public type is `SUserCardProps`. The name labels the profile visually and the avatar is decorative. Native attributes apply to the card root. The Cards demo pairs the stacked layout with an access badge and labelled Email and Call links.

## SUtilityCard

Use this card for a short record summary, such as a client and their latest invoice. It provides a tinted identity header and labelled rows. Supply the icon or avatar, actions and status rendering from the application.

```vue
<SUtilityCard title="Northstar Studio" :rows="[{ id: 'amount', label: 'Amount', value: 'S$2,480.00' }]">
  <template #identity><SAvatar name="Northstar Studio" shape="rounded" alt="" /></template>
  <template #value="{ row }">{{ row.value }} <SBadge color="success">Paid</SBadge></template>
</SUtilityCard>
```

| API | Behavior |
| --- | --- |
| `title` | Required visible record name |
| `rows` | Required array of `{ id, label, value }` records. Use a unique string ID and a string or number value. |
| `#identity` | Optional avatar or icon in the header |
| `#actions` | Optional app-owned controls at the trailing edge of the header |
| `#value` | Optional scoped slot receiving `{ row }`. The default displays the row value. |

Public types are `SUtilityCardProps` and `SUtilityCardRow`. The Cards demo shows three fictional invoice states and detail actions that open a dialog.

## SPeopleList

Use this list for a team directory or a short list of contacts. It composes Sirius avatars with optional profile and email links. Role and availability move below the identity on narrow screens.

```vue
<SPeopleList
  label="Team members"
  :people="[
    { id: 'alex', name: 'Alex Morgan', email: 'alex@acme.example', role: 'Operations manager', href: '/team/alex', presence: { kind: 'online' } },
    { id: 'jamie', name: 'Jamie Lim', role: 'Customer support', presence: { kind: 'last-seen', label: '6 Nov, 3:20 pm', datetime: '2026-11-06T15:20:00+08:00' } },
  ]"
/>
```

| API | Default | Behavior |
| --- | --- | --- |
| `people` | Required | Array of records with unique `id` and visible `name`. Optional fields are `email`, `role`, `avatarSrc`, `href` and `presence`. |
| `label` | People | Accessible list name |
| `onlineLabel` | Online | Text for `{ kind: 'online' }` |
| `lastSeenLabel` | Last seen | Prefix for `{ kind: 'last-seen', label, datetime }`. Pass display text and a machine-readable datetime. |
| `emptyText` | No people to display. | Empty list message |

A row with an href has a native profile link and a larger click target. Its mail link is independently focusable and clickable. Avatars fall back to initials. Applications own profile URLs, presence updates and date formatting. Public types are `SPeopleListProps` and `SPeopleListItem`.

## STimeline

Use STimeline for ordered activity such as fulfillment milestones or team feedback. Pass records in display order. Each item has a stable string `id`, visible `title`, optional `detail` and optional `time: { label, datetime }`.

```vue
<STimeline
  label="Order status history"
  :items="[{ id: 'paid', title: 'Payment confirmed', time: { label: '6:02 pm', datetime: '2026-11-06T18:02:00+08:00' } }]"
/>
```

| API | Behavior |
| --- | --- |
| `items` | Required readonly array of `STimelineItem` records or a subtype |
| `label` | Accessible list name. Defaults to Timeline. |
| `emptyText` | Empty message. Defaults to No activity yet. |
| `#marker` | Scoped slot receiving `{ item }`. Defaults to a dot. Keep marker content decorative. |
| `#detail` | Scoped slot receiving `{ item }`. Defaults to the item detail. |

Public types are `STimelineItem` and `STimelineProps`. The timeline presents records in order and renders machine-readable timestamps. Apps own statuses, timestamps and comment submission. Acme shows an order history and a feedback timeline with a local composer on Cards. New demo comments live until the Cards page is left.

## Acme page examples

See [dashboard patterns](https://github.com/macmotp/sirius-ui/blob/v0.1.0-alpha.0/docs/dashboard-patterns.md) for the Acme page compositions and [the component catalog](https://github.com/macmotp/sirius-ui/blob/v0.1.0-alpha.0/docs/component-catalog.md) for public imports and examples.


## Acme account and header examples

The demo sidebar footer uses DemoAccountMenu, composing SPopover's header slot with the shared fictional user record (avatar, name, email, role and job title). View profile navigates to a simple profile view; Account settings opens Settings; Sign out only shows example feedback. On mobile, account navigation also closes the surrounding navigation drawer through the shell's scoped close callback.

The top-right controls are Search, Quick actions and Notifications. DemoSearch owns its dialog and query, filters a local catalog immediately through a computed value, announces result counts/no-match states and navigates selected results to their demo destinations. Results are ordinary links reached with Tab/Enter; this is not a combobox or a backend search implementation. DemoActions composes an interactive popover with example actions whose feedback is displayed by an app-scoped SToaster. No export, invitation, or business mutation is sent. DemoNotifications owns the right-side SDrawer and immutable read/unread updates; its trigger and status reflect the current unread count. Notification links navigate to the Activity card.

DemoAppearance is a controlled settings view. Its primary and background pickers use SCombobox with theme-colored dots in the options and selected value. App.vue owns the primary/background/dark models and updates the document theme; mounting/unmounting Settings must not reset them. Preferences reset on a full demo reload. These examples intentionally remain app-local until consuming-project requirements justify public grouped-component contracts. No router, auth, search endpoint, or notification service has been introduced into packages/dashboard.

## Configurable icons

The shared packages have no icon-library dependency. Use `createSiriusIcons` for app-wide mappings or `provideSiriusIcons` for reactive subtree overrides, with dependency-free control glyphs as fallbacks. Both playgrounds demonstrate Lucide and Heroicons; choose Icon set in the primitive header or dashboard Settings. See [icon configuration](https://github.com/macmotp/sirius-ui/blob/v0.1.0-alpha.0/docs/icons.md) for the complete semantic map, adapter examples, accessibility contract and installer guidance.

## Settings page composition

DemoSettings composes SForm, STabs, SCard, SField, SInput, STextarea, SSelect, SSwitch, SAlert and SButton. Profile, Workspace, Appearance and Notifications are keyboard-accessible tabs, with application-local panel components. The first three editable groups are profile, workspace and email notification preferences; appearance applies immediately and is excluded from the save/discard transaction. Palette pickers retain their color dots, and icon selection follows the app's reactive provider. The appearance panel contains a live miniature workspace preview.

useDemoSettings is instantiated once by App.vue. It owns editable groups, an independent saved snapshot, validation and dirty state. Named panel models replace groups rather than mutating props. Drafts, selected tab and saved values survive route changes, but reset on reload. Saving trims text, validates every group including unmounted tabs, selects the first invalid section and focuses the first invalid input. SField associates errors through aria-describedby/aria-invalid; a live summary announces failures. Save and Discard return focus to the persistent status when the pending-changes bar disappears. The bar uses native form association to submit SForm from outside it, and remains sticky near the bottom of the viewport.

Successful local saves update the shell's account/profile details and workspace name, then show a success toast. Discard restores the most recent saved values without resetting appearance. Notification toggles only store preferences; they do not send or subscribe to email. No API, persistence service, permission checks or account mutation is provided. In a consuming project, replace the synchronous save with its API/Inertia request, validate again on the backend, and only replace the saved snapshot after success. Handle request errors and pending state in that application workflow.

The layout is original and uses the Sirius palette, surfaces, control styles and bento corners. Settings-specific panels/styles remain in apps/dashboard until another consuming page demonstrates a reusable contract. Tests cover draft survival, save/discard, saved identity updates, validation across tabs, notification retention, normalization and snapshot independence. Browser verification also covers responsive layout, appearance and focus behavior.

## Page heading density

The Acme demo uses one compact h1 inside the sticky shell header beside the workspace name. There is no duplicate title row in main content. A generated heading ID is passed to SDashboardLayout.mainLabelledby so the main landmark has the same accessible name. Flat example navigation makes a separate breadcrumb trail unnecessary. Settings panels retain useful headings/help text without numbered eyebrow labels. SDashboardPageHeader still accepts optional description, eyebrow, breadcrumbs and action content for consumers that need them; its default title scale is text-2xl/sm:text-3xl.

## Orders page composition

Open the Acme demo at `#orders`. DemoOrders composes the existing STable/SPagination primitives with application-local filters, row popovers, a details drawer, a fulfillment confirmation dialog, selection and CSV downloads. The shell supplies the single page title; the page begins with a compact result summary and Filters/Actions buttons, leaving the main area for the table. Navigation and search include Orders.

### Data and request ownership

`data/orders.ts` defines the app's typed contract:

- `OrdersQuery`: `q`, `status`, inclusive UTC `from`/`to` dates, `page`, `per_page` (5/10/25/50; five is used by the overview card), `sort` (id/customer/created_at/total) and `direction`.
- `OrdersPage`: current `data`, Laravel LengthAwarePaginator-style `current_page`, `last_page`, `per_page`, `from`, `to`, `total`, previous/next URLs and page links. The custom `summary` contains processing/fulfilled counts and the non-cancelled order value for **all matching records**, not just the current page.
- `OrdersApi.list(query, signal)` and `OrdersApi.fulfill(ids, signal)` are injected into the page. API errors reject their promises. Order totals and line prices are integer SGD cents; renderers format them only at display/export boundaries.

`mockOrdersApi.ts` is explicitly the mock backend. It owns 96 deterministic fixtures dated October–November 2026, request validation, filtering, stable sorting, aggregation, page slicing, compact paginator windows and atomic fulfillment validation. Its asynchronous responses and abort support exercise real loading states. App.vue creates one instance, so demo mutations survive navigating away and back until reload. The page never receives the full record collection or paginates it locally. Replace this adapter with API/Inertia requests in a consuming project; authentication, CSRF, authorization, allowed scopes, validation and persistence remain server/application responsibilities.

`useDemoOrders` owns the issued query, current response, request/error state, cancellation and mutation lifecycle. A new request aborts the previous one; sequence checks also reject late responses from transports that ignore cancellation. Scope disposal aborts outstanding work and blocks stale commits. Search/date/status filters submit together; applying filters, changing sort or page size requests page one. Pagination uses event mode and passes API-provided URLs to the request controller; all query parameters are preserved. The backend clamps out-of-range pages and the controller adopts the actual returned page. Demo pagination URLs are API request URLs, not hash routes; no route/query persistence is implemented.

### Interaction and failure states

DemoOrderFilters uses the core SDateRange for date feedback and presets based on the demo dataset. It replaces its controlled filter model. Filters opens SDrawer, initializes a draft from the issued query, and submits search/status/dates with Apply filters or Enter. A successful request closes the drawer; failure keeps its error and values visible for correction/retry. Closing without applying leaves the issued query unchanged. Active filters remain visible as compact badges. Actions opens a dropdown for page/selection CSV exports or refresh. Native date inputs use UTC calendar days, with inclusive bounds enforced again by the adapter. An `all` select value maps to an empty API status filter so the native placeholder cannot hide the All statuses option.

`useOrderSelection` owns page-scoped IDs and derives selected/fulfillable rows from the current response. Header selection affects only displayed rows and exposes indeterminate state. Unknown IDs and changes during requests are ignored. Replacing the response clears selection. Bulk actions export the selected visible rows or confirm fulfillment of the eligible processing subset; fulfilled/cancelled selections remain eligible for export only. Fulfillment validates the whole batch before changing any record. Mutation failures stay in the confirmation dialog; successful mutations refresh the current query and only then close, with a success toast. A successful mutation followed by a failed list refresh still reports the mutation success and exposes the separate refresh error for retry.

Row actions use SPopover to escape the table's scrolling/clipping region. Popovers close before a details drawer or confirmation dialog opens. The drawer displays the supplied order/customer/items, not another independently fetched record. Result status, labelled row checkboxes, native table sort semantics, keyboard-scrollable table region and labelled pagination provide the existing primitives' accessibility behavior. Clear selection returns focus to the header checkbox. A completed fulfillment returns focus to the persistent result status after modal exit.

Initial loading uses skeletons; subsequent loading retains rows while disabling their actions. Empty results offer Clear filters. Request failures hide stale results and expose Try again. Expand Demo controls to simulate one failed list request. Exports download real UTF-8 CSV files for the current page or selected rows only, with quote escaping and spreadsheet formula-prefix protection. An all-matching-results export would need a backend export job/endpoint and is intentionally not inferred from page data.

The page and request controller unmount when leaving Orders; filters, selection and paging restart on return, while the app-scoped mock records retain mutations. These examples and their data contracts remain application-owned until another consumer establishes a reusable grouped-component need. No public library API or dependency was added.

## Example navigation and overview table card

The demo navigation is ordered Overview, Cards, Tables, Calendar, Charts and Settings. Calendar opens at #calendar. The former #lists and #activity destinations open Cards and scroll to the corresponding card. The Tables example still uses fictional Orders data and app-local DemoOrders components; its canonical hash is #tables. #orders remains a backwards-compatible alias. Search discovers Tables and sample orders, and document.title follows the active page. No incomplete page is presented as implemented.

DemoOrdersPreview composes SCard, STable and SPagination on Overview. It requests five rows through the same OrdersApi instance used by the full Tables page. Pagination and sortable totals issue API queries; no response slicing happens in the card. The mock backend supplies compact page links with null-URL ellipses. Clicking an order opens the existing detail drawer; Open Tables navigates to the full example. Both instances have independent request lifetimes and abort on unmount. The preview reports loading/error states and can retry.

DemoAccountMenu uses SPopover.block and a full-width trigger so the hover background spans the footer and the chevrons stay at the trailing edge. This primitive option sizes the trigger wrapper only; panel classes/styles still target the popup.

The shell header and main content share horizontal gutters (20px below 640px, 32px from 640px, 40px from 1024px) and the same centered 80rem content frame. This keeps both edges aligned on narrow, desktop and ultrawide layouts; the mobile menu button remains inside that frame. In Acme's header context, the workspace, separator and current page all use text-xs, with weight alone emphasizing the current page.

## Optional charts

The dashboard app explicitly imports @sirius-ui/charts; this dashboard package has no charts dependency. Charts is enabled in Page examples and search, with #charts as its route. DemoLineChartCard owns fixed 7/14-day illustrative sales datasets, period selection and total calculation, and composes SLineChart inside SCard. Overview reuses that application-local card with Open Charts navigation. DemoCharts adds gaps/negative/zero data and a request-state selector. DemoChartComparison owns line-series color/pattern settings; DemoBarCharts shows horizontal/vertical grouped bars with single/two/three-series selection and independent series colors. These use an application-owned light/dark palette from chartExamples and app CSS. DemoDonutCharts adds configurable sales-share slices/ring thickness and an order-status mix with single-slice, all-zero, loading and error examples. Chart drawing, keyboard/pointer inspection, scaling and data-table fallback belong to packages/charts; data fetching and aggregation remain app-owned. See ../charts/readme.md for the chart contract.


## Calendar page

The Acme demo starts in the month view for its sample November 2026 schedule. Month shows a Monday-first grid with event previews. Week has seven date columns and 24 scrollable hour rows. On narrow screens the week scrolls horizontally with the time labels pinned. Day uses the same hourly schedule for a single date, with event notes and a compact month picker to the right on wide screens. Both schedules keep date headers and any all-day events visible while scrolling. Select a date in Month or a column header in Week to open its Day view. Previous and Next move by the current view’s period. Today uses the current date in Singapore. The view and selected date are local to the page.

Add event opens an SDialog with the selected date prefilled. Title and date are required. Time is optional and uses Singapore time. Leave it blank for an all-day event. Saving selects the new event’s date, keeps the current view, and shows a toast. Events remain available across page navigation until the demo is reloaded.
