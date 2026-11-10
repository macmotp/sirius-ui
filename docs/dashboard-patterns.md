# SiriusUI dashboard patterns

Use these patterns to assemble pages with the [component catalog](component-catalog.md). Acme is a running Vue application with local fixtures. Follow its component wiring and supply the consuming project's routes, data, permissions, persistence, and copy.

## Dashboard shell

1. Mount one `SDashboardLayout`. Supply the brand, grouped `SDashboardNav`, page context, and header actions through slots.
2. Pass the router's active item ID to `SDashboardNav.current` and the current route or URL to `SDashboardLayout.navigationKey`. Use the app's link component when navigation requires it.
3. Give the layout's main landmark the page title through `mainLabelledby`. Use the shell header or `SDashboardPageHeader` in the body as the single `h1`.
4. Use `SDialog` for search, `SPopover` for the account panel, and `SDrawer` for notifications. Keep results, unread state, and action handlers in the app.

See the [Acme shell](../apps/dashboard/src/App.vue), [navigation](../apps/dashboard/src/components/DemoNavigation.vue), [search](../apps/dashboard/src/components/DemoSearch.vue), and [shell contract](../packages/dashboard/readme.md#contract).

## Server-driven table

Use this pattern when a server owns filtering, sorting, and pagination. Start with the [Laravel example](../packages/vue/readme.md#api-requests-with-laravel-pagination) for minimal wiring.

1. Keep an issued query and the current response in app state. Bind `STable.rows` to the response's `data` and pass the same paginator response to `SPagination.pagination`. Use stable server IDs for `rowKey`.
2. Use `SPagination` in `event` mode when an app handler loads the URL emitted by `navigate`. Use `link` mode for server-rendered or Inertia navigation, with `linkAs` for the app's link adapter. Preserve the server's query parameters and page links. Let the server determine page boundaries and the number window.
3. Bind `STable.sort` to the issued query and handle its `sort` event with a request. Reset to page one when filters, sort, or page size change. Abort superseded requests and commit only the latest response.
4. Open a right-side `SDrawer` with a draft copied from the issued filters. Use `SForm`, `SField`, and `SDateRange` as appropriate. Close after a successful request and keep values and an error visible on failure. Show applied filters on the page.
5. For page-scoped bulk actions, add a selection column with `SCheckbox` in the table's `header` and `cell` slots. Bind them to app-owned IDs and set the header's `indeterminate` prop for partial selection. Clear selection when the response changes. Label the scope, disable actions during requests, and use `SDropdown` for bulk actions and `SDialog` to confirm a mutation. Authorize and validate IDs on the server.
6. Show loading, empty, and error states. Keep retry available on failure. Refresh the issued query after a mutation, and distinguish a failed refresh from a failed mutation. Export only the rows your UI promises. Use a backend export endpoint for all matching rows.

Follow the [Orders page](../apps/dashboard/src/components/DemoOrders.vue), [table wrapper](../apps/dashboard/src/components/orders/DemoOrdersTable.vue), [filter form](../apps/dashboard/src/components/orders/DemoOrderFilters.vue), [request controller](../apps/dashboard/src/composables/useDemoOrders.ts), and [selection controller](../apps/dashboard/src/composables/useOrderSelection.ts). The [Overview table card](../apps/dashboard/src/components/orders/DemoOrdersPreview.vue) shows the same request pattern with fewer columns and its own page size. The [100-page example](../apps/playground/src/components/LargePaginationShowcase.vue) demonstrates compact server-supplied links.

## Other page compositions

| Page | Composition | App responsibility | Reference |
| --- | --- | --- | --- |
| Overview | Summary cards, a chart card, and a pageable table preview | Decide what to summarize and request each preview's data | [DemoOverview](../apps/dashboard/src/components/DemoOverview.vue) |
| Cards | `SGrid` with metric cards, user cards, utility cards, people lists, and timelines | Supply metric units and comparisons, user actions, and activity records | [DemoCards](../apps/dashboard/src/components/DemoCards.vue) · [DemoActivityCards](../apps/dashboard/src/components/DemoActivityCards.vue) |
| Calendar | Date navigation, month grid, day/week schedule, and an `SDialog` event form | Own dates, time zone, event records, and persistence. The grids are Acme components under `apps/dashboard` | [DemoCalendar](../apps/dashboard/src/components/DemoCalendar.vue) · [DemoAddEvent](../apps/dashboard/src/components/calendar/DemoAddEvent.vue) |
| Charts | `SCard` and optional charts with period or series controls | Fetch, order, and aggregate observations. Supply units and loading or error state | [DemoCharts](../apps/dashboard/src/components/DemoCharts.vue) · [Chart contracts](../packages/charts/readme.md) |
| Settings | `STabs` and labelled controls in an `SForm`, with save and discard actions | Own the draft, saved snapshot, validation, persistence, and appearance preferences | [DemoSettings](../apps/dashboard/src/components/DemoSettings.vue) · [Settings state](../apps/dashboard/src/composables/useDemoSettings.ts) |
