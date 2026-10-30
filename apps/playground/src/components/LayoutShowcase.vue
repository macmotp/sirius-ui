<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUpRight, Check } from '@lucide/vue'
import { SBadge, SButton, SCard, SCheckbox, SGrid, SSelect } from '@sirius-ui/vue'
import type { SCardCorner, SGridColumns } from '@sirius-ui/vue'

const columns = ref<SGridColumns>(3)
const corners: SCardCorner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const selectedCorners = ref<SCardCorner[]>(['top-left'])
function toggleCorner(corner: SCardCorner, enabled: boolean) {
  selectedCorners.value = enabled ? [...selectedCorners.value, corner] : selectedCorners.value.filter(value => value !== corner)
}
</script>

<template>
  <section id="layouts" class="border-t border-line py-10" aria-labelledby="layouts-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="layouts-title" class="text-xl font-semibold tracking-tight">Grids and cards, built to fit</h3><SBadge>SGrid · SCard</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Choose 1, 2, 3, 4, or 6 equal columns. Every layout starts with one column on narrow screens. Cards use the selected neutral surface and an inset ring.</p>
    <div class="mb-5 flex flex-wrap items-center gap-3">
      <label for="grid-columns" class="text-sm font-medium">Grid columns</label>
      <SSelect id="grid-columns" :model-value="String(columns)" :options="[1, 2, 3, 4, 6].map(value => ({ value: String(value), label: String(value) }))" class="w-24" @update:model-value="columns = Number($event) as SGridColumns" />
    </div>
    <SGrid :columns="columns" aria-label="Responsive grid preview">
      <SCard v-for="item in 6" :key="item">
        <p class="font-mono text-xs text-primary-content">0{{ item }}</p>
        <p class="mt-3 text-sm font-semibold">Room to grow</p>
        <p class="mt-2 text-xs leading-relaxed text-content-muted">Equal columns, flexible content, and comfortable spacing.</p>
      </SCard>
    </SGrid>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SGrid :columns="{{ columns }}"&gt;
  &lt;SCard v-for="item in items" :key="item.id"&gt;…&lt;/SCard&gt;
&lt;/SGrid&gt;</code></pre>

    <h4 class="mt-10 text-lg font-medium">Choose your bento corners</h4>
    <p class="mt-2 text-sm text-content-muted">Selected corners use 4xl (2rem); the others keep 2xl (1.5rem). Choose one or combine several.</p>
    <fieldset class="my-5 flex flex-wrap gap-5">
      <legend class="sr-only">Bento corners</legend>
      <SCheckbox v-for="corner in corners" :key="corner" :label="corner" :model-value="selectedCorners.includes(corner)" @update:model-value="toggleCorner(corner, $event)" />
    </fieldset>
    <SGrid :columns="2">
      <SCard :bento="selectedCorners">
        <template #header><div class="flex flex-wrap items-center justify-between gap-3"><h5 class="font-semibold">Workspace overview</h5><SBadge color="success"><template #leading><Check /></template>Up to date</SBadge></div></template>
        <p class="text-sm leading-relaxed text-content-muted">Header, body, and footer slots keep your content organized. Your application owns headings and actions.</p>
        <template #footer><SButton href="#badges" variant="soft" size="sm">Explore badges<template #trailing><ArrowUpRight /></template></SButton></template>
      </SCard>
      <SCard :bento="selectedCorners">
        <template #header><h5 class="font-semibold">A longer title that wraps naturally on smaller screens</h5></template>
        <p class="text-sm leading-relaxed text-content-muted">The subtle ring stays above child backgrounds and follows every selected corner.</p>
        <template #footer><p class="text-xs text-content-subtle">A quiet place for supporting information.</p></template>
      </SCard>
    </SGrid>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SCard bento="top-left"&gt;…&lt;/SCard&gt;
&lt;SCard :bento="['top-left', 'bottom-right']"&gt;…&lt;/SCard&gt;</code></pre>
  </section>

</template>
