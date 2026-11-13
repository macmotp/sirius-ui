<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'instagram'"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" /></template>
    <path v-else-if="name === 'facebook'" d="M14 21v-8h3l1-4h-4V7c0-1.3.5-2 2-2h2V2h-3c-3.3 0-5 2-5 5v2H7v4h3v8" />
    <path v-else-if="name === 'x'" d="m4 3 13 18h3L7 3H4Zm16 0-6.8 7.9M10.8 13.1 4 21" />
    <template v-else-if="name === 'youtube'"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 6 3-6 3V9Z" fill="currentColor" stroke="none" /></template>
    <path v-else-if="name === 'github'" d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.3-1.6-1-2 3-.4 6-1.5 6-6 0-1.2-.4-2.3-1.1-3.2.2-.8.2-2-.3-3.3-1.2-.1-2.7.5-3.6 1.1a12 12 0 0 0-6 0C8.1 4 6.6 3.4 5.4 3.5c-.5 1.3-.5 2.5-.3 3.3C4.4 7.7 4 8.8 4 10c0 4.5 3 5.6 6 6-.7.4-1 1-1 2v4" />
  </svg>
</template>
