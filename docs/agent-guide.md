# Build applications with SiriusUI

This is the entry point for agents consuming SiriusUI. Use existing components and their documented behavior to assemble an application. For changes to SiriusUI itself, also read the repository’s [implementation rules](../AGENTS.md).

## Read only what the task needs

1. Check the consuming app’s dependencies, installed package versions, framework, router, theme entry, and existing icon configuration. Use that project’s instructions and conventions.
2. Translate the request into a surface, primary visitor/user action, and a small content outline using the rules below.
3. Open the [component catalog](component-catalog.md) and select public exports by task.
4. Read the relevant package contracts, then the matching [dashboard patterns](dashboard-patterns.md) or [website patterns](website-patterns.md). For auth, use the [auth guide](../packages/auth/readme.md). Read the matching recipe rather than every showcase example.
5. Consult the linked example when wiring data or handlers is unclear. Read source/types when the guide leaves an ambiguity. Do not load the entire architecture history to build a routine page.
6. Implement the app’s data, routes, request lifecycle, permissions, copy, and assets around those components. Verify the resulting interaction in the consuming app.

In an installed package, start at `node_modules/@sirius-ui/<package>/dist/docs/readme.md`. The bundled catalog, patterns, and package guides use local relative links; source/example links use the matching release tag. In a repository checkout, start with this file. New checkout changes do not become available in an existing release automatically.

## Availability and authority

- Read package.json and the installed declarations before using an export. The catalog describes this checkout; installed releases can contain fewer components or different contracts.
- Theme, Vue, charts, dashboard, and auth are prepared as aligned alpha libraries. This does not establish that a particular version has been published to a registry. Check availability before giving installation commands.
- Website remains a private `0.0.0` workspace preview. Use it from a source checkout or a project-approved local integration until it is released. Do not assume an npm installation exists for it.
- Import named exports and styles from public package entries. Treat `apps/*` and `apps/shared` as application examples, not installable libraries or supported deep imports.
- A template name in the showcase is a composition, not necessarily a public export. For example, FAQ sections use SWebsiteSection with SAccordion; portfolio grids use SGrid with SProjectCard.
- If a contract and implementation disagree, inspect the matching installed source/types or ask for the missing requirement. Do not guess a prop, event, slot, or component name.

## Translate a generic request into a composition

Treat requests such as “build me a personal website” as requests to build an app using Sirius, not to redesign the library. Infer the intended audience, primary action, supplied content, and whether the surface is public, authenticated, or both. Use existing project context before asking questions. Make ordinary reversible choices and continue implementation; ask only when missing information materially changes the product or prevents a working result. Clearly mark missing personal/business content as placeholders rather than inventing facts.

| Request intent | Starting collection | Minimal composition / decision |
| --- | --- | --- |
| Personal website or professional profile | Website | SWebsiteLayout + header, hero, a concise about section, a genuine contact action, footer. Add selected work only when projects are supplied or requested |
| Portfolio | Website | Hero + SWebsiteSection containing SGrid/SProjectCard + about/contact. Add project detail routes if the scope calls for them |
| Agency or service business | Website | Hero + services/features + supported work/proof + contact/CTA + footer. Add team, locations, or plans only when the business needs them |
| Product marketing site | Website | Hero + capabilities/features + supported proof + primary conversion action. Pricing, FAQ, newsletter, and blog are optional, not mandatory sections |
| Blog or publication | Website | Header + SWebsiteBlog or an article-card collection + app-owned article pages + footer. A newsletter is optional |
| Admin panel or customer workspace | Dashboard, with Vue primitives | SDashboardLayout + navigation + task-specific cards/forms/tables. Add charts only when the request includes useful quantitative data |
| Login, recovery, or registration | Auth, with Vue primitives | SAuthLayout + the matching controlled auth form. The app/backend provides the authentication flow |
| Store, booking, or another domain application | Available website/dashboard/core components | Use existing shells and primitives for presentation; model product/search/booking flows in the app. Do not invent a public ecommerce/booking package or claim a ready-made template exists |
| Public website plus private account area | Website and dashboard/auth on separate routes | Select one appropriate shell per route and share theme, branding, and app services |

A request’s label is a clue, not a fixed page specification. A photographer’s personal site may emphasize work; a writer’s may emphasize articles; a consultant’s may emphasize services. Follow supplied requirements and actual content. Do not turn every personal site into the Acme agency demo or every application into a dashboard.

### Build the smallest suitable page

Before editing markup, choose one coherent section sequence and the data/actions each section needs. Prefer an existing original composition or supported variant whose structure already fits the goal. Keep useful defaults instead of evaluating every variant. Add, omit, or reorder sections to fit the request; do not render the whole showcase in production.

A lean personal page can be: introduction → about → contact → footer. A portfolio with supplied work can be: introduction → selected work → about → contact → footer. These are starting outlines, not mandatory templates. A precise user design or an existing project’s structure takes precedence.

- Use SWebsiteHero for the page introduction and its primary action. Its media is optional; do not force a phone mockup onto a biography with no app/product context.
- For prose, an about section, FAQ, plans, or projects, choose a section wrapper plus the relevant content/cards. For purpose-built sections such as SWebsiteBlog or SWebsiteTeam, use the section component directly.
- Include stats, testimonials, clients, awards, team members, offices, prices, and subscribers only when supplied, requested as explicit demo fixtures, or backed by real app data. Do not fill template slots with fabricated credibility claims.
- A solo person does not require a team directory. A contact link does not require a contact form/backend. A website does not require authentication, a newsletter, or a dashboard merely because these components exist.
- Match navigation and calls to action to sections/routes that actually exist. Give each action one clear purpose. If functionality is intentionally a preview, distinguish that from a completed integration.

## Fit components together before customizing them

Use this order: **appropriate shell → section sequence → supported variants → app content/data and slots → app integration**. The shape of the page should come from the selected components, while the meaning comes from the consuming project.

| Layer | Composition rule |
| --- | --- |
| Route shell | Use one appropriate top-level layout for the route. SWebsiteLayout, SDashboardLayout, and SAuthLayout each provide a main region; do not nest complete shells inside each other |
| Page title | Provide one h1. SWebsiteLayout names the app-supplied heading; SAuthLayout supplies its own. Do not add a second page hero/title just to repeat the navigation context |
| Full website sections | Place section components as siblings in the layout content. They already own headings, content width, gutters, and section spacing. Do not automatically wrap them in another SWebsiteSection or SCard |
| Cards and primitives | Put SProjectCard, SPricingCard, SArticleCard, SAccordion, or form controls inside the appropriate app-owned section/grid when no higher-level section already fits |
| Grid ownership | Let SWebsiteBlog, SWebsiteFeatures, SWebsiteTeam, and other section components own their documented internal grids. Do not add a second outer grid around a full section to force its internal cards into columns |
| Slots | Supply branding, icons, media, actions, and app-owned form content through the documented slots. Keep noninteractive media slots free of nested links/buttons when a stretched title link covers them |
| State | Bind the documented model and events to app-owned state. A wrapper may own a form draft or billing period; it should not replace component keyboard/focus behavior |
| Navigation | Use href-compatible adapters and real destinations. Website preview hashes and Studio-prefixed helpers are examples, not production route APIs |
| Visual system | Use the shared theme, controls, typography, radii, and existing interaction styles across collections. Configure the app’s chosen icon set once rather than switching sets between unrelated sections |

The [website patterns](website-patterns.md#heading-hierarchy) define nested heading levels. Section wrappers, cards, and accordions must fit the surrounding document, not keep a standalone example’s heading level blindly. Container width also matters: verify that the selected variation fits the actual shell/sidebar as well as the viewport.

### What may change for a normal build request

| Change | Expected approach |
| --- | --- |
| Wording, identity, records, images, links, formatting, translations | Replace app-owned content and bindings. Preserve the component’s supported structure and behavior |
| Section order, inclusion, supported variants, headings, slot content | Adapt the page composition to the request. Preserve each chosen variant’s internal layout, semantics, responsiveness, and interactions |
| App-specific workflow, forms, search, filters, permissions, requests | Compose a focused app-owned wrapper from public exports. Keep state/business rules outside the library |
| A visual requirement unsupported by a variant | First use available props, slots, semantic theme overrides, or another suitable variant. If needed, create a small app-owned composition from primitives and retain accessibility |
| New shared behavior or a component contract change | Treat this as library development, not routine page assembly. Follow the repository’s implementation workflow, document/test the change, and preserve other consumers’ defaults |

Do not apply a blanket “change wording only” rule: an unsuitable template still needs a different composition. Conversely, a generic app request is not a reason to fork a Sirius component, restyle all controls, change its events, or recreate an existing section in raw markup. If a genuine gap remains, use the smallest appropriate app composition and explain the gap. An ordinary local wrapper does not require a new shared API or an additional approval step.

### Acceptance examples

| Generic request | Appropriate result | Avoid |
| --- | --- | --- |
| “Build me a personal website” | A lean public site with an introduction, about content, contact action, and deliberate placeholders for missing identity/content | Unrequested pricing, invented metrics/reviews, a fabricated team, or an entire dashboard shell |
| “Make it a portfolio with six projects” | A website shell, introduction, reusable project grid/cards with six actual/explicitly provisional records, and working project/contact destinations | Six copied implementations of a card, or project links with no matching destination |
| “I write essays and want people to subscribe” | Writer-focused introduction, article collection/detail routes, and a newsletter with app-owned request/error/success handling | Agency service copy or a form that pretends to subscribe without a handler |
| “Build an order-management dashboard” | A dashboard shell, API-driven table/pagination, filters and permitted actions using the app’s data contract | A marketing hero replacing the main task view, or frontend pagination pretending to cover all server records |

The result should be a working, purpose-specific application that still looks and behaves like Sirius. Report the chosen composition, assumptions/placeholders, integration status, and actual verification briefly; do not require a long formal plan before doing authorized work.

## Preserve the contracts

Reuse component defaults, models, events, slots, keyboard handling, focus behavior, and native semantics. Change these only when the task explicitly requires it. Customize through public props, slots, semantic tokens, and app-owned composition before considering a shared component change.

| Responsibility | Owner |
| --- | --- |
| Rendering, documented local interaction, semantic structure | Sirius component |
| Routing/link adapter, active route, page title, navigation focus and scrolling | Consuming app |
| API calls, request cancellation, loading/error/success state | Consuming app |
| Authorization, persistence, server validation, pagination boundaries | Backend and consuming app |
| Formatting dates, money, percentages, chart units, and stat values | Consuming app |
| Content, translations, privacy destinations, image rights, and credits | Consuming app |
| Accent/background selection, appearance persistence, font loading | Consuming app using theme tokens |
| Icon-set selection and mappings | Consuming app using [icon configuration](icons.md) |

Use server-driven SPagination with server-returned page links for API tables. Do not replace it with client-side pagination of an incomplete dataset. Auth and newsletter components do not authenticate or send requests by themselves. SWebsiteContact accepts an app-owned form; it does not define the project’s form schema.

## Theme and icons

Import each used package’s compiled stylesheet once, following the [catalog setup](component-catalog.md#setup). Core Vue styles are also needed when composing dashboard, auth, or website sections. A consuming app does not need Tailwind to use compiled component styling. If it uses Tailwind for its own slot content, follow the [theme guide](../packages/theme/readme.md).

Use semantic colors such as bg-canvas, bg-surface, text-content, text-content-muted, and border-line. Keep the selected accent and background palette independent of fixed success/warning/danger roles. Preserve control rounding and the default 2xl panel radius. Set appearance through the theme API rather than adding independent color systems to individual templates.

Do not install both Lucide and Heroicons just because the demo apps use both. Configure the chosen set once or supply documented icon slots. Do not modify core components to import an app’s preferred library. Missing custom icon names do not download icons dynamically.

## Accessibility and responsive composition

- Give a page one h1 and a correctly named main landmark. Use the next heading level when nesting sections, examples, cards, and accordion groups. Keep generated IDs unless a surrounding landmark needs an explicit target.
- Use SField’s scoped control attributes for form labels, descriptions, and errors. Name icon-only actions on the action itself. Keep decorative icons and redundant avatars hidden from assistive technology.
- Preserve native anchor behavior, including modified clicks and new tabs. On SPA route changes, make focus/scroll behavior explicit. Return focus appropriately after dialogs/drawers close.
- Do not put interactive content in a stretched-link card’s media slot. Category/author links in editorial article cards already have separate targets; preserve that layering.
- Keep layouts shrinkable with min-w-0. Let action rows wrap. Use the documented responsive layouts and test them in their actual container, especially inside a sidebar or narrow panel.
- Check narrow and wide screens, long labels, keyboard navigation, visible focus, and both appearances. Exercise meaningful loading, validation, empty, and error states. A passing build does not establish visual or browser accessibility verification.

## Completion criteria

Use the consuming app’s required checks. Report what was implemented and what was actually validated. If a browser cannot run, state that limitation rather than claiming the responsive layout was visually verified. If changing SiriusUI implementation, follow AGENTS.md and run the repository’s required checks. For documentation-only changes, validate paths, anchors, and bundled links.
