<script setup lang="ts">
// A local component to demonstrate the adapter API without installing a router.
defineProps<{ href: string }>()
</script>

<template>
  <a :href="href"><slot /></a>
</template>
