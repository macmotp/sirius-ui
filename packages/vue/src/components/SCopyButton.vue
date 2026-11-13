<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, useAttrs, useId, watch } from 'vue'
import SButton from './SButton.vue'
import SIcon from './SIcon.vue'
import type { SCopyButtonProps, SCopyButtonState } from './SCopyButton.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SCopyButtonProps>(), {
  label: 'Copy', copiedLabel: 'Copied', errorLabel: 'Copy failed',
  errorDescription: 'Select the text and copy it manually.',
  disabled: false, size: 'sm', variant: 'ghost', color: 'primary', resetDelay: 2000,
})
const emit = defineEmits<{ copied: [text: string]; error: [error: unknown] }>()
defineSlots<{ default?(state: SCopyButtonState): unknown; icon?(state: SCopyButtonState): unknown }>()
const attrs = useAttrs()
const id = useId()
const feedback = shallowRef<'idle' | 'copied' | 'error'>('idle')
const pending = shallowRef(false)
const state = computed<SCopyButtonState>(() => ({ copied: feedback.value === 'copied', failed: feedback.value === 'error', pending: pending.value }))
const buttonLabel = computed(() => state.value.copied ? props.copiedLabel : state.value.failed ? props.errorLabel : props.label)
const announcement = computed(() => state.value.copied ? props.copiedLabel : state.value.failed ? `${props.errorLabel}. ${props.errorDescription}` : '')
function describedBy() {
  return [typeof attrs['aria-describedby'] === 'string' && attrs['aria-describedby'], state.value.failed && props.errorDescription && id].filter(Boolean).join(' ') || undefined
}
let timer: ReturnType<typeof setTimeout> | undefined
let sequence = 0
let active = true

function reset() {
  clearTimeout(timer)
  feedback.value = 'idle'
}
function finish(result: 'copied' | 'error') {
  reset()
  feedback.value = result
  const delay = Number.isFinite(props.resetDelay) ? Math.max(0, props.resetDelay) : 2000
  if (delay > 0) timer = setTimeout(reset, delay)
}
watch(() => props.text, () => {
  sequence++
  reset()
})
onBeforeUnmount(() => {
  active = false
  sequence++
  clearTimeout(timer)
})

async function copy() {
  if (props.disabled || pending.value) return
  const request = ++sequence
  const text = props.text
  reset()
  pending.value = true
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) throw new Error('Clipboard writing is unavailable.')
    await navigator.clipboard.writeText(text)
    if (!active || request !== sequence) return
    finish('copied')
    emit('copied', text)
  } catch (error) {
    if (!active || request !== sequence) return
    finish('error')
    emit('error', error)
  } finally {
    if (active) pending.value = false
  }
}
</script>

<template>
  <span class="inline-flex max-w-full flex-wrap items-center gap-2">
    <SButton v-bind="attrs" as="button" :href="undefined" type="button" :size="size" :variant="variant" :color="color" :disabled="disabled" :loading="pending" :aria-describedby="describedBy()" @click="copy">
      <template #leading><slot name="icon" v-bind="state"><SIcon :name="state.copied ? 'check' : state.failed ? 'warning' : 'copy'" /></slot></template>
      <slot v-bind="state">{{ buttonLabel }}</slot>
    </SButton>
    <span v-if="state.failed && errorDescription" :id="id" class="text-xs leading-5 text-danger-content">{{ errorDescription }}</span>
    <span role="status" aria-live="polite" aria-atomic="true" class="sr-only">{{ announcement }}</span>
  </span>
</template>
