<script setup lang="ts">
import { SBadge, SCard, SDivider } from '@sirius-ui/vue'
</script>

<template>
  <section id="dividers" class="border-t border-line py-10" aria-labelledby="dividers-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="dividers-title" class="text-xl font-semibold tracking-tight">Give content a clear pause</h3><SBadge>SDivider</SBadge></div>
    <SCard>
      <div class="space-y-6"><p class="text-sm text-content-muted">A simple horizontal separator.</p><SDivider /><p class="text-sm text-content-muted">Add an optional label when the division needs context.</p><SDivider label="Workspace settings" /><SDivider><SBadge>Or continue below</SBadge></SDivider><div class="flex flex-wrap items-center gap-3"><span class="text-sm text-content-muted">Draft</span><SDivider orientation="vertical" decorative /><span class="text-sm text-content-muted">Edited today</span><SDivider orientation="vertical" decorative /><span class="text-sm text-content-muted">Shared</span></div></div>
    </SCard>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SDivider /&gt;
&lt;SDivider label="Workspace settings" /&gt;
&lt;SDivider orientation="vertical" decorative /&gt;</code></pre>
  </section>
</template>
