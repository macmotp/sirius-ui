<script setup lang="ts">
defineProps<{ id: string; title: string; description: string; label: string; index?: number; previewClass?: string }>()
defineSlots<{ default?(): unknown; note?(): unknown }>()
</script>

<template>
  <article :aria-labelledby="id" class="min-w-0">
    <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0"><h3 :id="id" class="m-0 text-base font-semibold wrap-anywhere"><span v-if="index !== undefined" class="me-3 text-content-subtle">{{ String(index + 1).padStart(2, '0') }}</span>{{ title }}</h3><p class="mt-2 mb-0 text-sm leading-6 text-content-muted">{{ description }}</p></div>
      <span class="max-w-full rounded-full bg-surface px-3 py-1 text-xs text-content-muted wrap-anywhere ring-1 ring-inset ring-line">{{ label }}</span>
    </div>
    <div class="min-w-0 overflow-hidden rounded-2xl border border-line bg-canvas" :class="previewClass"><slot /></div>
    <slot name="note" />
  </article>
</template>
