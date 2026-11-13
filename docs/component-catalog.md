# SiriusUI component catalog

Use this catalog to choose public exports and find their contracts and working examples. Start with the [agent guide](agent-guide.md) for implementation and generic-request composition rules, then use [dashboard patterns](dashboard-patterns.md) or [website patterns](website-patterns.md) to compose a page.

1. Choose a component by task. Import its named export from the package in the section heading.
2. Read the **Guide** sections for the components you chose. Check **Source** when the guide leaves a contract unclear or when changing a shared component. The component's props import points to its TypeScript definitions where applicable.
3. Open the **Working example** to see how data and handlers are wired. Import from the public package entry in your own app. Treat all `apps/*` files as application examples, including the dashboard, auth, website, playground, and shared helpers.
4. Use the consuming app's router, API, permissions, and state. Preserve documented component defaults and interaction contracts. Give controls accessible names, use stable data IDs, and exercise loading, empty, and error states when they apply.

## Setup

The packages are prepared for `0.1.0-alpha.1`. After publication, use the `alpha` tag to install them. See [installation](../readme.md#installation) for package selection and CSS setup. In an installed package, this catalog and its linked guides are available under `dist/docs`. Repository example links target the matching release tag.

| Using | Styles to import once in the app entry |
| --- | --- |
| Vue primitives | `@sirius-ui/vue/style.css` |
| Dashboard components | `@sirius-ui/vue/style.css` and `@sirius-ui/dashboard/style.css` |
| Optional charts | `@sirius-ui/charts/style.css` |
| Theme tokens alone | `@sirius-ui/theme` |

The compiled component CSS works with Vue 3.5 without Tailwind. Use your app's CSS or the [Tailwind 4 token mapping](../packages/theme/readme.md#setup) to style custom content. The application sets `data-theme`, `data-sirius-color`, and `data-sirius-background`. For icon libraries, configure the app's preferred set through [semantic icon mappings](icons.md).

Run `npm run dev` for the primitive examples and `npm run dev:dashboard` for Acme.

## `@sirius-ui/vue`

### Actions, navigation, and overlays

| Export | Use for | Contract | Working example |
| --- | --- | --- | --- |
| `SButton` | Action, anchor download, or router link | [Guide](../packages/vue/readme.md#sbutton) · [Source](../packages/vue/src/components/SButton.vue) | [Demo](../apps/playground/src/components/ButtonShowcase.vue) |
| `SCopyButton` | Copy supplied text with pending, success, and error feedback | [Guide](../packages/vue/readme.md#scopybutton) · [Source](../packages/vue/src/components/SCopyButton.vue) | [Demo](../apps/playground/src/components/CopyShowcase.vue) |
| `SDropdown` | Keyboard-operated menu of discrete actions | [Guide](../packages/vue/readme.md#sdropdown) · [Source](../packages/vue/src/components/SDropdown.vue) | [Demo](../apps/playground/src/components/DropdownShowcase.vue) |
| `STabs` | Switch between related panels in one view | [Guide](../packages/vue/readme.md#stabs) · [Source](../packages/vue/src/components/STabs.vue) | [Demo](../apps/playground/src/components/TabsShowcase.vue) |
| `SBreadcrumbs` | Page hierarchy with linked ancestors | [Guide](../packages/vue/readme.md#sbreadcrumbs) · [Source](../packages/vue/src/components/SBreadcrumbs.vue) | [Demo](../apps/playground/src/components/BreadcrumbsShowcase.vue) |
| `SDialog` | Focused modal form or confirmation | [Guide](../packages/vue/readme.md#sdialog) · [Source](../packages/vue/src/components/SDialog.vue) | [Demo](../apps/playground/src/components/DialogShowcase.vue) |
| `SDrawer` | Modal side panel for navigation, filters, or details | [Guide](../packages/vue/readme.md#sdrawer) · [Source](../packages/vue/src/components/SDrawer.vue) | [Demo](../apps/playground/src/components/DrawerShowcase.vue) |
| `SPopover` | Interactive content anchored to a trigger | [Guide](../packages/vue/readme.md#spopover) · [Source](../packages/vue/src/components/SPopover.vue) | [Demo](../apps/playground/src/components/PopoverShowcase.vue) |
| `STooltip` | Short supplementary description for a focusable control | [Guide](../packages/vue/readme.md#stooltip) · [Source](../packages/vue/src/components/STooltip.vue) | [Demo](../apps/playground/src/components/TooltipShowcase.vue) |
| `SIcon` | Render a named icon from the app mapping | [Guide](icons.md) · [Source](../packages/vue/src/components/SIcon.vue) | [Demo](../apps/dashboard/src/components/DemoCalendar.vue) |

### Forms

| Export | Use for | Contract | Working example |
| --- | --- | --- | --- |
| `SForm` | Native form with responsive columns and an actions slot | [Guide](../packages/vue/readme.md#sform) · [Source](../packages/vue/src/components/SForm.vue) | [Demo](../apps/playground/src/components/FormShowcase.vue) |
| `SField` | Associate a control with its label, help, and error | [Guide](../packages/vue/readme.md#sfield) · [Source](../packages/vue/src/components/SField.vue) | [Demo](../apps/playground/src/components/FormShowcase.vue) |
| `SInput` | Native text, date, time, number, color, or range control | [Guide](../packages/vue/readme.md#sinput) · [Source](../packages/vue/src/components/SInput.vue) | [Demo](../apps/playground/src/components/NativeInputShowcase.vue) |
| `SDateRange` | Date-only bounds, presets, and range validation | [Guide](../packages/vue/readme.md#sdaterange) · [Source](../packages/vue/src/components/SDateRange.vue) | [Demo](../apps/playground/src/components/NativeInputShowcase.vue) |
| `STextarea` | Multiline text | [Guide](../packages/vue/readme.md#stextarea) · [Source](../packages/vue/src/components/STextarea.vue) | [Demo](../apps/playground/src/components/FormShowcase.vue) |
| `SSelect` | Native option picker | [Guide](../packages/vue/readme.md#sselect) · [Source](../packages/vue/src/components/SSelect.vue) | [Demo](../apps/playground/src/components/FormShowcase.vue) |
| `SCombobox` | Search and select an option with custom option rendering | [Guide](../packages/vue/readme.md#scombobox) · [Source](../packages/vue/src/components/SCombobox.vue) | [Demo](../apps/playground/src/components/SearchInputShowcase.vue) |
| `STagsInput` | Edit a list of text tags | [Guide](../packages/vue/readme.md#stagsinput) · [Source](../packages/vue/src/components/STagsInput.vue) | [Demo](../apps/playground/src/components/SearchInputShowcase.vue) |
| `SCheckbox` | Boolean or mixed selection | [Guide](../packages/vue/readme.md#scheckbox) · [Source](../packages/vue/src/components/SCheckbox.vue) | [Demo](../apps/playground/src/components/ChoiceShowcase.vue) |
| `SRadio` | One value from a named group | [Guide](../packages/vue/readme.md#sradio) · [Source](../packages/vue/src/components/SRadio.vue) | [Demo](../apps/playground/src/components/ChoiceShowcase.vue) |
| `SSwitch` | Toggle a setting on or off | [Guide](../packages/vue/readme.md#sswitch) · [Source](../packages/vue/src/components/SSwitch.vue) | [Demo](../apps/playground/src/components/ChoiceShowcase.vue) |
| `SFileUpload` | Pick or drop local files and report rejected files | [Guide](../packages/vue/readme.md#sfileupload) · [Source](../packages/vue/src/components/SFileUpload.vue) | [Demo](../apps/playground/src/components/FileUploadShowcase.vue) |

### Layout, data, and feedback

| Export | Use for | Contract | Working example |
| --- | --- | --- | --- |
| `SGrid` | Responsive grid of equally sized columns | [Guide](../packages/vue/readme.md#sgrid) · [Source](../packages/vue/src/components/SGrid.vue) | [Demo](../apps/playground/src/components/LayoutShowcase.vue) |
| `SCard` | Themed surface with optional header and footer | [Guide](../packages/vue/readme.md#scard) · [Source](../packages/vue/src/components/SCard.vue) | [Demo](../apps/playground/src/components/LayoutShowcase.vue) |
| `SDivider` | Horizontal or vertical separator | [Guide](../packages/vue/readme.md#sdivider) · [Source](../packages/vue/src/components/SDivider.vue) | [Demo](../apps/playground/src/components/DividerShowcase.vue) |
| `SAccordion` | Expand or collapse one or more sections | [Guide](../packages/vue/readme.md#saccordion) · [Source](../packages/vue/src/components/SAccordion.vue) | [Demo](../apps/playground/src/components/AccordionShowcase.vue) |
| `SBadge` | Compact status or category label | [Guide](../packages/vue/readme.md#sbadge) · [Source](../packages/vue/src/components/SBadge.vue) | [Demo](../apps/playground/src/components/BadgeShowcase.vue) |
| `SAvatar` | Image, initials, or fallback glyph | [Guide](../packages/vue/readme.md#savatar) · [Source](../packages/vue/src/components/SAvatar.vue) | [Demo](../apps/playground/src/components/AvatarShowcase.vue) |
| `STable` | Display supplied rows with custom cells and server sort requests | [Guide](../packages/vue/readme.md#table-api) · [Source](../packages/vue/src/components/STable.vue) | [Demo](../apps/playground/src/components/TableShowcase.vue) |
| `SPagination` | Render server pagination metadata and URLs | [Guide](../packages/vue/readme.md#stable-and-spagination) · [Source](../packages/vue/src/components/SPagination.vue) | [Demo](../apps/playground/src/components/LargePaginationShowcase.vue) |
| `SAlert` | Inline message with optional actions | [Guide](../packages/vue/readme.md#salert) · [Source](../packages/vue/src/components/SAlert.vue) | [Demo](../apps/playground/src/components/AlertShowcase.vue) |
| `SToast` | One transient or persistent message | [Guide](../packages/vue/readme.md#stoast-stoaster-and-usetoasts) · [Source](../packages/vue/src/components/SToast.vue) | [Demo](../apps/playground/src/components/ToastShowcase.vue) |
| `SToaster` | Render an application-owned toast queue | [Guide](../packages/vue/readme.md#stoast-stoaster-and-usetoasts) · [Source](../packages/vue/src/components/SToaster.vue) | [Demo](../apps/playground/src/components/ToastShowcase.vue) |
| `SProgress` | Determinate or indeterminate progress | [Guide](../packages/vue/readme.md#sprogress) · [Source](../packages/vue/src/components/SProgress.vue) | [Demo](../apps/playground/src/components/ProgressShowcase.vue) |
| `SSkeleton` | Decorative loading placeholder | [Guide](../packages/vue/readme.md#sskeleton) · [Source](../packages/vue/src/components/SSkeleton.vue) | [Demo](../apps/playground/src/components/SkeletonShowcase.vue) |
| `SEmptyState` | Empty-result explanation with optional actions | [Guide](../packages/vue/readme.md#semptystate) · [Source](../packages/vue/src/components/SEmptyState.vue) | [Demo](../apps/playground/src/components/EmptyStateShowcase.vue) |

The Vue entry also exports these helpers.

| Export | Use for | Contract and example |
| --- | --- | --- |
| `getDateRangeError` | Validate a date range before applying filters | [Date range](../packages/vue/readme.md#sdaterange) |
| `useToasts` | Own a toast queue for an application or feature | [Toast queue](../packages/vue/readme.md#stoast-stoaster-and-usetoasts) |
| `createSiriusIcons` | Install app-wide icon mappings | [Icon configuration](icons.md#app-configuration) |
| `provideSiriusIcons` | Override icon mappings for descendants | [Scoped overrides](icons.md#reactive-and-scoped-overrides) |
| `createSiriusIcon` | Create a component for a named icon to pass in props or item records | [Scoped overrides](icons.md#reactive-and-scoped-overrides) |

## `@sirius-ui/dashboard`

| Export | Use for | Contract | Working example |
| --- | --- | --- | --- |
| `SDashboardLayout` | Responsive shell with mobile navigation drawer | [Guide](../packages/dashboard/readme.md#contract) · [Source](../packages/dashboard/src/components/SDashboardLayout.vue) | [Demo](../apps/dashboard/src/App.vue) |
| `SDashboardNav` | Grouped links with app-owned current state | [Guide](../packages/dashboard/readme.md#sdashboardnav) · [Source](../packages/dashboard/src/components/SDashboardNav.vue) | [Demo](../apps/dashboard/src/components/DemoNavigation.vue) |
| `SDashboardPageHeader` | Page title with optional description and actions | [Guide](../packages/dashboard/readme.md#sdashboardpageheader) · [Source](../packages/dashboard/src/components/SDashboardPageHeader.vue) | [Snippet](../packages/dashboard/readme.md#sdashboardpageheader) |
| `SMetricCard` | Metric, comparison, and optional chart slot | [Guide](../packages/dashboard/readme.md#smetriccard) · [Source](../packages/dashboard/src/components/SMetricCard.vue) | [Demo](../apps/dashboard/src/components/DemoCards.vue) |
| `SUserCard` | Profile summary and contact actions | [Guide](../packages/dashboard/readme.md#susercard) · [Source](../packages/dashboard/src/components/SUserCard.vue) | [Demo](../apps/dashboard/src/components/DemoCards.vue) |
| `SUtilityCard` | Entity summary with labelled data rows | [Guide](../packages/dashboard/readme.md#sutilitycard) · [Source](../packages/dashboard/src/components/SUtilityCard.vue) | [Demo](../apps/dashboard/src/components/DemoUtilityCards.vue) |
| `SPeopleList` | Compact directory with roles and presence | [Guide](../packages/dashboard/readme.md#speoplelist) · [Source](../packages/dashboard/src/components/SPeopleList.vue) | [Demo](../apps/dashboard/src/components/DemoPeopleCard.vue) |
| `STimeline` | Ordered status changes or feedback | [Guide](../packages/dashboard/readme.md#stimeline) · [Source](../packages/dashboard/src/components/STimeline.vue) | [Demo](../apps/dashboard/src/components/DemoActivityCards.vue) |

Use a single page title. If the shell header already renders the page's `h1`, page sections start at `h2`. Use `SDashboardPageHeader` when the title belongs in the page body.

## `@sirius-ui/charts`

| Export | Use for | Contract | Working example |
| --- | --- | --- | --- |
| `SLineChart` | Trend over ordered categories, with optional multiple series | [Guide](../packages/charts/readme.md#slinechart-contract) · [Source](../packages/charts/src/components/SLineChart.vue) | [Demo](../apps/dashboard/src/components/DemoLineChartCard.vue) |
| `SBarChart` | Compare categories using horizontal or vertical bars | [Guide](../packages/charts/bar-chart.md) · [Source](../packages/charts/src/components/SBarChart.vue) | [Demo](../apps/dashboard/src/components/DemoBarCharts.vue) |
| `SDonutChart` | Show nonnegative parts of a whole | [Guide](../packages/charts/donut-chart.md) · [Source](../packages/charts/src/components/SDonutChart.vue) | [Demo](../apps/dashboard/src/components/DemoDonutCharts.vue) |
| `SSparkline` | Compact trend in a metric card or summary | [Guide](../packages/charts/readme.md#ssparkline) · [Source](../packages/charts/src/components/SSparkline.vue) | [Demo](../apps/dashboard/src/components/DemoCards.vue) |

Chart inputs are ordered application data. Supply titles, units, and consistent formatters. For a small trend in a dashboard card, supply `SSparkline` through `SMetricCard`'s `chart` slot. Import charts explicitly in the consuming app.

## `@sirius-ui/auth`

Use these controlled templates for authentication pages. Import from `@sirius-ui/auth` and load its stylesheet alongside the core Vue stylesheet. See the [shared form contract](../packages/auth/readme.md#shared-form-contract) for processing, feedback, and model ownership.

| Export | Use for | Contract | Working example |
| --- | --- | --- | --- |
| `SAuthLayout` | Centered or split page with one heading and optional branding | [Guide](../packages/auth/readme.md#sauthlayout) · [Source](../packages/auth/src/components/SAuthLayout.vue) | [Demo](../apps/auth/src/App.vue) |
| `SLoginForm` | Email/password sign-in and remember choice | [Guide](../packages/auth/readme.md#sloginform) · [Source](../packages/auth/src/components/SLoginForm.vue) | [Demo](../apps/auth/src/AuthDemoForm.vue) |
| `SRegisterForm` | Name, email, password, and confirmation | [Guide](../packages/auth/readme.md#sregisterform) · [Source](../packages/auth/src/components/SRegisterForm.vue) | [Demo](../apps/auth/src/AuthDemoForm.vue) |
| `SForgotPasswordForm` | Request a password reset link | [Guide](../packages/auth/readme.md#sforgotpasswordform) · [Source](../packages/auth/src/components/SForgotPasswordForm.vue) | [Demo](../apps/auth/src/AuthDemoForm.vue) |
| `SResetPasswordForm` | Enter a new password and confirmation | [Guide](../packages/auth/readme.md#sresetpasswordform) · [Source](../packages/auth/src/components/SResetPasswordForm.vue) | [Demo](../apps/auth/src/AuthDemoForm.vue) |
| `SConfirmPasswordForm` | Confirm a password before an app action | [Guide](../packages/auth/readme.md#sconfirmpasswordform) · [Source](../packages/auth/src/components/SConfirmPasswordForm.vue) | [Demo](../apps/auth/src/AuthDemoForm.vue) |
| `STwoFactorForm` | Submit an authenticator code or a recovery code | [Guide](../packages/auth/readme.md#stwofactorform) · [Source](../packages/auth/src/components/STwoFactorForm.vue) | [Demo](../apps/auth/src/AuthDemoForm.vue) |
| `SEmailVerification` | Verification instructions, resend, and sign-out actions | [Guide](../packages/auth/readme.md#semailverification) · [Source](../packages/auth/src/components/SEmailVerification.vue) | [Demo](../apps/auth/src/AuthDemoForm.vue) |

## `@sirius-ui/website` private preview

Use website sections for public-facing pages. Import from `@sirius-ui/website` and load `@sirius-ui/website/style.css` alongside the core Vue stylesheet. The [website guide](../packages/website/readme.md) describes the private preview's component and app boundaries.

For original studio compositions and section variations, see the [Sections showcase](../apps/website/src/pages/StudioSections.vue) and its [hero examples](../apps/website/src/components/StudioHeroExamples.vue), [feature examples](../apps/website/src/components/StudioFeatureExamples.vue), [CTA examples](../apps/website/src/components/StudioCtaExamples.vue), [newsletter examples](../apps/website/src/components/StudioNewsletterExamples.vue), [stats examples](../apps/website/src/components/StudioStatsExamples.vue), [testimonial examples](../apps/website/src/components/StudioTestimonialExamples.vue), [blog examples](../apps/website/src/components/StudioBlogExamples.vue), [contact examples](../apps/website/src/components/StudioContactExamples.vue), [team examples](../apps/website/src/components/StudioTeamExamples.vue), and [footer example](../apps/website/src/components/StudioFooterExamples.vue).

| Export | Use for | Contract | Working example |
| --- | --- | --- | --- |
| `SWebsiteLayout` | Skip link and main landmark with header/footer slots | [Guide](../packages/website/readme.md#swebsitelayout) · [Source](../packages/website/src/components/SWebsiteLayout.vue) | [Demo](../apps/website/src/App.vue) |
| `SWebsiteHeader` | Desktop navigation and a mobile drawer | [Guide](../packages/website/readme.md#swebsiteheader) · [Source](../packages/website/src/components/SWebsiteHeader.vue) | [Demo](../apps/website/src/App.vue) |
| `SWebsiteFooter` | Grouped footer links or centered navigation with app-owned social icons | [Guide](../packages/website/readme.md#swebsitefooter) · [Source](../packages/website/src/components/SWebsiteFooter.vue) | [Demo](../apps/website/src/App.vue) |
| `SWebsiteHero` | Page introduction with actions and optional media | [Guide](../packages/website/readme.md#swebsitehero) · [Source](../packages/website/src/components/SWebsiteHero.vue) | [Demo](../apps/website/src/pages/StudioHome.vue) |
| `SWebsiteSection` | Consistent content width, section heading, and contextual controls | [Guide](../packages/website/readme.md#swebsitesection) · [Source](../packages/website/src/components/SWebsiteSection.vue) | [Demo](../apps/website/src/pages/StudioProjects.vue) |
| `SWebsiteFeatures` | Icon columns, a 2 × 2 grid, or a feature list beside media | [Guide](../packages/website/readme.md#swebsitefeatures) · [Source](../packages/website/src/components/SWebsiteFeatures.vue) | [Demo](../apps/website/src/components/StudioFeatureExamples.vue) |
| `SProjectCard` | Linked project preview and metadata | [Guide](../packages/website/readme.md#sprojectcard) · [Source](../packages/website/src/components/SProjectCard.vue) | [Demo](../apps/website/src/components/StudioProjectGrid.vue) |
| `SWebsiteCta` | Banner, simple, centered, gradient, or image call to action | [Guide](../packages/website/readme.md#swebsitecta) · [Source](../packages/website/src/components/SWebsiteCta.vue) | [Demo](../apps/website/src/pages/StudioHome.vue) |
| `SWebsiteNewsletter` | Controlled email sign-up with details or a simple accent band | [Guide](../packages/website/readme.md#swebsitenewsletter) · [Source](../packages/website/src/components/SWebsiteNewsletter.vue) | [Demo](../apps/website/src/components/StudioNewsletterExamples.vue) |
| `SWebsiteStats` | Joined stat tiles, a list beside imagery, or figures alongside supporting prose | [Guide](../packages/website/readme.md#swebsitestats) · [Source](../packages/website/src/components/SWebsiteStats.vue) | [Demo](../apps/website/src/components/StudioStatsExamples.vue) |
| `SWebsiteTestimonials` | Centered quotes, a quote beside imagery, or multiple partner quotes | [Guide](../packages/website/readme.md#swebsitetestimonials) · [Source](../packages/website/src/components/SWebsiteTestimonials.vue) | [Demo](../apps/website/src/components/StudioTestimonialExamples.vue) |
| `SPricingCard` | Formatted plan prices, features, and app-owned selection controls | [Guide](../packages/website/readme.md#spricingcard) · [Source](../packages/website/src/components/SPricingCard.vue) | [Demo](../apps/website/src/pages/StudioPricing.vue) |
| `SWebsiteBlog` | Text columns, image columns, or a horizontal article list | [Guide](../packages/website/readme.md#swebsiteblog) · [Source](../packages/website/src/components/SWebsiteBlog.vue) | [Demo](../apps/website/src/components/StudioBlogExamples.vue) |
| `SWebsiteContact` | Contact details beside an app-owned form, or a location grid | [Guide](../packages/website/readme.md#swebsitecontact) · [Source](../packages/website/src/components/SWebsiteContact.vue) | [Demo](../apps/website/src/components/StudioContactExamples.vue) |
| `SWebsiteTeam` | Compact team profiles or a larger circular portrait grid | [Guide](../packages/website/readme.md#swebsiteteam) · [Source](../packages/website/src/components/SWebsiteTeam.vue) | [Demo](../apps/website/src/components/StudioTeamExamples.vue) |
| `SArticleCard` | Linked editorial preview with category, date, and author | [Guide](../packages/website/readme.md#sarticlecard) · [Source](../packages/website/src/components/SArticleCard.vue) | [Demo](../apps/website/src/components/StudioArticleGrid.vue) |

The website showcase includes a category menu with shareable `#sections/<category>` targets, plus the original homepage, services/process, portfolio, pricing, FAQ, enquiry, team, journal, CTA, and footer compositions. See [navigation and extension rules](../packages/website/readme.md#navigating-and-extending-the-section-showcase). Use shared app compositions for Acme content and public components for reusable UI.
