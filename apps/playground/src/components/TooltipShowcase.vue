<script setup lang="ts">
import PopoverShowcase from './PopoverShowcase.vue'
import { ref } from 'vue'
import { Copy, Info } from '@lucide/vue'
import { SBadge, SButton, SCard, SCheckbox, SGrid, SSelect, STooltip } from '@sirius-ui/vue'
import type { STooltipPlacement } from '@sirius-ui/vue'

const placement = ref<STooltipPlacement>('top')
const disabled = ref(false)
const count = ref(0)
const placements: STooltipPlacement[] = ['top', 'bottom', 'left', 'right']
</script>

<template>
  <section id="tooltips" class="border-t border-line py-10" aria-labelledby="tooltips-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="tooltips-title" class="text-xl font-semibold tracking-tight">A little context, right there</h3><SBadge>STooltip · SPopover</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Hover for a short hint, or focus with the keyboard to show it immediately. Escape dismisses the tooltip. Keep essential information visible on the page.</p>
    <SCard>
      <template #header><h4 class="text-sm font-semibold">Explore tooltips</h4></template>
      <div class="flex flex-wrap items-center gap-5">
        <div class="flex items-center gap-3"><label for="tooltip-placement" class="text-sm font-medium">Tooltip placement</label><SSelect id="tooltip-placement" :model-value="placement" :options="placements.map(value => ({value,label:value}))" @update:model-value="placement = $event as STooltipPlacement" /></div>
        <SCheckbox v-model="disabled" label="Tooltip disabled" />
        <STooltip v-slot="{ trigger }" text="Create a local demo copy of this workspace." :placement="placement" :disabled="disabled"><SButton v-bind="trigger" variant="outline" @click="count++"><template #leading><Copy /></template>Duplicate workspace</SButton></STooltip>
      </div>
      <p role="status" class="mt-5 text-xs text-content-muted">{{ count }} demo actions · The hint does not change the button's behavior.</p>
    </SCard>
    <SGrid :columns="2" class="mt-6">
      <SCard>
        <template #header><h4 class="text-sm font-semibold">An accessible icon button</h4></template>
        <p class="mb-5 text-sm leading-relaxed text-content-muted">Keep an accessible name on the button; the tooltip adds a description.</p>
        <STooltip v-slot="{ trigger }" text="Activity updates are sent once a day."><button v-bind="trigger" type="button" aria-label="About activity updates" class="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-primary-soft text-primary-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><Info aria-hidden="true" class="size-5" /></button></STooltip>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Preserve existing descriptions</h4></template>
        <p id="tooltip-publish-help" class="mb-5 text-sm leading-relaxed text-content-muted">This demo keeps all changes local.</p>
        <STooltip described-by="tooltip-publish-help">
          <template #default="{ trigger }"><SButton v-bind="trigger" variant="soft">Publish preview</SButton></template>
          <template #content><span class="font-semibold">A quick check</span><br />Review your title and audience before publishing.</template>
        </STooltip>
      </SCard>
    </SGrid>
    <SCard class="mt-6">
      <template #header><h4 class="text-sm font-semibold">Four placements</h4></template>
      <div class="flex flex-wrap gap-5"><STooltip v-for="side in placements" :key="side" v-slot="{ trigger }" :placement="side" :text="`A short hint on the ${side}.`"><SButton v-bind="trigger" size="sm" variant="outline">{{ side }}</SButton></STooltip></div>
      <p class="mt-5 text-xs leading-relaxed text-content-muted">The tooltip can flip or shift near viewport edges. You can move the pointer onto the hint without dismissing it.</p>
    </SCard>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;STooltip v-slot="{ trigger }" text="Create a copy of this workspace."&gt;
  &lt;SButton v-bind="trigger"&gt;Duplicate workspace&lt;/SButton&gt;
&lt;/STooltip&gt;</code></pre>
    <PopoverShowcase />
  </section>
</template>
