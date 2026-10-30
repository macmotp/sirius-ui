<script setup lang="ts">
import { ref } from 'vue'
import { Building2 } from '@lucide/vue'
import { SAvatar, SBadge, SButton, SCard, SGrid } from '@sirius-ui/vue'

// A local vector illustration keeps this demo self-contained.
const portrait = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="#99f6e4"/><circle cx="64" cy="46" r="23" fill="#134e4a"/><path d="M20 128c0-31 19-50 44-50s44 19 44 50" fill="#134e4a"/></svg>')}`
const broken = ref(false)
const errorCount = ref(0)
</script>

<template>
  <section id="avatars" class="border-t border-line py-10" aria-labelledby="avatars-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="avatars-title" class="text-xl font-semibold tracking-tight">A familiar face</h3><SBadge>SAvatar</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Use an image, initials, or an icon to represent a person or workspace. Initials stay visible while the image loads and return if it fails.</p>
    <SCard>
      <template #header><h4 class="text-sm font-semibold">Four sizes, circular avatars</h4></template>
      <div class="flex flex-wrap items-end gap-6"><div v-for="size in (['sm','md','lg','xl'] as const)" :key="size" class="space-y-4 text-center"><div><SAvatar :src="portrait" name="Alex Morgan" :size="size" /></div><div><SAvatar name="Alex Morgan" :size="size" /></div><p class="text-xs text-content-muted">{{ size }}</p></div></div>
    </SCard>
    <SGrid :columns="3" class="mt-6">
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Names and initials</h4></template>
        <div class="flex flex-wrap items-center gap-4"><SAvatar name="Alex Morgan" /><SAvatar name="Taylor" /><SAvatar name="Sirius workspace" initials="SU" /><SAvatar alt="Anonymous teammate" /></div>
        <p class="mt-5 text-xs leading-relaxed text-content-muted">The full name remains available to assistive technology.</p>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">A rounded custom fallback</h4></template>
        <div class="flex items-center gap-3"><SAvatar name="Design workspace" shape="rounded"><template #fallback><Building2 aria-hidden="true" class="size-5" /></template></SAvatar><span class="text-sm">Design workspace</span></div>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Image error recovery</h4></template>
        <div class="flex items-center gap-3"><SAvatar :src="broken ? 'data:image/png;base64,invalid' : portrait" name="Alex Morgan" size="lg" @error="errorCount++" /><span class="text-xs text-content-muted">{{ errorCount }} image errors</span></div>
        <SButton class="mt-5" size="sm" variant="outline" @click="broken = !broken">{{ broken ? 'Restore avatar image' : 'Simulate image error' }}</SButton>
      </SCard>
    </SGrid>
    <SCard class="mt-6"><div class="flex items-center gap-3"><SAvatar :src="portrait" alt="" /><div><p class="text-sm font-medium">Alex Morgan</p><p class="text-xs text-content-muted">Decorative avatar beside a visible name</p></div></div></SCard>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SAvatar src="/avatars/alex.jpg" name="Alex Morgan" /&gt;
&lt;SAvatar name="Sirius workspace" initials="SU" shape="rounded" /&gt;
&lt;SAvatar src="/avatars/alex.jpg" alt="" /&gt;</code></pre>
  </section>
</template>
