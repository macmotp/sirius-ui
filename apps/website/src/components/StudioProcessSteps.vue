<script setup lang="ts">
import { SGrid } from '@sirius-ui/vue'
import { processSteps } from '../content'
withDefaults(defineProps<{ headingLevel?: 3 | 4 | 5 | 6 }>(), { headingLevel: 3 })
</script>

<template>
  <SGrid :columns="4" class="gap-8"><article v-for="(step, index) in processSteps" :key="step.title"><p class="m-0 mb-8 text-sm text-primary-content">0{{ index + 1 }}</p><component :is="`h${headingLevel}`" class="m-0 text-lg font-semibold tracking-tight">{{ step.title }}</component><p class="mt-3 mb-0 text-sm leading-7 text-content-muted">{{ step.description }}</p></article></SGrid>
</template>
