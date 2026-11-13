# SiriusUI website patterns

Use this guide with the [agent entry point](agent-guide.md), [catalog](component-catalog.md#sirius-uiwebsite-private-preview), and [website contracts](../packages/website/readme.md). Website is currently a private workspace preview, not a promised registry dependency. These patterns describe public APIs in this checkout; verify the version available to the consuming app first.

## Choose a section

| Goal | Public composition | Variations / app responsibility |
| --- | --- | --- |
| Page framing | SWebsiteLayout, SWebsiteHeader, SWebsiteFooter | Supply branding, links, router adapter, active route, and page heading |
| Introduction | SWebsiteHero | split, centered, mobile, angled; app supplies actions and media |
| Capabilities | SWebsiteFeatures | small-icons, large-icons, grid, image; app supplies records and decorative icon slot |
| Portfolio | SWebsiteSection + SGrid + SProjectCard | App supplies project records, links, artwork, and filtering |
| Next action | SWebsiteCta | banner, simple, centered, gradient, image; app supplies actions and optional media |
| Newsletter | SWebsiteNewsletter | details or simple; required string v-model and app-owned submission lifecycle |
| Key figures | SWebsiteStats | simple, image, description; values are app-formatted strings |
| Partner quotes | SWebsiteTestimonials | simple, image, multiple; app supplies quote records, brand/media slots, and permissions |
| Article collection | SWebsiteBlog | columns, images, list; app supplies dates, destinations, author metadata, and covers |
| Individual article card | SArticleCard | default, editorial, horizontal; app owns the surrounding collection |
| Contact | SWebsiteContact | split with form slot, or locations with address records |
| People | SWebsiteTeam | small-images or round-images; optional profile links and portrait slot |
| Plans | SWebsiteSection + SGrid + SPricingCard | App owns billing period, currency, prices, totals, and plan selection |
| Questions | SWebsiteSection + SAccordion | App owns groups, filtering, and search; set nested heading levels |
| Closing navigation | SWebsiteFooter | columns uses groups; centered uses items/socials and optional socialIcon slot |

Every public website export has a contract and source/example links in the catalog. The [showcase navigation guide](../packages/website/readme.md#navigating-and-extending-the-section-showcase) lists direct preview hashes and the original named studio compositions. These hashes belong to the demo router; they are not routing behavior supplied by the library.

## Personal website: from a broad request to a page

Apply the [generic-request rules](agent-guide.md#translate-a-generic-request-into-a-composition) before choosing a visual variation. “Personal website” does not imply an agency, product, team, or paid plan.

| Page part | Default choice | Adaptation |
| --- | --- | --- |
| Shell and navigation | SWebsiteLayout, optional SWebsiteHeader, compact SWebsiteFooter | Use the person’s identity and only useful existing sections/routes. A small one-page site can use section links instead of multiple pages |
| Introduction | SWebsiteHero, centered for text-led content or split when meaningful media exists | Name/profession, concise value or introduction, and one primary action. Media is optional |
| About | SWebsiteSection with app-owned prose, portrait, or relevant links | Keep biography and contact facts supplied by the user or clearly provisional |
| Selected work, when relevant | SWebsiteSection + SGrid + SProjectCard | Use supplied projects and useful destinations; omit when work is not part of the request |
| Writing, when relevant | SWebsiteBlog or SArticleCard inside a section | Use actual article data/routes and avoid adding an unrelated services grid |
| Contact | SWebsiteCta with an actual contact link, or SWebsiteContact when a richer form/details layout is needed | A form requires app-owned validation and delivery handling. Do not add locations for someone with no public office |
| Additional proof or conversion | Optional testimonials, stats, newsletter | Only include content supported by the brief/data and functionality required by the project |

Reuse a fitting variation and replace its app-owned content. Keep its responsive layout and interaction contract. Choose a different supported variant when the content or requested emphasis changes; do not copy the Acme headline, invent records to fill a layout, or add marketing-only sections to every personal site. Keep forms and navigation functional, or explicitly identify a preview when the integration is not part of the scope.

Example outlines:

- Text-led professional profile: hero → about → contact CTA → centered footer.
- Designer with project records: split hero → selected work grid → about → contact CTA → footer.
- Writer with an existing publication backend: introduction → article collection → newsletter → footer.

These outlines are adaptable. Use the user’s requested content, routes, brand direction, and existing project structure. The composition rules distinguish safe page/content adaptation from changes to a shared component’s internal behavior.

## Minimal page composition

The consuming app supplies real navigation destinations and any router adapter. This complete presentation component illustrates the layout/heading/slot wiring; replace its copy and routes with the project’s own values. Import `@sirius-ui/vue/style.css` and `@sirius-ui/website/style.css` once in the app entry, not in every page.

```vue
<script setup lang="ts">
import { SButton, SIcon } from '@sirius-ui/vue'
import { SWebsiteLayout, SWebsiteHeader, SWebsiteHero, SWebsiteFeatures, SWebsiteCta, SWebsiteFooter } from '@sirius-ui/website'

const navigation = [
  { id: 'features', label: 'Features', href: '/features' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]
const features = [
  { id: 'context', title: 'Keep the context', description: 'Give every project a shared starting point.' },
  { id: 'review', title: 'Review together', description: 'Bring feedback close to the work.' },
  { id: 'finish', title: 'Finish clearly', description: 'Make the next handover feel straightforward.' },
]
</script>

<template>
  <SWebsiteLayout main-labelledby="home-title">
    <template #header="{ contentId }">
      <SWebsiteHeader :items="navigation" :content-id="contentId">
        <template #brand><a href="/" aria-label="Acme home">Acme</a></template>
      </SWebsiteHeader>
    </template>
    <SWebsiteHero title-id="home-title" title="A clearer way to work." description="Bring the team and the next step together." variant="centered">
      <template #actions><SButton href="/contact">Start a conversation</SButton></template>
    </SWebsiteHero>
    <SWebsiteFeatures title="Room for your best work" :features="features">
      <template #icon><SIcon name="check" /></template>
    </SWebsiteFeatures>
    <SWebsiteCta title="Ready to make a start?">
      <template #actions><SButton href="/contact">Get in touch</SButton></template>
    </SWebsiteCta>
    <template #footer>
      <SWebsiteFooter variant="centered" :items="navigation">
        <template #bottom>© Acme — replace with your project’s copyright text.</template>
      </SWebsiteFooter>
    </template>
  </SWebsiteLayout>
</template>
```

For Router/Inertia integration, use the app’s documented href-compatible adapter through the relevant linkAs/as props. Preserve href, target, rel, and modified clicks. A native a works without an adapter. Header current and navigationKey must reflect the consuming router when required. The app owns document titles, route success, focus, scroll policy, and rendering/SEO strategy.

## Heading hierarchy

| Context | Heading levels |
| --- | --- |
| Normal landing page | Hero h1; section headings h2; cards/member names h3 |
| A section nested under another section | Parent h2; nested section h3; cards/member names h4 |
| Showcase | Page h1; category h2; example h3; preview section h4; cards/member names h5; grouped FAQ questions h6 |

SWebsiteSection accepts headingLevel 2–4. SProjectCard and SPricingCard accept 3–6, defaulting to 3. Grouped SWebsiteFooter navigation accepts 2–6, defaulting to 2. SWebsiteBlog, SWebsiteTeam, and location-mode SWebsiteContact derive child levels from their own section heading. Standalone hero defaults to h1, so explicitly lower it when embedding an additional hero inside an existing page. Testimonials have a visually hidden section heading that still participates in the hierarchy.

## Forms and requests

SWebsiteContact frames an app-owned form. Compose SForm, SField, SInput, SSelect, and STextarea there rather than assuming a fixed shared contact schema. Reuse the [original enquiry composition](../apps/website/src/components/StudioEnquirySection.vue) as a wiring reference, or the [smaller split-form example](../apps/website/src/components/StudioContactForm.vue). Keep request logic, schema, validation, consent, processing guards, error focus, and completion announcements in the consuming app. Neither demo sends a message.

SWebsiteNewsletter emits a trimmed address and disables its controls when processing. It does not call a service. This complete wrapper delegates the actual request to a required application callback:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { SWebsiteNewsletter } from '@sirius-ui/website'

const props = defineProps<{ subscribe: (email: string) => Promise<void> }>()
const email = shallowRef('')
const processing = shallowRef(false)
const error = shallowRef('')
const status = shallowRef('')

async function submit(address: string) {
  if (processing.value) return
  processing.value = true
  error.value = ''
  status.value = ''
  try {
    await props.subscribe(address)
    status.value = 'Request complete.'
  } catch {
    error.value = 'We couldn’t complete the request. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <SWebsiteNewsletter v-model="email" title="A little inspiration, delivered." variant="simple" :processing="processing" :error="error" :status="status" @submit="submit" />
</template>
```

The callback belongs to the app’s API layer. It must reject on failure, handle the backend’s validation/response format, and follow the app’s authentication/CSRF and request-lifetime conventions. Add the project’s privacy/consent content through the footer slot. Do not copy fictional success messages, addresses, endpoints, or user identities from the previews into a live application. Use project-appropriate confirmation copy for the backend’s actual behavior.

## Data, imagery, and links

Use the exported record types: SWebsiteFeature, SWebsiteStat, SWebsiteTestimonial, SWebsiteBlogPost, SWebsiteContactDetail, SWebsiteContactLocation, and SWebsiteTeamMember. IDs identify records within each list; they are not automatically routes or DOM IDs. Supply complete, localized values and actual destinations. The section components do not fetch, aggregate, localize, or paginate records.

Keep photographic rights and attribution with the app. Demo photos and original illustrated covers are examples, not required package assets. SAvatar supplies initials fallbacks for missing/failed portrait images. Larger image slots should use full-size cover-fit content with meaningful alternatives; repeated avatars beside a person’s name are decorative. An image testimonial uses symmetric vertical insets and no oversized decorative quotation glyph.

SArticleCard/SProjectCard use stretched title links. Keep their cover slots noninteractive. Editorial article category/author links already render as independent targets above the title hit area. Leave href absent for noninteractive category/author metadata. For footer social links, supply the app’s icon components through socialIcon; without it, the labels remain visible.

## Reuse the originals without importing demo internals

The original studio layouts are composed from the same public components. The demo shares these app-owned components between pages and showcase:

| Original pattern | Reference |
| --- | --- |
| Homepage hero and featured work | [StudioHomeHero](../apps/website/src/components/StudioHomeHero.vue) |
| Numbered services and process | [StudioServices](../apps/website/src/components/StudioServices.vue) · [StudioProcessSteps](../apps/website/src/components/StudioProcessSteps.vue) |
| Portfolio grid | [StudioProjectGrid](../apps/website/src/components/StudioProjectGrid.vue) |
| Conversation banner | [StudioConversationCta](../apps/website/src/components/StudioConversationCta.vue) |
| Illustrated journal cards | [StudioArticleGrid](../apps/website/src/components/StudioArticleGrid.vue) |
| Project enquiry | [StudioEnquirySection](../apps/website/src/components/StudioEnquirySection.vue) · [StudioEnquiryForm](../apps/website/src/components/StudioEnquiryForm.vue) |
| Team cards | [StudioTeamCards](../apps/website/src/components/StudioTeamCards.vue) |
| Partnership plans | [StudioPricingPlans](../apps/website/src/components/StudioPricingPlans.vue) |
| Grouped questions | [StudioFaqGroups](../apps/website/src/components/StudioFaqGroups.vue) |
| Grouped footer | [StudioSiteFooter](../apps/website/src/components/StudioSiteFooter.vue) |

Use these files to understand composition. Build the consuming project’s own branding/data wrapper around public exports; do not add imports from the demo app to a production project. Keep model, event, slot, keyboard, and focus contracts intact.

## Verification

Check the page in its actual shell at narrow and wide widths and in both appearances. Confirm long text wraps, media fits, action rows wrap, and controls remain reachable. Check heading order, unique IDs, label/error references, native links, keyboard focus, and relevant pending/error/empty states. Preserve entered drafts across in-page navigation unless the product requires clearing them. See the [agent completion rules](agent-guide.md#completion-criteria) for reporting verification limits.
