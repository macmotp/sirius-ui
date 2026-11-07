# Icon configuration

Sirius components do not depend on Lucide, Heroicons, or another icon package. They request semantic icon names through Vue's app-scoped configuration. Small built-in SVG control glyphs are used when an entry is missing, including when no configuration is installed. Existing icon slots and component-valued props remain supported.

Install only the icon library the consuming application chooses. Use named imports so bundlers can remove unused icons. The two development apps deliberately install both libraries to demonstrate switching; this is not a requirement for consumers.

## App configuration

```ts
import { createApp } from 'vue'
import { createSiriusIcons } from '@sirius-ui/vue'
import { X, Check, ChevronDown, LoaderCircle } from '@lucide/vue'
import App from './App.vue'

createApp(App)
  .use(createSiriusIcons({
    close: X,
    check: Check,
    chevronDown: ChevronDown,
    loading: LoaderCircle,
  }))
  .mount('#app')
```

This example overrides four entries; complete the map below for a consistent icon set. Configure each app separately, including each SSR app. There is no mutable global registry. Components should render one SVG root, inherit currentColor, and forward class, style, SVG/ARIA attributes and events. Icon button names belong on the button, independently of the decorative glyph.

Heroicons exports bare render functions, whose default functional fallthrough forwards only class/style/events. Adapt these to stateful components to preserve all SVG attributes:

```ts
import { defineComponent } from 'vue'
import type { FunctionalComponent } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { createSiriusIcons } from '@sirius-ui/vue'

function heroicon(icon: FunctionalComponent) {
  return defineComponent({ render() {
    return icon({}, { attrs: this.$attrs, slots: this.$slots, emit: this.$emit })
  } })
}

// Install using app.use(...), alongside the other mapped entries.
const icons = createSiriusIcons({ close: heroicon(XMarkIcon) })
```

## Internal names

| Sirius name | Lucide export | Heroicons 24/outline export |
| --- | --- | --- |
| close | X | XMarkIcon |
| check | Check | CheckIcon |
| minus | Minus | MinusIcon |
| chevronDown | ChevronDown | ChevronDownIcon |
| chevronLeft | ChevronLeft | ChevronLeftIcon |
| chevronRight | ChevronRight | ChevronRightIcon |
| loading | LoaderCircle | ArrowPathIcon |
| sortAscending | ArrowUp | ArrowUpIcon |
| sortDescending | ArrowDown | ArrowDownIcon |
| sort | ArrowUpDown | ArrowsUpDownIcon |
| info | Info | InformationCircleIcon |
| success | CircleCheck | CheckCircleIcon |
| warning | TriangleAlert | ExclamationTriangleIcon |
| danger | CircleAlert | ExclamationCircleIcon |
| file | File | DocumentIcon |
| upload | Upload | ArrowUpTrayIcon |
| user | UserRound | UserCircleIcon |
| inbox | Inbox | InboxIcon |
| menu | Menu | Bars3Icon |

`SIconName` types these internal names. `SIconMap` accepts a partial map plus custom names for application icons. An unknown custom name without a mapping produces an empty SVG; it does not fetch an icon or load a library dynamically. Loading animation belongs to the control, rather than the supplied icon component.

## Reactive and scoped overrides

Call `provideSiriusIcons(mapOrRefOrGetter)` during a parent component's setup. It applies to descendants and inherits unspecified entries from any parent provider or app plugin. Pass a computed map to switch sets without remounting controls or resetting their state. Each provider owns its scope; the consuming app owns selection and persistence.

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SIcon, provideSiriusIcons } from '@sirius-ui/vue'
import { lucideIcons, heroiconsIcons } from './icons' // Your application mappings.

const iconSet = shallowRef('lucide')
provideSiriusIcons(computed(() => iconSet.value === 'heroicons' ? heroiconsIcons : lucideIcons))
</script>

<template>
  <button type="button" aria-label="Close panel"><SIcon name="close" class="size-5" /></button>
  <SIcon name="success" label="Complete" class="size-5" />
</template>
```

`SIcon` is decorative by default (`aria-hidden`, `focusable=false`). Set `label` for a standalone meaningful image; the adapter must forward those attributes. Attributes/classes/styles reach the configured SVG. `createSiriusIcon('customName')` creates a Vue component that follows the same provider; use it in navigation, dropdown, breadcrumb and tab data that accept component-valued icons. Consumers can also pass their chosen library components directly.

## Playground examples and future installer

Both adapters and application icon mappings live under `apps/shared/iconSets.ts`; component aliases live in `apps/shared/icons.ts`. They are demonstration code and are not bundled in either shared package. The primitive playground's header and the dashboard's Settings page include an Icon set selector. Switching updates both internal control icons and application icons. Selection survives dashboard page navigation and resets on reload.

A future installer/Builder Skill should ask for the icon set, install that library only, write the application's mapping, and configure createSiriusIcons. There is no installer implemented by this change.
