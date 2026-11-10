# @sirius-ui/dashboard

Agent usage guide for Sirius dashboard composition: `SDashboardLayout`, `SDashboardNav`, `SDashboardPageHeader`, and `SMetricCard`. This private workspace is not published yet. `SDashboardLayout` composes `@sirius-ui/vue` primitives and the shared theme. Use it for a desktop navigation rail, sticky header and page content, with a native modal SDrawer navigation panel below 64rem. The original shell was built from functional requirements without importing a purchased template.

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
| `navigationLabel` | `Main navigation` | Names the desktop/mobile nav and the mobile dialog |
| `openNavigationLabel` | `Open navigation` | Accessible menu-trigger label |
| `closeNavigationLabel` | `Close navigation` | Accessible drawer-close label |
| `skipLinkLabel` | `Skip to content` | Visible-on-focus skip link |
| `navigationKey` | Unset | Route identifier; a change closes open mobile navigation |
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

The demo is a separate app under `apps/dashboard`, normally http://127.0.0.1:5180. It displays one fictional business, Acme, using the Sirius logo, with local hash navigation and a temporary Settings page for neutral-palette selection and dark appearance. Appearance models live in the app and survive page navigation. This demonstrates composition; none of its sample pages, names, data or preferences belong to the shared package. The primitive playground remains separate.

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

## Next sample pages

The Acme roadmap is: a complete settings form, a server-driven table with filters, then chat, timeline and chart examples. These are planned, not implemented by the navigation/header components. Build examples from existing primitives first, then extract shared groups when their responsibilities and data contracts are clear. The existing Activity and Settings views remain small composition demonstrations. Keep sample business data in apps/dashboard, and keep request/data ownership explicit in future examples.


## Acme account and header examples

The demo sidebar footer uses DemoAccountMenu, composing SPopover's header slot with the shared fictional user record (avatar, name, email, role and job title). View profile navigates to a simple profile view; Account settings opens Settings; Sign out only shows example feedback. On mobile, account navigation also closes the surrounding navigation drawer through the shell's scoped close callback.

The top-right controls are Search, Quick actions and Notifications. DemoSearch owns its dialog and query, filters a local catalog immediately through a computed value, announces result counts/no-match states and navigates selected results to their demo destinations. Results are ordinary links reached with Tab/Enter; this is not a combobox or a backend search implementation. DemoActions composes an interactive popover with example actions whose feedback is displayed by an app-scoped SToaster. No export, invitation, or business mutation is sent. DemoNotifications owns the right-side SDrawer and immutable read/unread updates; its trigger and status reflect the current unread count. Notification links navigate to Activity.

DemoAppearance is a controlled settings view. App.vue owns the palette/dark models and updates the document theme; mounting/unmounting Settings must not reset them. Preferences reset on a full demo reload. These examples intentionally remain app-local until consuming-project requirements justify public grouped-component contracts. No router, auth, search endpoint, or notification service has been introduced into packages/dashboard.

## Configurable icons

The shared packages have no icon-library dependency. Use `createSiriusIcons` for app-wide mappings or `provideSiriusIcons` for reactive subtree overrides, with dependency-free control glyphs as fallbacks. Both playgrounds demonstrate Lucide and Heroicons; choose Icon set in the primitive header or dashboard Settings. See [icon configuration](docs/icons.md) for the complete semantic map, adapter examples, accessibility contract and installer guidance.

## Optional charts

The private @sirius-ui/charts workspace provides lightweight SVG SLineChart, SBarChart and SDonutChart components with categorical labels, numeric values, missing-value handling, keyboard/pointer inspection and a native data-table alternative. Bar charts support horizontal/vertical layouts, grouped series and per-series colors; donut charts show nonnegative composition with slice shares and an optional center total. It depends only on the Sirius theme and Vue. Applications opt in separately; the core primitives and dashboard shell do not pull charts into their bundles. See [the charts agent guide](packages/charts/readme.md) for imports, props, data semantics, states and accessibility responsibilities. The dashboard demo exposes Charts and includes a chart card on Overview.

See [the metric card contract](packages/dashboard/readme.md#smetriccard) for summary values, comparisons and loading states.
