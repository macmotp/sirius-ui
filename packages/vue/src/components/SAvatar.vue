<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { UserRound } from '@lucide/vue'
import type { SAvatarProps } from './SAvatar.types'

const props = withDefaults(defineProps<SAvatarProps>(), { size: 'md', shape: 'circle' })
const emit = defineEmits<{ load: [event: Event]; error: [event: Event] }>()
defineSlots<{ fallback?(props: { initials: string }): unknown }>()
const loaded = shallowRef(false)
const failed = shallowRef(false)
const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-12 text-base', xl: 'size-16 text-lg' }
const initials = computed(() => {
  if (props.initials !== undefined) return Array.from(props.initials.trim()).slice(0, 2).join('').toLocaleUpperCase()
  const words = props.name?.trim().split(/\s+/).filter(Boolean) ?? []
  const first = Array.from(words[0] ?? '')[0] ?? ''
  const last = words.length > 1 ? Array.from(words[words.length - 1] ?? '')[0] ?? '' : ''
  return `${first}${last}`.toLocaleUpperCase()
})
const label = computed(() => props.alt ?? (props.name?.trim() || 'User avatar'))
watch(() => props.src, () => { loaded.value = false; failed.value = false })
function onLoad(event: Event) { loaded.value = true; emit('load', event) }
function onError(event: Event) { loaded.value = false; failed.value = true; emit('error', event) }
</script>

<template>
  <span
    :role="label === '' ? undefined : 'img'"
    :aria-label="label || undefined"
    :aria-hidden="label === '' || undefined"
    class="relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-primary-soft align-middle font-sans font-semibold text-primary-content after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line"
    :class="[sizes[size], shape === 'circle' ? 'rounded-full' : 'rounded-2xl']"
  >
    <span v-if="!loaded || failed || !src" aria-hidden="true" class="contents"><slot name="fallback" :initials="initials"><span v-if="initials">{{ initials }}</span><UserRound
          v-else
          aria-hidden="true"
          focusable="false"
          class="size-1/2"
        /></slot></span>
    <img
      v-if="src && !failed"
      :key="src"
      :src="src"
      alt=""
      aria-hidden="true"
      decoding="async"
      class="absolute inset-0 size-full object-cover"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="onLoad"
      @error="onError"
    />
  </span>
</template>
