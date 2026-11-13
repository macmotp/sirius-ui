<script setup lang="ts">
import { SGrid } from '@sirius-ui/vue'
import { services } from '../data'
withDefaults(defineProps<{ headingLevel?: 3 | 4 | 5 | 6 }>(), { headingLevel: 3 })
</script>

<template>
  <SGrid :columns="3" class="gap-8">
    <article v-for="service in services" :key="service.number" class="border-t border-line pt-5">
      <span class="text-xs text-content-subtle">{{ service.number }}</span>
      <component :is="`h${headingLevel}`" class="mt-8 mb-3 text-xl font-semibold tracking-tight"><a :href="`#services/${service.id}`" class="rounded text-content no-underline hover:text-primary-content">{{ service.title }} <span aria-hidden="true" class="ms-1 text-primary-content">↗</span></a></component>
      <p class="m-0 text-sm leading-7 text-content-muted">{{ service.description }}</p>
      <p class="mt-8 mb-0 text-xs leading-6 text-content-subtle">{{ service.details }}</p>
    </article>
  </SGrid>
</template>
