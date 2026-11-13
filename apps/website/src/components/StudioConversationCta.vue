<script setup lang="ts">
import { SButton } from '@sirius-ui/vue'
import { SWebsiteCta } from '@sirius-ui/website'
withDefaults(defineProps<{ headingLevel?: 2 | 3 | 4 }>(), { headingLevel: 2 })
</script>

<template>
  <SWebsiteCta :heading-level="headingLevel" title="Something on your mind?" description="A new idea, a fresh direction, or a question worth exploring. We’d love to hear it."><template #actions><SButton href="#contact" size="lg">Let’s talk <span aria-hidden="true" class="ms-2">↗</span></SButton></template></SWebsiteCta>
</template>
