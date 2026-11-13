<script setup lang="ts">
import { SCopyButton } from '@sirius-ui/vue'
import type { StudioArticleCode } from '../content'
defineProps<{ code: StudioArticleCode }>()
</script>

<template>
  <figure class="mx-0 my-8 min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
    <figcaption class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3"><div class="min-w-0"><span class="block text-sm font-medium text-content wrap-anywhere">{{ code.title }}</span><span class="text-xs text-content-muted">{{ code.language }}</span></div><SCopyButton :text="code.text" :label="`Copy ${code.language} example`" copied-label="Code copied" /></figcaption>
    <pre role="region" :aria-label="`Code example: ${code.title}`" tabindex="0" class="m-0 max-h-96 overflow-auto p-5 text-sm leading-7 text-content focus-visible:-outline-offset-2"><code class="font-mono">{{ code.text }}</code></pre>
  </figure>
</template>
