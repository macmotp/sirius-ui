# @sirius-ui/vue

Reusable Vue 3 components and composables styled with the SiriusUI theme. `SButton`, `SForm`, `SField`, `SInput`, `STextarea`, `SSelect`, `SCheckbox`, `SRadio`, `SSwitch`, `SGrid`, `SCard`, `SBadge`, `SAlert`, `SDialog`, `STagsInput`, `SCombobox`, `SDropdown`, `STabs`, `STooltip`, `SAvatar`, `SSkeleton`, `SDivider`, `SEmptyState`, `SDrawer`, `SAccordion`, `SBreadcrumbs`, `STable`, `SPagination`, `SToast`, `SToaster`, `SProgress`, `SPopover`, and `SFileUpload` are implemented.

The package is a private local workspace and has not been published. It exports ES modules, TypeScript declarations, and compiled CSS without Preflight. External installation instructions will follow when distribution is configured.

## Styling setup

After building the workspaces, consuming applications import components and their CSS:

```vue
<script setup lang="ts">
import { SButton } from '@sirius-ui/vue'
import { Plus } from '@lucide/vue'
import '@sirius-ui/vue/style.css'
</script>

<template>
  <SButton>Continue</SButton>
</template>
```

The CSS export includes shared tokens and component utilities without a reset. Applications do not need Tailwind to use the compiled CSS. Applications own InterVariable font loading, palette selection, and appearance; see [the theme guide](../theme/readme.md).

The playground loads workspace sources and their CSS directly. The library build extracts the stylesheet into `dist/style.css`; consuming applications must import the CSS export explicitly. Vue remains a peer dependency and is excluded from the bundle.

## SButton

An action button or link with full rounding and token-driven styling. It renders a native button by default; supplying `href` renders an anchor. Use the `as` prop for a consuming application’s link component.

| Prop | Values | Default |
| --- | --- | --- |
| `as` | `button`, `a`, or a Vue component | `a` when `href` is supplied; otherwise `button` |
| `href` | String destination | — |
| `color` | `primary`, `success`, `warning`, `danger` | `primary` |
| `variant` | `solid`, `soft`, `outline`, `ghost` | `solid` |
| `size` | `sm`, `md`, `lg` | `md` |
| `type` | `button`, `submit`, `reset` | `button` |
| `disabled` | Boolean | `false` |
| `loading` | Boolean | `false` |
| `fullWidth` | Boolean | `false` |

Solid uses filled role colors with white labels (`text-on-solid`); soft uses subtle backgrounds; outline adds a visible boundary; ghost removes the idle background and border. Primary follows the accent; status colors stay fixed. Hover and active styles apply only when enabled.

Small, medium, and large sizes have minimum heights of 2rem, 2.5rem, and 3rem at the default spacing scale. Long labels wrap; full-width buttons fill their container.

### Slots and events

| API | Behavior |
| --- | --- |
| Default slot | Visible action label |
| `leading` slot | Decorative icon before the label; replaced by the spinner when loading |
| `trailing` slot | Decorative icon after the label |
| `click` event | Emits the original `MouseEvent` once when enabled |

Use SVG icons with a viewBox; slot wrappers size icons to the text. The wrappers are hidden from assistive technology, so meaningful action text must remain in the label. Icon-only buttons will be handled separately.

Native attributes such as `id`, `name`, `value`, `form`, `aria-label`, and `aria-describedby` pass to the button. Classes and styles are forwarded. The default `type="button"` avoids accidental form submission; set `type="submit"` or `type="reset"` explicitly when needed.

```vue
<template>
  <SButton type="submit">Save changes</SButton>
  <SButton color="danger" variant="outline">Delete draft</SButton>
  <SButton variant="ghost" size="sm">Cancel</SButton>
  <SButton loading>Saving changes</SButton>
  <SButton full-width>
    <template #leading>
      <Plus focusable="false" />
    </template>
    Create project
  </SButton>
</template>
```

### Navigation and downloads

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { SButton } from '@sirius-ui/vue'
</script>

<template>
  <SButton :as="Link" href="/users" preserve-scroll>Browse users</SButton>
  <SButton href="/exports/users.csv" download="users.csv" variant="outline">
    Export users
  </SButton>
  <SButton href="https://example.com" target="_blank" rel="noopener noreferrer">
    Open website
  </SButton>
</template>
```

Pass the imported Inertia `Link` itself with `:as="Link"`. SButton renders that component as its root and forwards its attributes and props, including `preserve-scroll`, `replace`, and visit callbacks. There is no nested button and no Inertia dependency in SiriusUI. The supplied component must accept attributes, click listeners, and a default slot, and render a single link root. This adapter is intended for GET navigation; use a native action button and application-owned request handling for mutations.

Use a native anchor for exports so the browser handles the download without an Inertia visit. The `download` attribute follows browser same-origin and server-header rules; the server should return an appropriate content type and Content-Disposition for generated exports. Link activation retains native Enter, modifier-click, and context-menu behavior. `type` applies only to native buttons.

Disabled or loading links render a `span` with `role="link"`, `aria-disabled="true"`, and `tabindex="-1"`, without `href`. A custom link component is unmounted while blocked, preventing its navigation and prefetch handlers from running. When enabled again, it remounts. Loading retains the label and spinner. Applications own loading state and completion announcements. Do not wrap SButton in an anchor or Link; use these root options instead.

### Icons

SiriusUI uses Lucide (`@lucide/vue`) for built-in icons. The loading spinner uses `LoaderCircle`; the playground demonstrates `Plus` and `ChevronRight`. Icons are imported individually so unused icons are excluded from builds. Leading and trailing slots also accept SVG components from Heroicons or another library without changing the button API.

### Accessibility and loading

**Contrast limitation:** solid buttons intentionally use white labels on the existing shade-400 fills. These pairs do not meet WCAG AA's 4.5:1 target for normal-sized text, including the brighter hover/active states. The separate dark `on-primary`/`on-success`/`on-warning`/`on-danger` role foregrounds remain available for swatches and other filled content. Theme contrast tests cover those role pairs, not white solid-button labels. To meet the text contrast target, use darker solid fills or override `--sirius-on-solid` with a suitable dark foreground.

Native buttons provide keyboard activation through Enter and Space and a visible focus outline. Disabled and loading states set the native `disabled` attribute and suppress the component's click event, including programmatic event dispatch. Both states leave the tab order.

Loading sets `aria-busy="true"` and displays a decorative spinner while retaining the label and trailing slot. The component does not manage requests or select loading text. Applications can change the label and use a nearby status region to announce progress or completion.

The spinner animates only when reduced motion is not requested. Color transitions are disabled under reduced motion. Applications must preserve meaningful labels and verify contrast when overriding tokens.

### Playground and tests

The **Buttons** section includes a live configurator and usage example, all 16 color/variant combinations, three sizes, both icon slots, disabled and loading states, an interactive loading action, full-width layouts, and wrapping labels. Native anchor navigation, a sample CSV download, a local custom link adapter, and blocked links demonstrate link behavior. The adapter demo does not run an Inertia application. Global accent, background, and appearance controls apply to every example.

Tests mount the built component through Vue's custom renderer to check native attributes, explicit types, slot updates, disabled/loading click suppression, and event forwarding. CSS export integration is also tested. These tests do not replace browser checks of keyboard behavior, focus, and responsive rendering.

Public types: `SButtonAs`, `SButtonProps`, `SButtonColor`, `SButtonVariant`, and `SButtonSize`.

## SForm, SField, and SInput

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SField, SForm, SInput } from '@sirius-ui/vue'
import '@sirius-ui/vue/style.css'

const name = ref('')
const email = ref('')
const emailError = ref('')
function save() {
  // Validate here, or pass errors from your application (including Inertia).
}
</script>

<template>
  <SForm :columns="2" @submit.prevent="save">
    <SField v-slot="{ control }" label="Full name" required>
      <SInput v-bind="control" v-model="name" name="name" autocomplete="name" />
    </SField>
    <SField v-slot="{ control }" label="Email" description="Your work address" :error="emailError" required>
      <SInput v-bind="control" v-model="email" name="email" type="email" autocomplete="email" />
    </SField>
    <template #actions><SButton type="submit">Save</SButton></template>
  </SForm>
</template>
```

### SForm

A native `form` with a responsive grid. `columns` accepts **1, 2, 3, or 4** (default **1**). All layouts use one column below 640px. Layouts with two or more columns use two columns from 640px; three- and four-column layouts reach their selected count from 1024px. Breakpoints follow Tailwind's defaults unless customized by the consuming build. Direct children occupy one cell; use `SField full-width` or `class="col-span-full"` for a full row. The optional `actions` slot spans every column and wraps buttons as needed.

Native form attributes (`action`, `method`, `autocomplete`, `novalidate`, `id`, accessible names) pass to the form. `submit` and `reset` emit their original DOM events without preventing defaults. Use `@submit.prevent` for app-managed submission. Native constraint validation remains active unless you set `novalidate`. There is no form store, schema validator, request client, or Inertia dependency. Avoid nesting forms.

Resetting native inputs does not reset application state or errors. For controlled models, use `@reset.prevent` to reset your models and error state explicitly, as shown in the playground. Give forms accessible names when they should be exposed as named landmarks.

Public types: `SFormColumns`, `SFormProps`.

### SField

A wrapper for **one labelable control**, with an accessible label and optional description/error.

| Prop | Purpose | Default |
| --- | --- | --- |
| `label` | Visible label text | Required |
| `id` | Control ID and label target | Generated with Vue `useId` |
| `description` | Supporting hint | — |
| `error` | Error text; marks the control invalid | — |
| `required` | Required indicator and native required attribute | `false` |
| `fullWidth` | Span all form columns | `false` |

The default scoped slot exposes `control`: `id`, `required`, `aria-describedby`, and `aria-invalid`. **Bind it to the actual control** using `v-bind="control"`. It works with SInput, native inputs, and compatible third-party controls. The description remains associated alongside the error; absent hints/errors do not produce dangling IDs. Set explicit IDs on SField rather than overriding the control's ID. If you add another description ID, combine it with `control['aria-describedby']` rather than replacing the field's IDs.

Errors are displayed and associated; SField does not validate or move focus. Applications decide when to show errors, announce submission results, and focus an invalid control. Use a fieldset and legend for groups such as radio options rather than putting several inputs under one SField label.

Public types: `SFieldProps`, `SFieldControl`.

### SInput

A fully rounded, borderless native input with an extra-small shadow, a 1px inset ring, and decorative icon slots. The medium size uses `py-1.5` (36px high at the default scale); small and large sizes use `py-1` and `py-2` respectively (28px and 44px high).

| Prop | Values | Default |
| --- | --- | --- |
| `v-model` | String value (`modelValue` / `update:modelValue`) | Empty string |
| `type` | `text`, `email`, `password`, `search`, `tel`, `url`, `date`, `time`, `datetime-local`, `month`, `week`, `number`, `color`, `range` | `text` |
| `size` | `sm`, `md`, `lg` | `md` |
| `disabled` | Native disabled state | `false` |
| `readonly` | Native readonly state | `false` |
| `invalid` | Invalid styling and `aria-invalid` | `false` |
| `valid` | Green-500 success ring, including on focus | `false` |

The idle ring uses the selected neutral at shade 300; placeholders use shade 400. Inputs are white with dark text in light mode and use selected neutral 600 at 80% with white text in dark mode. Focus replaces the ring color with the selected accent at shade 500 in light mode and 400 in dark mode. These colors come from shared `control` tokens, ready to reuse for selects.

SInput also styles invalid states passed via `aria-invalid` by SField. Set `valid` after application validation succeeds (for example, `<SInput v-model="email" valid />`). It is an explicit visual state, not automatic browser validation, and does not add a nonexistent `aria-valid` attribute. Invalid styling, including `aria-invalid` from SField, takes priority over valid styling. Use a linked hint or status message when the successful validation needs to be communicated beyond color. `input`, `change`, `focus`, and `blur` forward the original events. Text composition defers model updates until commit; native input/change events forward unchanged. All types emit strings from the native input's `.value`, including number and range inputs. Clearing a number emits `''`, not zero or NaN. Component v-model modifiers are not part of this API; convert values explicitly when needed.

Native attributes, labels, descriptions, `name`, `form`, `autocomplete`, `placeholder`, `required`, `maxlength`, and other constraints pass to the **input**. `class` and `style` apply to the outer container for layout. `size` controls the visual size rather than the native character-width attribute. Provide an accessible label with SField or native labeling attributes when used alone.

The `leading` and `trailing` slots are decorative and hidden from assistive technology. Supply SVG icons (for example Lucide's Mail or Search); do not put interactive controls inside these slots. Disabled inputs leave the tab order and form data; readonly inputs remain focusable and submit their values. Focus is indicated by the 1px inset ring around the full input container; valid and invalid states use fixed green-500 and red-500 rings in both appearances, including on focus (`ring-control-valid` / `ring-control-invalid`). The component does not generate a name, persist values, or own validation.

Public types: `SInputProps`, `SInputSize`, `SInputType`.

#### Native dates, times, numbers, and colors

Set `type` to use the browser's native control. SInput does not implement a calendar, parse timezones, hide number spinners, or replace the native picker. Picker UI, localized display, and support vary by browser and operating system; unsupported types can fall back to text. The surrounding theme styling and validation rings stay consistent.

| Type | Model example | Native options |
| --- | --- | --- |
| `date` | `'2026-10-28'` | `min`, `max`, `step` (days) |
| `time` | `'09:30'` or `'09:30:15'` | `min`, `max`, `step` (seconds) |
| `datetime-local` | `'2026-10-28T09:30'` | `min`, `max`, `step` (seconds); no timezone |
| `month` | `'2026-10'` | `min`, `max`, `step` (months) |
| `week` | `'2026-W44'` | `min`, `max`, `step` (weeks) |
| `number` | `'12.30'` or `''` | `min`, `max`, `step`, `inputmode` |
| `color` | `'#2dd4bf'` | Browser-native color picker |
| `range` | `'50'` | `min`, `max`, `step`; browser-native slider |

Date and time values are native strings, not JavaScript Date objects. Date/time presentation can be localized while the model retains the native format. `datetime-local` carries no timezone information; applications decide how to interpret it. Native constraints follow HTML's rules and do not automatically set the component's `invalid`/`valid` props. Placeholders and readonly/required attributes only apply to types that support them. Color and range controls do not support readonly. Give them a label like any other control.

Initialize color and range models with valid values; their native controls have browser defaults and cannot represent an empty selection. `color` uses a hex string for broad browser support. Range defaults to 0–100 with step 1 when constraints are omitted. The color swatch and range track use a size-matched native height inside the rounded input shell.

There is no native `currency` type. For a decimal amount, use `type="number" inputmode="decimal" step="0.01"`, put the currency in the field label, and format a separate preview in the application. SInput preserves the native string value and does not insert currency symbols or grouping separators into the editable value.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SField, SInput } from '@sirius-ui/vue'

const date = ref('2026-10-28')
const time = ref('09:30')
const amount = ref('1250.50')
const color = ref('#2dd4bf')
</script>

<template>
  <SField v-slot="{ control }" label="Date"><SInput v-bind="control" v-model="date" type="date" /></SField>
  <SField v-slot="{ control }" label="Time"><SInput v-bind="control" v-model="time" type="time" step="60" /></SField>
  <SField v-slot="{ control }" label="Amount (SGD)"><SInput v-bind="control" v-model="amount" type="number" inputmode="decimal" min="0" step="0.01" /></SField>
  <SField v-slot="{ control }" label="Color"><SInput v-bind="control" v-model="color" type="color" /></SField>
</template>
```

Native behavior is defined by the [HTML input standard](https://html.spec.whatwg.org/dev/input.html). File, checkbox, and radio inputs use different value APIs and are outside SInput's string-value contract.



### STextarea

A native multiline text control with the same size scale, fill, inset ring, shadow, focus colors, and validation priority as SInput. Its corners use `rounded-2xl` and `--sirius-radius-2xl`, suited to multiline content.

| Prop | Values | Default |
| --- | --- | --- |
| `v-model` | String value | Empty string |
| `size` | `sm`, `md`, `lg` | `md` |
| `rows` | Positive number of visible text lines | `3` |
| `resize` | `none`, `vertical`, `horizontal`, `both` | `vertical` |
| `disabled`, `readonly`, `invalid`, `valid` | Boolean states, as on SInput | `false` |

Native attributes, `class`, and `style` apply directly to the textarea. Pass `name`, `autocomplete`, `placeholder`, `required`, `maxlength`, `minlength`, `wrap`, and `form` as needed. `input`, `change`, `focus`, and `blur` forward the original events. Vue's native textarea v-model directive handles text composition. Disabled textareas leave the tab order and form data; readonly textareas remain focusable and submit their values. `rows` sets the initial height; resizing follows the selected mode. Horizontal resizing can extend beyond the container, so vertical is the default. No icon or content slots are provided.

Public types: `STextareaProps`, `STextareaSize`, `STextareaResize`.

### SSelect

A native **single-select** with full control rounding and the same input styling, size scale, focus colors, and validation states. Its decorative Lucide chevron does not intercept clicks. Browser and operating-system behavior determine the popup menu's rendering and keyboard interactions.

| Prop | Values | Default |
| --- | --- | --- |
| `v-model` | String option value | Empty string |
| `options` | Readonly array of `{ value: string, label: string, disabled?: boolean }` | Empty array |
| `placeholder` | Text for the disabled empty option | `Select an option` |
| `size` | `sm`, `md`, `lg` | `md` |
| `disabled`, `invalid`, `valid` | Boolean states, as on SInput | `false` |

Use unique, non-empty string option values; the empty string is reserved for the placeholder. The placeholder is initially selected when the model is empty and cannot be chosen again by the user. Reset the model to `''` to clear the selection programmatically. Initial selections are rendered on the server as well as in the browser. A required select with the empty placeholder is invalid under native form validation; `valid`/`invalid` visual states are still application-controlled.

Native attributes (`id`, `name`, `form`, `required`, `autocomplete`, `aria-*`) apply to the select. `class` and `style` apply to its wrapper. The `input`, `change`, `focus`, and `blur` events forward the original DOM event. `size` is the visual size, not the native listbox size attribute. Disabled options retain native behavior. This API uses the options array and has no slots, optgroups, multiple selection, searchable menu, or readonly state. To prevent editing, use disabled; disabled selects are omitted from form data. Applications own model resets and validation.

Public types: `SSelectProps`, `SSelectSize`, `SSelectOption`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SField, SForm, SSelect, STextarea } from '@sirius-ui/vue'

const department = ref('')
const notes = ref('')
const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'archived', label: 'Archived', disabled: true },
]
</script>

<template>
  <SForm :columns="2" @submit.prevent>
    <SField v-slot="{ control }" label="Department" required>
      <SSelect v-bind="control" v-model="department" name="department" :options="options" placeholder="Choose a department" />
    </SField>
    <SField v-slot="{ control }" label="Notes" full-width>
      <STextarea v-bind="control" v-model="notes" name="notes" :rows="4" resize="vertical" placeholder="Add a note…" />
    </SField>
  </SForm>
</template>
```

Both controls consume SField's `control` attributes; bind them to preserve label and hint/error associations. Invalid styling (including SField's `aria-invalid`) takes priority over valid styling. They share the fixed green-500 and red-500 rings, including on focus. Neither component initiates requests or validates values itself. Import `@sirius-ui/vue/style.css` once as described above.

### Forms showcase and verification

The **Forms** section demonstrates the form components together, a live input configurator, column selection, a full-width field and actions, error/hint associations, long labels, three sizes, icons, and native disabled/readonly/password behavior. Textarea and select examples include live sizes and states, textarea rows and resizing, native option placeholders, disabled options, and multiline model values. The profile demo composes all three control types. Its custom validation and reset handlers belong to the playground. The earlier Interaction section intentionally retains native fields as a theme-only comparison.

Built-package SSR tests check unique IDs, label/hint/error associations, native attribute forwarding, form structure, multiline textarea output, and select placeholders and initial selections. Browser verification covers real typing, validation focus, keyboard interaction, native form behavior, and responsive layout; SSR tests alone cannot establish these behaviors.

## SCheckbox, SRadio, and SSwitch

Native choice inputs with theme-aware fills, visible keyboard focus, three sizes, and the same green-500/red-500 validation rings as other form controls. Checked controls use the selected accent with white indicators. Checkboxes are fully round; radio dots fill half the control diameter, and switch thumbs stay white in both states. The off switch track uses neutral 300 in light mode and the neutral control fill in dark mode to keep the thumb visible. Each control includes an optional label, hint, and error, so it normally does not need an SField wrapper.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SCheckbox, SRadio, SSwitch } from '@sirius-ui/vue'

const accepted = ref(false)
const delivery = ref('standard')
const notifications = ref(true)
</script>

<template>
  <SCheckbox v-model="accepted" name="accepted" value="yes" label="Accept updates" description="Send me the requested updates." />
  <fieldset>
    <legend>Delivery method</legend>
    <SRadio v-model="delivery" name="delivery" value="standard" label="Standard delivery" />
    <SRadio v-model="delivery" name="delivery" value="express" label="Express delivery" />
  </fieldset>
  <SSwitch v-model="notifications" name="notifications" value="enabled" label="Enable notifications" />
</template>
```

### Common props and events

| Prop | Purpose | Default |
| --- | --- | --- |
| `id` | Native input ID and label target | Generated with Vue `useId` |
| `label` | Visible label text | — |
| `description` | Hint associated through `aria-describedby` | — |
| `error` | Associated error text and invalid state | — |
| `size` | `sm`, `md`, `lg` | `md` |
| `disabled` | Native disabled state | `false` |
| `required` | Native requirement and visible indicator | `false` |
| `invalid`, `valid` | Red/green ring states | `false` |

`error`, `invalid`, and truthy `aria-invalid` take priority over `valid`. Validation colors remain visible when checked and on focus. The components do not validate values or announce request results automatically; applications own error timing and submission handling.

The optional default slot replaces the label text. Keep label content non-interactive. Labels wrap naturally; descriptions and errors remain linked alongside any application-provided `aria-describedby` IDs. Without label text or a label slot, provide `aria-label`, `aria-labelledby`, or an external label. For example, an SField can supply its `control` attributes to a choice input with no internal label. Do not render duplicate labels unnecessarily, and use a fieldset/legend to name a radio or checkbox group.

Native attributes such as `name`, `value`, `form`, and `aria-*` go to the actual input. `class` and `style` apply to the outer layout wrapper. `input`, `change`, `focus`, and `blur` forward original DOM events. Model updates occur on native `change`; disabled controls suppress model changes and component change events. There is no readonly state. They inherit the browser's native keyboard and form behavior, without custom keyboard interception. Use disabled to prevent interaction.

### SCheckbox

`v-model` is **boolean**, default `false`. Use individual boolean models or application-owned selection logic for groups; array models and true-value/false-value conversions are not part of this API. `name`/`value` control native form serialization: an enabled checked checkbox is included, an unchecked one is omitted. Without an explicit value the browser uses `on`.

`indeterminate` is a separate visual/native property, default `false`. It sets `aria-checked="mixed"` and displays a minus. It does not change the boolean checked value or determine form serialization. Use `v-model:indeterminate` to clear a controlled mixed state on activation, or derive it from group selection as the playground does. Checkbox changes emit `update:indeterminate(false)` when the mixed state is active.

```vue
<SCheckbox v-model="allSelected" :indeterminate="partiallySelected" label="Select all" />
```

Space toggles the checkbox; clicking its label activates the same native input. Public type: `SCheckboxProps`.

### SRadio

`v-model` is a **string**, default `''`. `name` and `value` are required props. Give every radio in one group the same name and shared model, with distinct values. Use a distinct name for unrelated groups. Only the selected radio contributes its value to form data. A radio updates the model when becoming checked, not when becoming unchecked.

Native radio groups use Tab and arrow-key navigation. A `required` radio requires a selection in its native group; group errors should be presented with a fieldset/legend and associated description/error IDs rather than placing the whole group under a single SField label. Public type: `SRadioProps`.

### SSwitch

`v-model` is **boolean**, default `false`. The control is a native checkbox with `role="switch"` and a synchronized `aria-checked` value. It uses checkbox form semantics (`name`/`value` are included only when on). Use it for an on/off setting; it has no mixed state. The label should describe the setting and remain stable when toggled.

Space toggles the switch. Thumb motion respects reduced-motion preferences and logical positioning supports RTL layouts. A `required` switch must be on for native validation to pass. Public type: `SSwitchProps`.

### Choices showcase and tests

The **Choices** section includes a live size/state configurator, checked and unchecked examples, a select-all/mixed checkbox, named radio groups, three sizes, long labels, disabled controls, and a native form-data preview with application-owned reset and validation. It follows the global accent, background, and appearance selection.

Built-component tests cover model values, indeterminate updates, native grouping, attribute/event forwarding, accessibility associations, validation priority, and disabled change suppression. Native keyboard interaction, focus, form serialization, and layout also require browser checks. Controlled models and errors should be reset explicitly by the application with `@reset.prevent`, as in the form showcase.

Shared public types: `SChoiceProps`, `SChoiceSize`.

## Implementation conventions

Use Vue single-file components with TypeScript and `<script setup lang="ts">`. Public names use the `S` prefix; exports belong in `src/index.ts`. Document props, events, slots, and relevant states, with corresponding playground examples. Use semantic theme tokens. Routing, API calls, application stores, and preference persistence belong to consuming apps.

## Local development

From the repository root:

```sh
npm run dev
npm run check
```

The first command serves the playground with live updates. The second checks workspace types, builds the packages and playground, and runs theme and component tests.

See [the contributor guide](../../CONTRIBUTING.md), [architecture](../../docs/architecture.md), and [theme guide](../theme/readme.md).


## SGrid

A full-width CSS grid with equal columns and a default gap of 6 (1.5rem). `columns` accepts **1, 2, 3, 4, or 6**, default 1. Children stay in document order; their minimum width is zero so long content can wrap. The grid fills its parent, without forcing a viewport width.

| Columns | Below 640px | 640px+ (sm) | 1024px+ (lg) | 1280px+ (xl) |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 |
| 2 | 1 | 2 | 2 | 2 |
| 3 | 1 | 2 | 3 | 3 |
| 4 | 1 | 2 | 4 | 4 |
| 6 | 1 | 2 | 3 | 6 |

```vue
<SGrid :columns="3">
  <SCard v-for="item in items" :key="item.id">{{ item.title }}</SCard>
</SGrid>
```

Use responsive span classes on children for unequal layouts, for example `class="sm:col-span-2"`. Layout props do not change the native div semantics. Public types: `SGridProps`, `SGridColumns`.

## SCard

A neutral surface with 2xl corners, padded content, and an inset ring. Slots: `header`, default (body), and `footer`; empty slots add no wrappers. The header and footer have horizontal padding and outer vertical padding; the body has padding on every side. Supply your own headings and semantic regions through content/attributes.

`bento` accepts a corner or an array of corners: `top-left`, `top-right`, `bottom-left`, `bottom-right`. Selected corners use `--sirius-radius-4xl` (2rem); other corners use `--sirius-radius-2xl` (1.5rem). Omit it or pass an empty array for an ordinary card. Corners are physical and do not flip in RTL. There is no automatic grid-position detection.

```vue
<SCard :bento="['top-left', 'bottom-right']">
  <template #header><h2>Workspace</h2></template>
  <p>Your workspace content.</p>
  <template #footer><SButton>Open workspace</SButton></template>
</SCard>
```

The non-interactive overlay ring inherits all four radii and remains visible above child backgrounds. Content is not clipped, preserving focus outlines and popovers; apply clipping to your own media wrapper if needed. Public types: `SCardProps`, `SCardCorner`.

## SBadge

A non-interactive inline label for statuses and counts. Props: `color` (`primary`, `success`, `warning`, `danger`, default primary), `variant` (`soft`, `solid`, `outline`, default soft), and `size` (`sm`, `md`, `lg`, default md). Colors follow the existing theme roles; solid badges use the role's dark `on-*` foreground.

```vue
<script setup lang="ts">
import { Check, Sparkles } from '@lucide/vue'
import { SBadge } from '@sirius-ui/vue'
</script>

<template>
  <SBadge color="success"><template #leading><Check /></template>Published</SBadge>
  <SBadge variant="outline">Preview<template #trailing><Sparkles /></template></SBadge>
  <SBadge variant="solid" size="sm">12 items</SBadge>
</template>
```

The default slot provides the label. Leading/trailing icon slots are decorative (`aria-hidden`) and SVGs inherit the icon size. Always include meaningful text; do not put interactive controls in icon slots. A badge adds no button or live-region semantics. For changing statuses, place it in an application-owned live region if an announcement is needed. Public types: `SBadgeProps`, `SBadgeColor`, `SBadgeVariant`, `SBadgeSize`.


## SAlert

Inline feedback using the four theme colors. `color` is `primary` (default), `success`, `warning`, or `danger`. `variant` is `soft` (default), `solid`, or `outline`. Solid alerts pair the role fill with its dark `on-*` foreground. All treatments use 2xl corners and wrap long content.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SAlert, SButton } from '@sirius-ui/vue'
const visible = ref(true)
</script>

<template>
  <SAlert v-model:open="visible" color="success" title="Changes saved" dismissible>
    You can continue working.
  </SAlert>
  <SButton v-if="!visible" @click="visible = true">Show message again</SButton>
</template>
```

| Prop | Default | Purpose |
| --- | --- | --- |
| `title` | Unset | Optional title text; the title slot overrides it |
| `icon` | `true` | Show the color's Lucide icon or custom icon slot |
| `dismissible` | `false` | Show a native button that closes the alert |
| `dismissLabel` | `Dismiss alert` | Accessible dismiss button name; localize as needed |
| `role` | `status` | Polite status announcement; choose `alert` explicitly for urgent messages |
| `open` / `v-model:open` | `true` | Visibility; closed alerts unmount their content |

Slots: default (message), `title`, `icon`, and `actions`. The icon slot is decorative and hidden from assistive technology, so provide the meaning in text. The actions slot is a wrapping row for application-owned buttons or links. There are no automatic timers or network actions.

Dismissal sets `open` to false and emits `dismiss` with the original MouseEvent. Without a bound open prop, visibility is managed internally; with `v-model:open`, the parent can restore it. If you bind `:open` without updating it, the parent remains in control. The close button uses `type="button"`, so dismissing inside a form does not submit it. Applications should move focus to a suitable surviving control when a focused dismiss button is removed.

`role="status"` and `role="alert"` imply polite and assertive live announcements respectively; both use `aria-atomic="true"`. Color does not automatically choose urgency. For reliable routine announcements, mount an empty alert region first, then update its content. Initial server-rendered status content or a newly mounted status may not be announced by every screen reader. Avoid competing live regions and do not put long forms in alerts.

```vue
<SAlert color="danger" role="alert" title="Save failed">
  Your draft is still available.
  <template #actions><SButton size="sm" @click="retry">Try again</SButton></template>
</SAlert>
```

The **Alerts** playground includes all colors, three treatments, custom/no icons, action links, title slots, a dismiss/reopen demo, and an update inside an existing live region. Public types: `SAlertProps`, `SAlertColor`, `SAlertVariant`.


## SDialog

A native modal `<dialog>` opened with `showModal()`. The browser supplies the top layer, modal focus containment, inert background, and focus restoration to the opener. No portal is required, so theme tokens follow the dialog's location in the document. Requires browser support for native dialog; no polyfill is bundled. The component safely renders a hidden shell on the server, then opens an initially true model after mounting.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SDialog } from '@sirius-ui/vue'
const open = ref(false)
</script>

<template>
  <SButton @click="open = true">Workspace details</SButton>
  <SDialog v-model:open="open" title="Workspace details" description="Review your workspace settings.">
    <p>Your content goes here.</p>
    <template #footer><SButton @click="open = false">Done</SButton></template>
  </SDialog>
</template>
```

| Prop | Default | Purpose |
| --- | --- | --- |
| `open` / `v-model:open` | `false` | Modal visibility; closed dialogs unmount slot content after the exit animation |
| `title`, `description` | Unset | Accessible title and optional description; corresponding slots override text |
| `size` | `md` | Maximum width: sm 24rem, md 32rem, lg 42rem, xl 56rem |
| `showClose` | `true` | Show the header's close button |
| `closeLabel` | `Close dialog` | Accessible close button name; localize as needed |
| `closeOnEscape` | `true` | Allow native Escape requests to update the model |
| `closeOnBackdrop` | `true` | Allow a pointer interaction that begins and ends outside the panel to update the model |

Slots: `title`, `description`, default (body), `footer`. The footer wraps action buttons and aligns them to the end. The dialog uses white with a neutral-200 border in light mode, and selected neutral 950 with a neutral-800 border in dark mode. It has 2xl corners, 1.5rem padding, and a large shadow. The overlay uses selected neutral 500 at 75% in light mode and 700 at 75% in dark mode. It fits within the viewport with 1rem of space on each side and scrolls internally for long content. `data-state` is open or closed: the panel fades and moves/scales slightly on entry (180ms) and exit (140ms), while the backdrop fades. Reduced-motion preferences reduce animation to 1ms. Modal state and content remain mounted through exit, then focus is restored; reopening during exit cancels closure.

A generated ID associates the title and description with the dialog. External `aria-describedby` IDs are merged with the generated description ID. Explicit `aria-labelledby` overrides the generated title reference. Without a title, supply `aria-label` or `aria-labelledby`. Keep title/description slots descriptive rather than interactive.

Use `autofocus` on a native control or `SInput` to select initial focus; confirmation examples focus the safe cancel action. For long content, a static element with `tabindex="-1" autofocus` can receive initial focus. Let the browser handle Tab and Shift+Tab; the component does not implement a competing keyboard trap. Always leave an operable way to close when disabling Escape/backdrop or hiding the close button. Native focus restoration assumes the opener still exists and is focusable; applications own an alternative destination if it is removed.

`dismiss` emits a reason (`escape`, `backdrop`, `close-button`) when the user requests dismissal. It updates `open` to false. `close` emits the original native Event when the modal actually closes, including a programmatic model change or native `method="dialog"` form. Bound models must be updated by the parent; refusing a dismissal update keeps a controlled dialog open. Changing `open` programmatically does not emit `dismiss`. A queued close event from a previous opening is ignored if the dialog has already reopened.

Use `SForm @submit.prevent` for application-managed forms; submission does not close the dialog automatically. Buttons in the footer can target an inner form through their native `form` attribute. Avoid mounting the component inside another form if its content contains a form. Draft values, validation, async requests, pending-state dismissal rules, and success behavior belong to the application. The Dialogs playground demonstrates an invalid submit, successful save, confirmation, long content, and dismissal options.

Public types: `SDialogProps`, `SDialogSize`, `SDialogDismissReason`.


## STagsInput

A string-array editor using the shared input treatment and validation colors. Enter or comma adds a trimmed tag; pasting comma/newline-separated text adds multiple tags. Duplicate checks are case-insensitive. Spaces within tags are preserved. Uncommitted text remains in the editor on blur and is not submitted.

```vue
<SField v-slot="{ control }" label="Tags">
  <STagsInput v-bind="control" v-model="tags" name="tags[]" :max-tags="8" />
</SField>
```

Props: `size` (sm/md/lg, default md), `disabled`, `readonly`, `valid`, `invalid`, `required` (all false), optional `maxTags`, `placeholder` (default “Add a tag…”), and `requiredMessage` (default “Add at least one tag.”). At the limit, additional entries are ignored and a message is announced; pasted lists add entries up to the limit. The `tag` slot receives `{ tag, index }` for non-interactive custom labels.

Each tag has an accessible remove button. Backspace in an empty editor focuses the last remove button; Enter/Space, Delete, or Backspace on that button removes the tag and restores input focus. Readonly hides removal controls. Disabled prevents editing and removal. IME composition does not commit Enter prematurely. Add/remove feedback uses a polite live region.

`name`/`form` generate a hidden input for each committed tag. Use `tags[]` if your server expects that array convention. The editor receives native attributes (`id`, `aria-describedby`, `maxlength`, etc.); class/style affect the wrapper. Required validates committed tags through the native constraint API; localize `requiredMessage` as needed. Events: `add(tag)`, `remove(tag)`, `change(tags)`, and original focus/blur events. The application owns controlled form reset. Public type: `STagsInputProps`.

## SCombobox

A searchable single-value select with a string model (default empty). It owns its listbox without requiring a dropdown component. Options have unique, non-empty string `value`s and a plain-text `label`, plus optional `disabled` and `keywords`. Filtering matches label, value, or keywords using a case-insensitive substring. Extra option data is preserved and typed through generic slots.

```vue
<SCombobox v-model="icon" :options="icons" name="icon" clearable>
  <template #leading="{ option }">
    <component :is="option.icon" v-if="option" />
  </template>
  <template #option="{ option, selected, active }">
    <span class="flex items-center gap-3">
      <component :is="option.icon" aria-hidden="true" class="size-5" />
      {{ option.label }}
    </span>
  </template>
</SCombobox>
```

Slots: `option` receives `{ option, selected, active }`, `leading` receives the currently selected option (or undefined), and `empty` replaces empty-results text. Keep options non-interactive with readable labels and decorative icons. The leading slot is aria-hidden. The selected label is displayed as input text; arbitrary option markup stays in the list.

Typing filters without changing the stored selection. Enter commits the active option; Escape or blur cancels the search and restores the selected label. Arrow keys open/navigate, skipping disabled options. Home/End navigate an open list; Tab closes without selecting. Escape stops propagation only while the popup is open, allowing use inside SDialog. The arrow button toggles the popup while retaining focus in the editor. No custom text values are accepted.

Props: `size`, `disabled`, `readonly`, `valid`, `invalid`, `required`, `clearable` (default false), `placeholder` (default “Search options…”), `emptyText` (“No options found.”), `clearLabel` (“Clear selection”), and `requiredMessage` (“Select an option from the list.”). Use SField or an explicit accessible label. Required validates the selected option through native constraint validation, even when the search contains text. `name`/`form` serialize the stored value through a hidden input, not the query. Disabled values are omitted; empty selection submits an empty string. Events: `change(value)` on selection/clear, and original focus/blur events.

The list is positioned below its wrapper with a maximum height and scrolling. Ancestor overflow clipping applies. Closed lists stay in the DOM but hidden. Remote fetching, virtualization, multi-selection, and form-reset policy belong to the application. Public types: `SComboboxProps<T>`, `SComboboxOption`.

### Range appearance

`SInput type="range"` retains native string values and keyboard/form behavior. The wrapper is transparent, without a field ring or shadow. The selected track uses the accent; the remaining track uses selected neutral 300 in light mode / 600 in dark mode. The white thumb grows with sm/md/lg (20/24/28px before borders). Keyboard focus outlines the thumb rather than the entire field; valid/invalid states also color the thumb. Separate WebKit/Blink and Firefox pseudo-elements style the track and thumb. Fill progress respects min/max and RTL direction.


## SDropdown

An action menu with an SButton trigger, keyboard navigation, native links, and optional icons. It uses the shared popup surface (white/neutral-950), border, and 2xl corners. Use SSelect or SCombobox for choosing a stored value; use SDropdown for actions and navigation.

```vue
<script setup lang="ts">
import { Pencil, Archive } from '@lucide/vue'
import { SDropdown } from '@sirius-ui/vue'
const items = [
  { id: 'edit', label: 'Edit details', icon: Pencil },
  { id: 'browse', label: 'Browse projects', href: '/projects' },
  { id: 'archive', label: 'Archive', icon: Archive, separatorBefore: true },
]
function handleAction(item) {
  if (item.id === 'edit') { /* Open an application-owned dialog. */ }
}
</script>

<template><SDropdown label="Workspace actions" :items="items" @select="handleAction" /></template>
```

Props: `items` (default empty), `label` (Actions), `disabled` (false), `align` (start/end, default end), `size` (SButton sm/md/lg, default md), `variant` (SButton variants, default outline), and optional `v-model:open` (default false). Without a bound model, visibility is internal. Controlled parents must accept updates for dismissal to close the menu.

Each item requires a unique `id` and a plain-text `label`. Optional fields: `icon` (Vue component), `href`, `target`, `rel`, `disabled`, `danger`, and `separatorBefore`. Items with href render native anchors; action items render type-button buttons. Disabled items are inert spans with aria-disabled, no destination, and no tab stop. New-tab links default to noopener/noreferrer when rel is absent. Navigation and actions remain application-owned; native links do not perform Inertia navigation automatically.

Slots: `trigger` replaces the trigger's label content; `icon({ item })` replaces decorative icons; `item({ item, active })` replaces item label content. Keep these slots non-interactive and provide text for an accessible name. Do not put buttons or links inside them. Icon wrappers are aria-hidden. Plain item labels support typeahead even with custom content.

Click, Enter, or Space opens the menu at the first enabled item; ArrowDown/ArrowUp opens at the first/last enabled item. Arrow keys wrap and skip disabled items; Home/End jump to the edges. Typing searches labels with a short prefix buffer. Enter/Space activates an item. Escape closes and restores trigger focus; Tab/Shift+Tab close and continue normal tab navigation. Clicking or focusing outside dismisses without moving focus back. When all entries are disabled, the menu panel receives focus so Escape and Tab remain available.

`select(item, event)` emits the item and original MouseEvent. The menu then closes and restores focus. Calling event.preventDefault() in the handler prevents native navigation and leaves the menu open. Action handlers may open an application dialog or run a request; pending state, confirmations, authorization, and error feedback belong to the application.

The popup is positioned relative to its wrapper, aligned using logical start/end, shifted within horizontal viewport bounds, and flipped upward when there is more room above. It updates on resize/scroll, has a maximum height, and scrolls internally. Ancestor overflow clipping and stacking contexts still apply; no portal is used. Submenus and checkbox/radio menu items are not part of this component.

The Dropdowns playground includes icons, separators, disabled actions, a link, custom badges, different trigger styles, alignment, and an all-disabled menu. Public types: `SDropdownProps`, `SDropdownItem`.


## STabs

Related local views with a string model, native tab buttons, and associated panels. Each item has a unique, non-empty string `value`, a plain-text `label`, and optional `icon` (Vue component) and `disabled`. Additional item data is preserved through generic slots.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STabs } from '@sirius-ui/vue'
const selected = ref('overview')
const items = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings', disabled: true },
]
</script>

<template>
  <STabs v-model="selected" :items="items" label="Workspace views">
    <template #panel="{ item }">
      <Overview v-if="item.value === 'overview'" />
      <Activity v-else-if="item.value === 'activity'" />
    </template>
  </STabs>
</template>
```

| Prop | Default | Purpose |
| --- | --- | --- |
| `items` | Empty array | Tab definitions |
| `v-model` | Empty string | Selected value; no binding is needed for internal selection |
| `label` | Tabs | Accessible name for the tablist; make it specific when several groups exist |
| `variant` | line | line or pills |
| `orientation` | horizontal | horizontal or vertical |
| `activation` | automatic | automatic selects on arrow navigation; manual waits for Enter/Space or a click |
| `size` | md | sm/md/lg label padding and text size |
| `keepAlive` | false | Keep all inactive panel contents mounted but hidden |

When the model is empty, missing, or refers to a disabled item, the first enabled tab is displayed. This fallback does not rewrite the parent model or emit an initial change. To keep the parent value synchronized from the start, initialize it to an enabled item value. With no enabled items, there is no selected panel or tab stop.

Left/Right navigate horizontal tabs (reversed in RTL); Up/Down navigate vertical tabs. Navigation wraps and skips disabled entries. Home/End focus the first/last enabled tab. In automatic mode, focus movement also changes selection. Manual mode keeps the current panel until Enter/Space activates the focused tab. Tab leaves the tablist for the selected panel rather than stopping on every tab. Returning to the tablist enters at the selected tab. Disabled tabs cannot be activated.

Slots: `tab({ item, selected })` replaces label content; `panel({ item, index })` renders panel content; the default slot can be used as a fallback for panel. Keep custom tab content non-interactive with readable text. Item icons are decorative and aria-hidden. Attribute/class/style fallthrough applies to the outer wrapper. `change(value)` emits on user selection when it changes the model; external model updates and fallback selection do not emit it.

Every tab uses generated unique IDs linked to its panel with aria-controls/aria-labelledby. Inactive panels are hidden; by default their slot content unmounts. `keepAlive` preserves local component state by mounting all panels from the start; hidden forms still exist in the DOM and can participate in native form validation/submission, so manage form boundaries accordingly. Application-owned state can also preserve drafts independently of this prop.

Horizontal lists scroll when labels exceed available width. Vertical lists remain vertical on narrow screens, stacking above their content until there is room for a side-by-side layout. Tabs switch local content; use navigation links for page routing. Async loading, URL synchronization, and application state belong to the consumer. For expensive content, prefer manual activation.

The Tabs playground demonstrates both styles/orientations, manual/automatic activation, icons, badge labels, disabled tabs, model changes, and a draft field with optional persistence. Public types: `STabsProps<T>`, `STabsItem`, `STabsSize`.


## STooltip

Short contextual descriptions for one focusable trigger. The scoped default slot supplies `trigger` bindings: apply them to the actual button/link/control so the description and keyboard/focus handlers reach the element, rather than making an extra focus stop.

```vue
<STooltip v-slot="{ trigger }" text="Create a copy of this workspace.">
  <SButton v-bind="trigger">Duplicate workspace</SButton>
</STooltip>
```

Props: `text` (default empty), `placement` (top/bottom/left/right, default top), `delay` (hover delay in milliseconds, default 300), `disabled` (false), and `describedBy` (optional existing description IDs to merge). The `content` slot replaces text with short, non-interactive markup. Trigger bindings are typed as `STooltipTrigger`.

Focus opens immediately; hover opens after the configured delay. The tooltip stays visible while the trigger has focus or the pointer is over the trigger/tooltip. A short closing delay allows crossing the gap. Escape dismisses without moving focus and prevents an enclosing dialog from also closing; it stays dismissed until the current focus/hover interaction ends. Disabled cancels pending display and removes only the tooltip's description ID. Touch pointer entry does not start the hover timer.

The `role="tooltip"` element has a generated ID referenced by aria-describedby. The trigger's accessible name must still describe its action; an icon-only button needs an aria-label. Hidden tooltip text remains in the DOM for the description relationship. Do not put links, buttons, forms, or other interactive content inside a tooltip. Keep essential instructions visible, especially for touch users and disabled controls that cannot receive focus.

The tooltip uses a fixed, viewport-clamped position, flipping to the opposite side or another axis when needed to fit before clamping. It updates on window resize and scrolling. In supporting browsers, manual Popover API presentation places it in the top layer without moving it out of its themed DOM subtree. Without that API, it falls back to fixed positioning and ancestor clipping/stacking can apply. Tooltip content never receives focus. Public types: `STooltipProps`, `STooltipPlacement`, `STooltipTrigger`.

## SAvatar

A passive image/initials/icon representation using the accent's soft fill and foreground, plus an overlay ring. Props: `src`, `name`, `alt`, `initials`, `size` (sm 32px, md 40px default, lg 48px, xl 64px), and `shape` (circle default or rounded with 2xl corners).

```vue
<SAvatar src="/avatars/alex.jpg" name="Alex Morgan" />
<SAvatar name="Sirius workspace" initials="SU" shape="rounded" />
<SAvatar src="/avatars/alex.jpg" alt="" />
```

Initials use the first letters of the first and last name, or one letter for a single-word name. Explicit initials override this and are limited to two Unicode code points before uppercasing. Missing initials use a decorative Lucide UserRound icon. The `fallback({ initials })` slot replaces the fallback with non-interactive content.

Fallback content remains visible while an image loads and returns if loading fails. A changed src resets load/error state and retries; removing src shows the fallback. Original native `load` and `error` Events are emitted. No image URLs are fetched by the component outside the normal native image element.

The outer avatar exposes one accessible image labelled by alt, then name, then “User avatar”. The inner image is decorative to avoid duplicate announcements. Pass alt="" to hide the whole avatar from assistive technology when a visible adjacent name already provides its meaning. Class/style/attributes apply to the outer wrapper. An avatar is not a button; wrap it in an application-owned link/button with its own accessible name if it performs an action. Public types: `SAvatarProps`, `SAvatarSize`.


## SSkeleton

A decorative placeholder for content that is loading. Props: `shape` (text/circle/rounded, default text), `width`, `height`, and `animated` (default true). Numeric dimensions are pixels; strings accept CSS dimensions. Defaults use the theme spacing scale: text is full-width × 1rem, circle is 2.5rem square, rounded is full-width × 6rem. Text/circle use full rounding; rounded uses 2xl.

```vue
<div :aria-busy="loading" aria-label="Profile preview" role="region">
  <SSkeleton v-if="loading" shape="circle" :width="48" :height="48" />
  <Profile v-else />
</div>
<p role="status">{{ loading ? 'Loading profile.' : 'Profile loaded.' }}</p>
```

Skeletons are aria-hidden, have no slots or loading announcements, and cannot contain controls. The application owns aria-busy and any loading message. Animation runs only when reduced motion is not requested; set animated=false for a static placeholder. The selected neutral supplies the `skeleton` fill. Public type: `SSkeletonProps`.

## SDivider

A subtle separator using the selected neutral's line token. Props: `orientation` (horizontal default / vertical), optional `label`, and `decorative` (false). An unlabelled horizontal divider renders a native hr. Labelled or vertical dividers use role=separator and an explicit orientation. Generated IDs associate a label with its separator; the default slot replaces label text with non-interactive content.

```vue
<SDivider />
<SDivider label="Workspace settings" />
<SDivider><SBadge>Continue</SBadge></SDivider>
<div class="flex items-center gap-3">
  <span>Draft</span><SDivider orientation="vertical" decorative /><span>Shared</span>
</div>
```

Vertical separators stretch within a flex/grid row with a minimum height of 1.5rem. Give the parent a height for taller lines. Vertical labels remain horizontal text between vertical line segments. Decorative separators are hidden from assistive technology; their labels should not carry essential information. Class/style/attributes apply to the separator root. Public type: `SDividerProps`.

## SEmptyState

A layout for empty content with a descriptive heading and optional actions. Props: `title` (default “Nothing here yet”), `description`, `icon` (Vue component, default Lucide Inbox; false hides it), and `headingLevel` (2–6, default 3). It supplies spacing and text styles without an automatic card background or live-region role.

```vue
<SEmptyState title="No projects yet" description="Create a project to get started." :icon="Folder">
  <template #actions><SButton @click="createProject">Create project</SButton></template>
</SEmptyState>
```

Slots: `title`, `description`, `icon`, default (additional body content), and `actions`. Actions wrap on small screens. The icon is decorative and aria-hidden; keep title/description meaningful. Use the heading level that fits your page. All content except icons remains accessible, including application-provided links/buttons. Wrap it in SCard or supply surface/ring classes if a framed treatment is needed. Applications decide when the state appears and handle its actions, permissions, data loading, and announcements. Public type: `SEmptyStateProps`.

The Skeletons, Dividers, and Empty states playground sections include a loading/loaded profile, shape and animation examples, labelled and vertical separators, project creation/reset, and clearing a no-results filter. All actions are local demos.

## SDrawer

Animated modal side panel using the same background, border and overlay tokens as SDialog. Native dialog focus containment and restoration, Escape/backdrop dismissal, reduced motion and delayed unmount during exit follow SDialog.

```vue
<SDrawer v-model:open="open" side="left" title="Navigation" size="sm">
  <nav><!-- Application links --></nav>
  <template #footer><SButton @click="open = false">Done</SButton></template>
</SDrawer>
```

`side`: `left` or `right` (default). `size`: `sm`, `md` (default), `lg`, `xl`; widths match SDialog and remain within the viewport. Supports the same title, description, footer slots, close options and events as SDialog. Supply a title or an accessible name. Drawer content scrolls within its full-height panel. Physical sides stay the same in RTL layouts.

## SAccordion

```vue
<SAccordion v-model="openSections" :items="items" :multiple="false">
  <template #default="{ item }">{{ item.content }}</template>
</SAccordion>
```

Items have a unique string `value`, `label`, optional `content` and `disabled`. The model is a string array (default empty). Single mode shows the first matching item in item order; `multiple` permits several. Clicking an open header collapses it. Disabled headers cannot be activated. External model changes do not emit `change`; user toggles emit the new array.

`headingLevel` defaults to 3 (2–6). Title slots receive `{ item, expanded }`; keep title content noninteractive because it is inside a button. Content slots receive `{ item, index }`. Closed content unmounts by default; `keepAlive` preserves it inside a hidden panel. Tab follows normal document order; Enter/Space toggle, arrows wrap and skip disabled headers, Home/End focus the first/last enabled header. Supply unique values and appropriate heading hierarchy.

## Internal Vue conventions

Components use Vue 3.5 template refs and shallow refs for primitive local state. Dialog and drawer share an internal native-modal lifecycle composable; their public props, events, slots and styles are unchanged. Lifecycle regression tests cover independent instances, reopening during exit and pending-timer cleanup on unmount. See [architecture](../../docs/architecture.md) and the installed Vue workflow for implementation guidance.

## SBreadcrumbs

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { SBreadcrumbs } from '@sirius-ui/vue'
const trail = [
  { value: 'home', label: 'Home', href: '/' },
  { value: 'users', label: 'Users', href: '/users', linkProps: { preserveScroll: true } },
  { value: 'profile', label: 'Alex Morgan' },
]
</script>
<template><SBreadcrumbs :items="trail" :link-as="Link" /></template>
```

No router dependency is included. `linkAs` defaults to a native anchor; custom components must accept href and forward attributes/slots to an accessible link. Each item requires a unique string `value` and text `label`; optional fields are `href`, decorative `icon`, and `linkProps` for link-component options/native link attributes. Explicit href and current-page semantics take precedence over linkProps. Link props apply only to navigable ancestors. The final item always renders as text with aria-current="page", even when supplied an href; intermediate items without href also render as text.

The root is a nav labelled “Breadcrumb” by default; customize `label` to distinguish multiple trails. Root attrs, classes and styles fall through to the nav. The item slot receives `{ item, index, current }` and replaces label content: keep it noninteractive and provide readable text. The separator slot replaces the decorative chevron and is hidden from assistive technology; do not put controls in it. Long trails wrap without hiding ancestors. Keyboard behavior is native link navigation; there is no roving focus or route inference. An empty items array renders an empty labelled navigation landmark. Public types: `SBreadcrumbsItem`, `SBreadcrumbsProps`.

## STable and SPagination

These components are independent views of server-owned data. STable receives only the current response's `data`; SPagination receives its pagination metadata and links. Neither component fetches, slices, filters, sorts, generates page URLs, or owns the current page. There is no pagination v-model.

### API requests with Laravel pagination

```vue
<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'
import { SPagination, STable } from '@sirius-ui/vue'
import type { SPaginationData, STableColumn } from '@sirius-ui/vue'

interface Member { id: number; name: string; email: string }
type Response = SPaginationData & { data: Member[] }
const props = defineProps<{ initialResponse: Response }>()
const response = shallowRef(props.initialResponse)
const loading = shallowRef(false)
const error = shallowRef('')
const announcement = shallowRef('')
const columns: STableColumn<Member>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
]
let controller: AbortController | undefined
async function loadPage(url: string) {
  controller?.abort()
  const request = new AbortController()
  controller = request
  loading.value = true
  error.value = ''
  try {
    const result = await fetch(url, { signal: request.signal, headers: { Accept: 'application/json' } })
    if (!result.ok) throw new Error('Unable to load this page.')
    const payload: Response = await result.json()
    if (request.signal.aborted) return
    response.value = payload
    announcement.value = 'Results updated.'
  } catch (cause) {
    if (!request.signal.aborted) error.value = cause instanceof Error ? cause.message : 'Request failed.'
  } finally {
    if (!request.signal.aborted) loading.value = false
  }
}
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <STable :rows="response.data" :columns="columns" row-key="id" caption="Members" :loading="loading" />
  <SPagination :pagination="response" mode="event" :loading="loading" @navigate="loadPage" />
  <p v-if="error" role="alert">{{ error }}</p>
  <p role="status">{{ announcement }}</p>
</template>
```

The fetch URL is supplied by the API and must be trusted for the consuming application's requests. Request authentication, response validation, errors, cancellation, focus after updates, and announcements belong to the consuming app. Keep the last successful response on failure. The playground uses an isolated simulated API service with a delay; it is not a live Laravel backend.

### Supported Laravel response shapes

Pass either response directly as `pagination`:

```ts
// Direct paginator / typical Inertia page prop
{
  data: [], current_page: 2, last_page: 10, from: 11, to: 20, total: 100,
  prev_page_url: '/members?team=design&page=1',
  next_page_url: '/members?team=design&page=3',
  links: [
    { url: '/members?page=1', label: '&laquo; Previous', active: false },
    { url: '/members?page=1', label: '1', active: false },
    { url: '/members?page=2', label: '2', active: true },
    { url: '/members?page=3', label: '3', active: false },
    { url: '/members?page=3', label: 'Next &raquo;', active: false },
  ],
}

// API Resource response
{
  data: [],
  links: { first: '/members?page=1', last: '/members?page=10', prev: '/members?page=1', next: '/members?page=3' },
  meta: { current_page: 2, last_page: 10, from: 11, to: 20, total: 100, links: [] },
}
```

Numbered links come only from the server's `links` array (direct paginator) or `meta.links` (Resource). Arrays follow Laravel's order: previous control, page/ellipsis entries, next control. Missing arrays produce previous/next controls with the available summary, never client-generated links. First/last URLs are accepted as part of the Resource shape but do not create extra controls. Simple/cursor responses with only previous/next URLs are supported without inventing totals, page numbers or ranges. Omit unknown numeric metadata.

Previous/next URL precedence: explicit top-level `prev_page_url` / `next_page_url`, then Resource `links.prev` / `links.next`, then the array's boundary links. Explicit null disables the corresponding control. URLs, query filters and cursors are preserved unchanged. For Laravel, retain desired filters in backend links with `withQueryString()` / `appends()`.

### Link navigation and Inertia

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { SPagination } from '@sirius-ui/vue'
defineProps<{ members: import('@sirius-ui/vue').SPaginationData }>()
</script>
<template>
  <SPagination :pagination="members" :link-as="Link" :link-props="{ preserveScroll: true, preserveState: true }" />
</template>
```

`mode` defaults to `link`: enabled items render real anchors or the supplied `linkAs` component (which must accept href and forward native attributes and slots). Use this for HTML/Inertia page routes. JSON API URLs usually need `mode="event"`: enabled items render type-button buttons and emit `navigate(url, originalMouseEvent)`. The component does not fetch or optimistically update the page. Link mode also emits navigate; if intercepting it, call the second argument's `preventDefault()` to cancel native navigation. Do not use `@navigate.prevent`, whose first argument would be the URL. Standard link modifiers such as opening in a new tab remain native behavior.

`loading` disables all navigation, removes hrefs and unmounts custom link adapters. Null URL boundary controls are disabled; active pages and ellipses are plain text. The current item exposes aria-current="page". The nav defaults to label “Pagination”; override `label`, `previousLabel` and `nextLabel` for context or translation. The optional summary slot receives `{ currentPage, lastPage, from, to, total }`; no unavailable data is fabricated. Server labels are escaped text with common HTML entities decoded, never v-html. Root attrs/class/style apply to the nav. Give multiple paginators distinct labels.

### Table API

| Prop | Purpose |
| --- | --- |
| `rows` | Readonly current-page array, default empty |
| `columns` | Required readonly column definitions |
| `rowKey` | Required string property name or `(row) => string \| number`; keys must be unique and stable |
| `caption` | Required accessible table name; rendered as a visually hidden native caption |
| `loading` | Busy state; keeps existing rows, disables sort buttons, and shows loading feedback |
| `sort` | Controlled `{ key, direction: 'asc' \| 'desc' }` or null; default null |
| `emptyText` / `loadingText` | Default empty and loading messages |

Columns have unique string `key`, readable `label`, optional `value(row)` accessor, `sortable`, and `align` (`start`, `center`, `end`). Default values read `row[column.key]`, without nested-path parsing. Accessors should be pure; derived cell values are cached per reactive row/column update. Use a slot to format complex values.

```vue
<STable :rows="response.data" :columns="columns" row-key="id" caption="Members" :sort="serverSort" :loading="loading" @sort="requestSortedPage">
  <template #cell="{ row, column, value, index, loading: pending }">
    <SBadge v-if="column.key === 'status'">{{ value }}</SBadge>
    <SButton v-else-if="column.key === 'actions'" :disabled="pending" :aria-label="`View ${row.name}`" @click="viewMember(row)">View</SButton>
    <span v-else>{{ value }}</span>
  </template>
</STable>
```

The cell slot receives `{ row, column, value, index, loading }`. The header slot receives `{ column }`; for sortable columns it renders inside the sort button, so keep it noninteractive. Empty/loading slots replace the initial empty-table messages inside a spanning cell. Row action controls and selection checkboxes can be composed through cell slots; selection, bulk actions and click policy remain application-owned. Disable slot actions yourself while loading if appropriate.

Clicking a sortable header emits `sort({ key, direction })`: first ascending, then descending when the supplied sort is ascending on that key. There is no implicit third state. This does not reorder rows or change sort state: request new data from the backend, reset its page as appropriate, then replace rows and sort after success. The API defines the accepted sort keys and generates links preserving the chosen query. Sort headers expose aria-sort; icons are decorative. Native table semantics and scope=col are retained; no ARIA grid keyboard model is imposed. The labelled, focusable scroll region permits horizontal scrolling on narrow screens. Root attrs/class/style apply to the outer frame, not the native table. Error presentation and result announcements remain app-owned.

### Large pagination windows and selectable rows

For 100 pages, SPagination displays the server-provided link window, for example `Previous 1 … 48 49 50 51 52 … 100 Next`. It does not generate or trim that window. Configure your backend's pagination links (for Laravel, `onEachSide`) or supply an API window matching your desired presentation. If all 100 links are supplied, all 100 render and wrap.

The playground includes a 100-page server-fixture example and a separate selectable-row table. A non-sortable selection column uses the header slot for a select-all checkbox, with `indeterminate` when some displayed rows are selected. The cell slot renders a labelled checkbox per row. A bulk-action toolbar appears only when at least one row is selected; its SDropdown opens on user activation so selecting a checkbox does not steal focus. Clearing selection returns focus to select-all. Demo actions update only local fixture statuses, with a status announcement.

Selection belongs to the consuming app: explicitly decide whether it covers the displayed page, persists selected IDs across responses, or represents all matching server records. This example selects only its displayed rows; it never implies selection across every page. For API tables, reset or reconcile selected IDs when replacing the page, and send the selected IDs to your bulk-action endpoint. Confirm destructive operations, handle permissions/errors/loading, and update rows only after successful server responses in your app.

## SToast, SToaster and useToasts

```vue
<script setup lang="ts">
import { SButton, SToaster, useToasts } from '@sirius-ui/vue'

// One collection per app/provider/feature scope; do not create a new one per consumer.
const { items, notify, dismiss, clear } = useToasts()
function saved() {
  notify({ title: 'Changes saved', description: 'Your workspace is up to date.', color: 'success' })
}
</script>
<template>
  <SButton @click="saved">Show saved notification</SButton>
  <SToaster :toasts="items" position="bottom-right" @dismiss="dismiss" />
</template>
```

`useToasts()` creates an independent message collection; it has no singleton, storage, request client or global provider. It returns readonly `items`, `notify(options)` (returns an ID), `dismiss(id)` and `clear()`. Options are `title` (required text), optional `description`, `color` (`primary`, `success`, `warning`, `danger`), `duration` (milliseconds, default 5000), and `role` (`status` default, or `alert` for urgent information). Use duration=0 for persistent messages. Nonpositive/nonfinite durations do not schedule auto-dismissal. Notifications are appended in creation order; applications own limits, deduplication and routing policy. If sharing the collection across descendants, provide the same instance from an app-owned scope rather than calling the composable in each consumer.

SToaster renders an in-place fixed stack at `top-left`, `top-right`, `bottom-left` or `bottom-right` (default), with a labelled Notifications region. Its `toasts` prop is readonly; handle `dismiss(id, reason)` by removing the message, as above. It preserves parent theme inheritance and uses the dialog background/border tokens. Place it near the application root, outside ancestors that clip or transform fixed content. It does not teleport or escape native modal dialogs; put a host inside a dialog when notifications must appear in its top layer. The stack fits the viewport and accounts for top/bottom safe areas.

```vue
<SToaster :toasts="items" @dismiss="dismiss">
  <template #actions="{ toast }">
    <SButton v-if="toast.id === undoToastId" size="sm" variant="outline" @click="undo(toast.id)">Undo</SButton>
  </template>
</SToaster>
```

The actions slot receives `{ toast }`. Applications own action handlers, request state and focus restoration when an action removes a toast. Use a persistent message for an action that must remain available, and keep essential errors/instructions in the relevant page or form. The playground's Undo is a local example; no request is sent.

SToast can be used alone with `v-model:open` (default true), the same options, an actions slot and a configurable `dismissLabel` (default “Dismiss notification”). Its dismiss event carries `timeout` or `close-button`. Title/description changes update its announcement; changing duration or reopening restarts the countdown. The visual group uses unique title/description IDs, and a separate initially-empty live region announces plain text after mount. Action controls are outside that live region. Notifications do not autofocus or intercept Escape. Closing with focus inside the toast attempts to return focus to the connected element from which focus entered; applications own focus for programmatic collection removal. Do not create a second live announcement for the same message in the app.

Auto-dismiss pauses for mouse/pen hover, focus anywhere within the panel, a hidden document, or an unfocused window. Those reasons compose: leaving hover does not resume a timer while focus remains inside. Resuming uses remaining time; time in the background is not counted. Touch pointer entry does not pause. Timers and browser listeners are cleaned up on unmount. Toasts use the small shadow and enter with a 260ms fade, upward slide and subtle scale. The entry animation respects reduced motion; dismissal removes the panel immediately.

Automated tests cover collection isolation, SSR semantics, independent IDs, timers, persistence, pause reasons, reopening and cleanup. Browser/screen-reader testing is still required to validate announcement and focus behavior across assistive technologies.

## SProgress

```vue
<SProgress label="Uploading files" :value="uploaded" :max="total" show-value />
<SProgress label="Preparing export" />
<SProgress label="Upload queue" :value="3" :max="8" value-text="3 of 8 files uploaded" />
```

A read-only progress indicator, with no request, job state or timer. The consuming application supplies `value` and `max` (default 100). Omit value or pass null for indeterminate progress. Nonfinite values also become indeterminate; finite values clamp to 0–max. Invalid/nonpositive maxima fall back to 100. Zero is determinate, not an unknown state.

`label` is required and supplies the progressbar's accessible name. `showLabel` defaults true; hiding it retains the accessible name. `showValue` defaults false and displays a rounded percentage, or “Loading…” when unknown. Optional `valueText` describes values in meaningful units to assistive technology. The progressbar exposes its actual units with aria-valuenow/min/max; indeterminate progress omits aria-valuenow. Visual labels and percentages are hidden from assistive technology to avoid duplicating the progressbar name/value.

`color`: primary (default), success, warning, danger. `size`: sm (4px), md (8px default), lg (12px). The fill uses semantic role colors and the track uses the selected neutral range-track token. Completion does not automatically change color. Indeterminate motion and width transitions respect reduced-motion preferences, leaving a static partial bar for unknown progress when animation is disabled.

Root class/style apply to the layout wrapper; other native attributes (including id and aria-describedby) apply to the progressbar. Bind a busy state to the affected content region in your app and use a separate status message for meaningful milestones/completion. The progress indicator does not announce every update or steal keyboard focus. Keep labels descriptive and include text explaining errors rather than relying on color. No slots or events. Public types: SProgressProps, SProgressColor, SProgressSize.


## SPopover

An interactive, nonmodal panel anchored to a native button. Use STooltip for short noninteractive hints and SPopover for controls, links, and small forms. Both examples live in the playground's Tooltips section.

```vue
<SPopover v-model:open="preferencesOpen" title="Preferences" description="Choose your updates.">
  <template #trigger="{ trigger }">
    <SButton v-bind="trigger" variant="outline">Preferences</SButton>
  </template>
  <template #default="{ close }">
    <SSwitch v-model="email" label="Email updates" />
    <SButton @click="save(); close()">Save preferences</SButton>
  </template>
</SPopover>
```

| API | Behavior |
| --- | --- |
| `title` | Required accessible dialog name and visible heading |
| `description` | Optional visible, associated help text |
| `placement` | `top`, `bottom` (default), `left`, or `right`; flips and shifts at viewport edges |
| `align` | `start` (default), `center`, or `end` along the other axis |
| `disabled` | Prevents opening and closes an existing panel |
| `closeLabel` | Accessible close-button label; defaults to `Close popover` |
| `v-model:open` | Optional controlled visibility; otherwise state stays local |
| `#trigger="{ trigger }"` | Bind **all** trigger attributes and handlers to one real native button or SButton |
| Default slot `{ close }` | Interactive content; call `close()` after an action |
| `dismiss` | Reason: `escape`, `outside`, or `close`; external model changes do not emit dismissal |

Opening focuses the first available control (the close button by default). Escape and explicit dismissal restore focus to the trigger. Tab follows normal document order; focus moving outside or pointer interaction outside dismisses without stealing focus. This is not a modal and does not trap focus. Escape is contained so a surrounding dialog stays open. Keep triggers mounted and avoid nested interactive trigger elements. An initially/programmatically open panel locates the button carrying the trigger bindings.

The manual native Popover API supplies top-layer stacking while retaining local theme inheritance, including within SDialog/SDrawer. Older browsers fall back to an in-place fixed panel; transformed or clipping ancestors can constrain that fallback. Resize, content-size changes, and scrolling reposition the panel. Content scrolls within narrow/short viewports. Entry animation respects reduced motion. Attributes/classes/styles apply to the panel. No menu, router, or overlay dependency is required.

## SFileUpload

A native file picker and drop area with removable selected files. `v-model` is always a `File[]`, including single-file mode. It selects files; it does not send requests, create stored media records, delete server files, or perform conversions.

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { SFileUpload } from '@sirius-ui/vue'
const files = shallowRef<File[]>([])

function formData() {
  const data = new FormData()
  files.value.forEach(file => data.append('attachments[]', file))
  return data // Send using your application's API/Inertia form.
}
</script>

<template>
  <SFileUpload v-model="files" label="Attachments" description="PNG or PDF, up to 5 MB each."
    accept=".png,.pdf" multiple :max-files="3" :max-size="5 * 1024 * 1024" />
</template>
```

| API | Behavior |
| --- | --- |
| `label` | Required visible/native accessible label |
| `description` | Associated help text; defaults to picker/drop instructions |
| `accept` | Comma-separated extensions, MIME types, or MIME wildcards; native picker hint and client check |
| `multiple` | Defaults false; successful single selection replaces the existing file, multiple appends |
| `maxFiles` | Optional total selection limit in multiple mode |
| `maxSize` | Optional maximum bytes per file |
| `disabled` | Blocks picker, drops, and removal |
| `required` | Native custom validity follows the selected model, including dropped files |
| `invalid` | Invalid border and `aria-invalid`; SField's error state also passes through |
| `browseLabel`, `removeLabel` | Localizable UI text; defaults `Choose files` and `Remove` |
| `reject` | Array of `{ file, reason }`, with `type`, `size`, `count`, or `duplicate` |
| `#file="{ file, index }"` | Customize each file's metadata area; for example add application-owned SProgress |

Files are deduplicated using name, size, MIME type, and last-modified time. Invalid replacements preserve the existing single selection. Rejected files never enter the model. MIME-only checks require a browser-supplied MIME type; prefer extensions when supporting files with missing MIME metadata. Client checks are convenience checks: the server must enforce content types, size/count limits, authorization, and storage policy again. The component does not infer limits/help text from props; supply clear localized instructions and use `reject` to present specific errors. Basic selection/rejection updates have a polite status announcement.

SField's scoped `control` attributes reach the actual file input. Other native attributes such as `id`, `name`, `form`, and ARIA descriptions also reach it; class/style apply to the outer wrapper. A modern browser's DataTransfer API synchronizes dropped/removed/model files back to the native input for multipart form submission. For older browsers without DataTransfer, submit the `File[]` explicitly using FormData (as above). Do not bind `value` or `type`; selection is controlled through `v-model`. Native form resets need an application reset handler that clears the model (`@reset="files = []"`). Existing server media should be displayed and managed separately from newly selected Files.

This frontend control can be used with a Laravel upload endpoint. Replacing a media-library frontend does not replace its backend storage, temporary-upload protocol, validation, conversions, collection rules, or media lifecycle; the consuming app owns any adapter and request/progress/error workflow. No Spatie dependency or protocol is built into SiriusUI.
