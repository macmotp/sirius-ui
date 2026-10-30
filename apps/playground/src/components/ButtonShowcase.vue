<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { ChevronRight, Download, Plus } from '@lucide/vue'
import { SButton, SSelect } from '@sirius-ui/vue'
import DemoLink from './DemoLink.vue'
import type { SButtonColor, SButtonSize, SButtonVariant } from '@sirius-ui/vue'

const exportUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent('name,status\nDemo workspace,Active\n')
const inertiaExample = '<SButton :as="Link" href="/users" preserve-scroll>Users</SButton>'

const colors: SButtonColor[] = ['primary', 'success', 'warning', 'danger']
const variants: SButtonVariant[] = ['solid', 'soft', 'outline', 'ghost']
const sizes: SButtonSize[] = ['sm', 'md', 'lg']
const color = ref<SButtonColor>('primary')
const variant = ref<SButtonVariant>('solid')
const size = ref<SButtonSize>('md')
const disabled = ref(false)
const loading = ref(false)
const fullWidth = ref(false)
const label = ref('Continue')
const clicks = ref(0)
const busy = ref(false)
const actionStatus = ref('Try an action to see the loading state.')
let timer: ReturnType<typeof setTimeout> | undefined

function runAction() {
  busy.value = true
  actionStatus.value = 'Saving the demo…'
  timer = setTimeout(() => {
    busy.value = false
    actionStatus.value = 'Demo saved. No data was sent.'
  }, 1200)
}
onUnmounted(() => clearTimeout(timer))

const example = computed(() => `<SButton color="${color.value}" variant="${variant.value}" size="${size.value}"${disabled.value ? ' disabled' : ''}${loading.value ? ' loading' : ''}${fullWidth.value ? ' full-width' : ''}>\n  ${label.value || 'Continue'}\n</SButton>`)
</script>

<template>
  <section id="buttons" class="border-t border-line py-10" aria-labelledby="buttons-title">
    <div class="mb-3 flex flex-wrap items-center gap-3">
      <h3 id="buttons-title" class="text-xl font-semibold tracking-tight">Buttons, ready for real work</h3>
      <span class="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-content">SButton</span>
    </div>
    <p class="mb-7 max-w-2xl text-sm leading-relaxed text-content-muted">Every button below is the shared Vue component. Explore the API, compare treatments, and change the accent, background, or appearance above to check them in context.</p>

    <div class="relative after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line overflow-hidden rounded bg-surface">
      <div class="grid gap-8 p-5 sm:p-7 xl:grid-cols-[1fr_1.2fr]">
        <fieldset class="min-w-0">
          <legend class="mb-5 text-sm font-semibold">Build a button</legend>
          <div class="grid grid-cols-2 gap-4">
            <div class="min-w-0 text-xs text-content-muted"><label for="button-color">Color</label><SSelect id="button-color" :model-value="color" :options="colors.map(value => ({ value, label: value }))" class="mt-2" @update:model-value="color = $event as SButtonColor" /></div>
            <div class="min-w-0 text-xs text-content-muted"><label for="button-variant">Variant</label><SSelect id="button-variant" :model-value="variant" :options="variants.map(value => ({ value, label: value }))" class="mt-2" @update:model-value="variant = $event as SButtonVariant" /></div>
            <div class="min-w-0 text-xs text-content-muted"><label for="button-size">Size</label><SSelect id="button-size" :model-value="size" :options="sizes.map(value => ({ value, label: value }))" class="mt-2" @update:model-value="size = $event as SButtonSize" /></div>
            <label class="text-xs text-content-muted">Label<input v-model="label" maxlength="120" class="mt-2 block w-full rounded-control border border-line-strong bg-canvas px-3 py-2 text-sm text-content" /></label>
          </div>
          <div class="mt-5 flex flex-wrap gap-4 text-sm">
            <label class="flex items-center gap-2"><input v-model="disabled" type="checkbox" class="accent-primary" />Disabled</label>
            <label class="flex items-center gap-2"><input v-model="loading" type="checkbox" class="accent-primary" />Loading</label>
            <label class="flex items-center gap-2"><input v-model="fullWidth" type="checkbox" class="accent-primary" />Full width</label>
          </div>
        </fieldset>
        <div class="flex min-w-0 flex-col justify-center rounded border border-dashed border-line-strong bg-canvas p-6">
          <div class="flex min-h-28 items-center justify-center"><SButton :color="color" :variant="variant" :size="size" :disabled="disabled" :loading="loading" :full-width="fullWidth" @click="clicks++">{{ label || 'Continue' }}</SButton></div>
          <p role="status" class="mt-4 text-center text-xs text-content-muted">{{ clicks }} {{ clicks === 1 ? 'click' : 'clicks' }} received · loading and disabled buttons block clicks</p>
        </div>
      </div>
      <pre class="overflow-x-auto border-t border-line bg-canvas p-5 font-mono text-xs leading-relaxed text-content-muted sm:p-7"><code>{{ example }}</code></pre>
    </div>

    <div class="mt-8 rounded bg-surface ring-1 ring-inset ring-line p-5 sm:p-7">
      <h4 class="text-sm font-semibold">Every color. Every treatment.</h4>
      <p class="mt-2 text-xs text-content-muted">Solid for emphasis, soft for subtle actions, outline for alternatives, ghost for minimal chrome.</p>
      <div class="mt-7 space-y-6">
        <div v-for="buttonColor in colors" :key="buttonColor" role="group" :aria-label="`${buttonColor} button variants`" class="grid items-center gap-3 sm:grid-cols-[5rem_1fr]">
          <p class="text-xs font-medium text-content-muted capitalize">{{ buttonColor }}</p>
          <div class="grid grid-cols-2 gap-3 lg:grid-cols-4"><SButton v-for="buttonVariant in variants" :key="buttonVariant" :color="buttonColor" :variant="buttonVariant" @click="clicks++">{{ buttonVariant }}</SButton></div>
        </div>
      </div>
    </div>

    <div class="mt-5 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
      <h4 class="text-sm font-semibold">Links with button styling</h4>
      <p class="mt-2 max-w-2xl text-xs leading-relaxed text-content-muted">Native anchors handle downloads and navigation. Pass your Inertia Link component through the as prop for client-side page visits. Each example renders a single element.</p>
      <div class="mt-5 flex flex-wrap items-center gap-3">
        <SButton href="#colors" variant="outline">Browse colors</SButton>
        <SButton :href="exportUrl" download="sirius-demo.csv"><template #leading><Download focusable="false" /></template>Export sample CSV</SButton>
        <SButton :as="DemoLink" href="#typography" variant="soft">Custom link component<template #trailing><ChevronRight focusable="false" /></template></SButton>
        <SButton href="#colors" disabled variant="outline">Unavailable link</SButton>
        <SButton :as="DemoLink" href="#typography" loading>Preparing link</SButton>
      </div>
      <p class="mt-4 text-xs leading-relaxed text-content-muted">The custom component above is a local anchor adapter, not Inertia. In your application, import Link from @inertiajs/vue3. Disabled and loading links render inert spans without a destination.</p>
      <pre class="mt-4 overflow-x-auto rounded-lg bg-canvas p-4 font-mono text-xs text-content-muted"><code>{{ inertiaExample }}</code></pre>
    </div>

    <div class="mt-5 grid gap-5 xl:grid-cols-2">
      <div class="rounded bg-surface ring-1 ring-inset ring-line p-5 sm:p-7">
        <h4 class="text-sm font-semibold">Three sizes</h4>
        <div class="mt-6 flex flex-wrap items-center gap-3"><SButton v-for="buttonSize in sizes" :key="buttonSize" :size="buttonSize" @click="clicks++">{{ { sm: 'Small', md: 'Medium', lg: 'Large' }[buttonSize] }}</SButton></div>
        <h4 class="mt-8 text-sm font-semibold">Leading and trailing icons</h4>
        <div class="mt-5 flex flex-wrap gap-3">
          <SButton @click="clicks++"><template #leading><Plus focusable="false" /></template>Create project</SButton>
          <SButton variant="outline" @click="clicks++">Next step<template #trailing><ChevronRight focusable="false" /></template></SButton>
        </div>
      </div>
      <div class="rounded bg-surface ring-1 ring-inset ring-line p-5 sm:p-7">
        <h4 class="text-sm font-semibold">Busy, disabled, and ready</h4>
        <div class="mt-6 flex flex-wrap gap-3"><SButton loading>Saving changes</SButton><SButton disabled>Unavailable</SButton><SButton variant="outline" disabled>Disabled outline</SButton></div>
        <div class="mt-6 border-t border-line pt-6"><SButton :loading="busy" @click="runAction">{{ busy ? 'Saving demo' : 'Try loading' }}</SButton><p role="status" class="mt-3 text-xs text-content-muted">{{ actionStatus }}</p></div>
      </div>
      <div class="rounded bg-surface ring-1 ring-inset ring-line p-5 sm:p-7"><h4 class="mb-5 text-sm font-semibold">Full width and long labels</h4><div class="max-w-xs space-y-4"><SButton full-width @click="clicks++">Continue to your workspace</SButton><SButton full-width variant="outline" @click="clicks++">A longer action label that wraps naturally on smaller screens</SButton></div></div>
      <div class="rounded bg-surface ring-1 ring-inset ring-line p-5 sm:p-7"><h4 class="text-sm font-semibold">Keyboard and motion</h4><p class="mt-3 text-sm leading-relaxed text-content-muted">Tab to a button to see its focus outline. Activate it with Enter or Space. Disabled and loading buttons leave the tab order. The spinner respects reduced-motion preferences.</p><p class="mt-3 text-xs text-content-muted">Icon slots are decorative; keep the action name in the label. Use buttons for actions, not navigation.</p></div>
    </div>
  </section>
</template>
