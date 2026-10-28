# @sirius-ui/vue

Reusable Vue 3 components and composables styled with the SiriusUI theme. `SButton`, `SForm`, `SField`, `SInput`, `STextarea`, and `SSelect` are implemented.

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

A fully rounded, borderless text input with an extra-small shadow, a 1px inset ring, and decorative icon slots. The medium size uses `py-1.5` (36px high at the default scale); small and large sizes use `py-1` and `py-2` respectively (28px and 44px high).

| Prop | Values | Default |
| --- | --- | --- |
| `v-model` | String value (`modelValue` / `update:modelValue`) | Empty string |
| `type` | `text`, `email`, `password`, `search`, `tel`, `url` | `text` |
| `size` | `sm`, `md`, `lg` | `md` |
| `disabled` | Native disabled state | `false` |
| `readonly` | Native readonly state | `false` |
| `invalid` | Invalid styling and `aria-invalid` | `false` |
| `valid` | Green-500 success ring, including on focus | `false` |

The idle ring uses the selected neutral at shade 300; placeholders use shade 400. Inputs are white with dark text in light mode and use selected neutral 600 at 80% with white text in dark mode. Focus replaces the ring color with the selected accent at shade 500 in light mode and 400 in dark mode. These colors come from shared `control` tokens, ready to reuse for selects.

SInput also styles invalid states passed via `aria-invalid` by SField. Set `valid` after application validation succeeds (for example, `<SInput v-model="email" valid />`). It is an explicit visual state, not automatic browser validation, and does not add a nonexistent `aria-valid` attribute. Invalid styling, including `aria-invalid` from SField, takes priority over valid styling. Use a linked hint or status message when the successful validation needs to be communicated beyond color. `input`, `change`, `focus`, and `blur` forward the original events. Native text composition behavior is retained through Vue's input v-model directive. This component currently handles string text values; numeric inputs and v-model modifiers are not part of this API.

Native attributes, labels, descriptions, `name`, `form`, `autocomplete`, `placeholder`, `required`, `maxlength`, and other constraints pass to the **input**. `class` and `style` apply to the outer container for layout. `size` controls the visual size rather than the native character-width attribute. Provide an accessible label with SField or native labeling attributes when used alone.

The `leading` and `trailing` slots are decorative and hidden from assistive technology. Supply SVG icons (for example Lucide's Mail or Search); do not put interactive controls inside these slots. Disabled inputs leave the tab order and form data; readonly inputs remain focusable and submit their values. Focus is indicated by the 1px inset ring around the full input container; valid and invalid states use fixed green-500 and red-500 rings in both appearances, including on focus (`ring-control-valid` / `ring-control-invalid`). The component does not generate a name, persist values, or own validation.

Public types: `SInputProps`, `SInputSize`, `SInputType`.

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
