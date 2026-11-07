<script setup lang="ts">
import { computed } from 'vue'
import { useSiriusIcon } from '../icons/context'
import { fallbackPaths } from '../icons/fallbacks'
import type { SIconName } from '../icons/context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ name: string; label?: string }>()
const icon = useSiriusIcon(() => props.name)
const path = computed(() => fallbackPaths[props.name as SIconName])
</script>

<template>
  <component :is="icon" v-if="icon" v-bind="$attrs" :aria-hidden="label ? undefined : 'true'" :aria-label="label" :role="label ? 'img' : undefined" focusable="false" />
  <svg v-else v-bind="$attrs" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :aria-hidden="label ? undefined : 'true'" :aria-label="label" :role="label ? 'img' : undefined" focusable="false">
    <path v-if="path" :d="path" />
  </svg>
</template>
