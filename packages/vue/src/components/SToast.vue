<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '@lucide/vue'
import { useToastTimer } from '../composables/useToastTimer'
import type { SToastDismissReason, SToastProps } from './SToast.types'

const props = withDefaults(defineProps<SToastProps>(), { color: 'primary', duration: 5000, role: 'status', dismissLabel: 'Dismiss notification' })
const open = defineModel<boolean>('open', { default: true })
const emit = defineEmits<{ dismiss: [reason: SToastDismissReason] }>()
defineSlots<{ actions?(): unknown }>()
const panel = useTemplateRef<HTMLDivElement>('panel')
const id = useId()
const announcement = shallowRef('')
const icons = { primary: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert }
const colors = { primary: 'bg-primary-soft text-primary-content', success: 'bg-success-soft text-success-content', warning: 'bg-warning-soft text-warning-content', danger: 'bg-danger-soft text-danger-content' }
let previousFocus: HTMLElement | null = null
let mounted = false
async function announce() {
  announcement.value = ''
  await nextTick()
  if (mounted && open.value) announcement.value = [props.title, props.description].filter(Boolean).join('. ')
}
function dismiss(reason: SToastDismissReason) {
  if (!open.value) return
  const restore = typeof document !== 'undefined' && panel.value?.contains(document.activeElement) ? previousFocus : null
  open.value = false
  emit('dismiss', reason)
  if (restore) nextTick(() => { if (restore.isConnected) restore.focus() })
}
const { pause, resume } = useToastTimer(open, () => props.duration, () => dismiss('timeout'))
function onFocusin(event: FocusEvent) {
  if (event.relatedTarget instanceof HTMLElement && !panel.value?.contains(event.relatedTarget)) previousFocus = event.relatedTarget
  pause('focus')
}
function onFocusout(event: FocusEvent) {
  if (!(event.relatedTarget instanceof Node) || !panel.value?.contains(event.relatedTarget)) resume('focus')
}
function visibility() { if (document.hidden) pause('hidden'); else resume('hidden') }
function blur() { pause('window') }
function focus() { resume('window') }
onMounted(() => {
  mounted = true
  announce()
  if (typeof document === 'undefined') return
  visibility()
  if (!document.hasFocus()) pause('window')
  document.addEventListener('visibilitychange', visibility)
  window.addEventListener('blur', blur)
  window.addEventListener('focus', focus)
})
watch(() => [open.value, props.title, props.description], announce)
watch(open, value => {
  if (!value) { resume('pointer'); resume('focus') }
})
onBeforeUnmount(() => {
  mounted = false
  if (typeof document === 'undefined') return
  document.removeEventListener('visibilitychange', visibility)
  window.removeEventListener('blur', blur)
  window.removeEventListener('focus', focus)
})
</script>

<template>
  <div class="min-w-0">
    <span :role="role" aria-atomic="true" class="sr-only">{{ announcement }}</span>
    <div
      v-if="open"
      ref="panel"
      role="group"
      :aria-labelledby="`${id}-title`"
      :aria-describedby="description ? `${id}-description` : undefined"
      class="sirius-toast pointer-events-auto flex min-w-0 items-start gap-3 rounded-2xl border border-solid border-dialog-line bg-dialog p-4 font-sans text-sm leading-6 text-content shadow-sm"
      @pointerenter="event => { if (event.pointerType !== 'touch') pause('pointer') }"
      @pointerleave="resume('pointer')"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <span aria-hidden="true" class="inline-flex size-8 shrink-0 items-center justify-center rounded-full" :class="colors[color]">
        <component :is="icons[color]" focusable="false" class="size-5" />
      </span>
      <div class="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
        <div :id="`${id}-title`" class="font-semibold">{{ title }}</div>
        <p v-if="description" :id="`${id}-description`" class="mb-0 mt-1 text-content-muted">{{ description }}</p>
        <div v-if="$slots.actions" class="mt-3 flex flex-wrap gap-2"><slot name="actions" /></div>
      </div>
      <button type="button" :aria-label="dismissLabel" class="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-content-muted hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" @click="dismiss('close-button')">
        <X aria-hidden="true" focusable="false" class="size-4" />
      </button>
    </div>
  </div>
</template>
