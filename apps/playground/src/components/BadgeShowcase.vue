<script setup lang="ts">
import { Check, CircleAlert, Clock, Sparkles } from '@lucide/vue'
import { SBadge, SCard, SGrid } from '@sirius-ui/vue'
import type { SBadgeColor, SBadgeVariant } from '@sirius-ui/vue'

const colors: SBadgeColor[] = ['primary', 'success', 'warning', 'danger']
const variants: SBadgeVariant[] = ['soft', 'solid', 'outline']
</script>

<template>
  <section id="badges" class="border-t border-line py-10" aria-labelledby="badges-title">
    <div class="mb-6 flex items-baseline gap-3"><h3 id="badges-title" class="text-xl font-semibold tracking-tight">Small labels, clear meaning</h3><SBadge>SBadge</SBadge></div>
    <SGrid :columns="3">
      <SCard v-for="variant in variants" :key="variant">
        <template #header><h4 class="text-sm font-semibold capitalize">{{ variant }}</h4></template>
        <div class="flex flex-wrap gap-3"><SBadge v-for="color in colors" :key="color" :variant="variant" :color="color">{{ color }}</SBadge></div>
      </SCard>
    </SGrid>
    <SCard class="mt-6">
      <template #header><h4 class="text-sm font-semibold">Icons, counts, and sizes</h4></template>
      <div class="flex flex-wrap items-center gap-3">
        <SBadge size="sm"><template #leading><Sparkles /></template>New</SBadge>
        <SBadge color="success"><template #leading><Check /></template>Published</SBadge>
        <SBadge color="warning" variant="outline"><template #leading><Clock /></template>Pending</SBadge>
        <SBadge color="danger" variant="soft" size="lg"><template #leading><CircleAlert /></template>Needs attention</SBadge>
        <SBadge variant="solid">12 items</SBadge>
        <SBadge>Preview<template #trailing><Sparkles /></template></SBadge>
      </div>
      <p class="mt-5 text-xs leading-relaxed text-content-muted">Icons are decorative; the text carries the meaning. Badges are labels, so use SButton when an action is needed.</p>
    </SCard>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SBadge color="success"&gt;
  &lt;template #leading&gt;&lt;Check /&gt;&lt;/template&gt;
  Published
&lt;/SBadge&gt;</code></pre>
  </section>
</template>
