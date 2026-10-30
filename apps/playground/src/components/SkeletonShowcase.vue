<script setup lang="ts">
import { shallowRef } from 'vue'
import { SAvatar, SBadge, SButton, SCard, SCheckbox, SGrid, SSkeleton } from '@sirius-ui/vue'

const loading = shallowRef(true)
const animated = shallowRef(true)
</script>

<template>
  <section id="skeletons" class="border-t border-line py-10" aria-labelledby="skeletons-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="skeletons-title" class="text-xl font-semibold tracking-tight">Make room while content loads</h3><SBadge>SSkeleton</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Match the shape of the content that is coming next. Skeletons are decorative; the surrounding region supplies the loading state and message.</p>
    <div class="mb-6 flex flex-wrap items-center gap-5"><SButton variant="outline" size="sm" @click="loading = !loading">{{ loading ? 'Show loaded profile' : 'Show loading profile' }}</SButton><SCheckbox v-model="animated" label="Animate skeletons" /></div>
    <SGrid :columns="2">
      <SCard role="region" aria-label="Profile preview" :aria-busy="loading">
        <div v-if="loading" class="space-y-6"><div class="flex items-center gap-4"><SSkeleton shape="circle" :width="48" :height="48" :animated="animated" /><div class="min-w-0 flex-1 space-y-3"><SSkeleton width="60%" :animated="animated" /><SSkeleton width="85%" :height="12" :animated="animated" /></div></div><SSkeleton shape="rounded" :height="112" :animated="animated" /><div class="space-y-3"><SSkeleton :animated="animated" /><SSkeleton width="75%" :animated="animated" /></div></div>
        <div v-else class="space-y-6"><div class="flex items-center gap-4"><SAvatar name="Alex Morgan" size="lg" /><div><h4 class="font-semibold">Alex Morgan</h4><p class="text-sm text-content-muted">Workspace designer</p></div></div><div class="flex min-h-28 items-center rounded-2xl bg-primary-soft p-5 text-sm leading-6 text-primary-content">A shared space for ideas, notes, and the next thing your team is building.</div><p class="text-sm leading-6 text-content-muted">Your profile is ready. This is a local loading demonstration.</p></div>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Text, circular, and rounded shapes</h4></template>
        <div class="space-y-6"><SSkeleton :animated="animated" /><SSkeleton width="70%" :height="12" :animated="animated" /><div class="flex items-center gap-4"><SSkeleton shape="circle" :animated="animated" /><SSkeleton shape="circle" :width="64" :height="64" :animated="animated" /></div><SSkeleton shape="rounded" :height="80" :animated="animated" /></div>
      </SCard>
    </SGrid>
    <p role="status" class="mt-4 text-xs text-content-muted">{{ loading ? 'Loading profile preview.' : 'Profile preview loaded.' }}</p>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;div :aria-busy="loading"&gt;
  &lt;SSkeleton v-if="loading" shape="circle" :width="48" :height="48" /&gt;
  &lt;Profile v-else /&gt;
&lt;/div&gt;</code></pre>
  </section>
</template>
