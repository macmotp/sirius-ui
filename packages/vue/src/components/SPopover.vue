<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { X } from '@lucide/vue'
import type { SPopoverDismissReason, SPopoverPlacement, SPopoverProps, SPopoverTrigger } from './SPopover.types'

const props = withDefaults(defineProps<SPopoverProps>(), { placement: 'bottom', align: 'start', disabled: false, closeLabel: 'Close popover' })
defineOptions({ inheritAttrs: false })
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ dismiss: [reason: SPopoverDismissReason] }>()
defineSlots<{ trigger(props: { trigger: SPopoverTrigger }): unknown; default(props: { close: () => void }): unknown }>()
const id = useId()
const root = useTemplateRef<HTMLElement>('root')
const panel = useTemplateRef<HTMLElement>('panel')
const anchor = shallowRef<HTMLElement | null>(null)
const nativePopover = shallowRef(false)
const positioned = shallowRef(false)
const left = shallowRef(0)
const top = shallowRef(0)
const side = shallowRef<SPopoverPlacement>(props.placement)
let observer: ResizeObserver | undefined
let mounted = false
let restoreFocus = true

function close(reason: SPopoverDismissReason = 'close', restore = true) {
  if (!open.value) return
  restoreFocus = restore
  open.value = false
  emit('dismiss', reason)
}
function toggle(event: MouseEvent) {
  if (props.disabled) return
  anchor.value = event.currentTarget as HTMLElement
  if (open.value) close()
  else { restoreFocus = true; open.value = true }
}
const trigger = computed<SPopoverTrigger>(() => ({
  'aria-haspopup': 'dialog', 'aria-expanded': open.value && !props.disabled, 'aria-controls': `${id}-popover`,
  disabled: props.disabled, onClick: toggle,
}))
function position() {
  if (!open.value || !anchor.value || !panel.value || typeof window === 'undefined') return
  const rect = anchor.value.getBoundingClientRect()
  const width = panel.value.offsetWidth
  const height = panel.value.offsetHeight
  const space = { top: rect.top - 8, bottom: window.innerHeight - rect.bottom - 8, left: rect.left - 8, right: window.innerWidth - rect.right - 8 }
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
  let placement = props.placement
  const vertical = (value: SPopoverPlacement) => value === 'top' || value === 'bottom'
  if (space[placement] < (vertical(placement) ? height : width) && space[opposite[placement]] > space[placement]) placement = opposite[placement]
  const x = vertical(placement)
    ? props.align === 'start' ? rect.left : props.align === 'end' ? rect.right - width : rect.left + (rect.width - width) / 2
    : placement === 'left' ? rect.left - width - 8 : rect.right + 8
  const y = !vertical(placement)
    ? props.align === 'start' ? rect.top : props.align === 'end' ? rect.bottom - height : rect.top + (rect.height - height) / 2
    : placement === 'top' ? rect.top - height - 8 : rect.bottom + 8
  left.value = Math.max(8, Math.min(x, window.innerWidth - width - 8))
  top.value = Math.max(8, Math.min(y, window.innerHeight - height - 8))
  side.value = placement
  positioned.value = true
}
function escape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value || event.defaultPrevented) return
  event.preventDefault()
  event.stopPropagation()
  close('escape')
}
function outside(event: Event) {
  if (open.value && event.target instanceof Node && !root.value?.contains(event.target)) close('outside', false)
}
async function sync() {
  if (!mounted || typeof document === 'undefined') return
  observer?.disconnect()
  positioned.value = false
  if (!open.value) {
    if (restoreFocus && anchor.value?.isConnected) anchor.value.focus()
    restoreFocus = true
    return
  }
  if (props.disabled) { open.value = false; return }
  await nextTick()
  if (!open.value || !panel.value) return
  anchor.value ??= root.value?.querySelector<HTMLElement>('[aria-haspopup="dialog"]') ?? null
  if (nativePopover.value && !panel.value.matches(':popover-open')) panel.value.showPopover()
  position()
  await nextTick()
  if (!mounted || !open.value || !panel.value) return
  observer?.observe(panel.value)
  if (anchor.value) observer?.observe(anchor.value)
  const focusable = Array.from(panel.value.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]'))
    .find(element => !element.matches(':disabled, [inert], [tabindex="-1"]') && element.getClientRects().length)
  const target = focusable ?? panel.value
  target.focus({ preventScroll: true })
}
watch(open, value => {
  if (!value && typeof document !== 'undefined' && !panel.value?.contains(document.activeElement)) restoreFocus = false
})
watch(open, sync, { flush: 'post' })
watch(() => props.disabled, value => { if (value) close('close') })
watch(() => [props.placement, props.align], position, { flush: 'post' })
onMounted(() => {
  mounted = true
  if (typeof document === 'undefined') return
  nativePopover.value = typeof HTMLElement.prototype.showPopover === 'function'
  if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(position)
  document.addEventListener('pointerdown', outside)
  document.addEventListener('focusin', outside)
  window.addEventListener('resize', position)
  window.addEventListener('scroll', position, true)
  void sync()
})
onBeforeUnmount(() => {
  mounted = false
  observer?.disconnect()
  if (typeof document === 'undefined') return
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('focusin', outside)
  window.removeEventListener('resize', position)
  window.removeEventListener('scroll', position, true)
})
</script>

<template>
  <div ref="root" class="inline-flex max-w-full align-middle" @keydown="escape">
    <slot name="trigger" :trigger="trigger" />
    <div v-if="open && !disabled" :id="`${id}-popover`" ref="panel" v-bind="$attrs" role="dialog" :aria-labelledby="`${id}-title`" :aria-describedby="description ? `${id}-description` : undefined" :popover="nativePopover ? 'manual' : undefined" tabindex="-1" :data-placement="side" class="sirius-popover fixed inset-auto z-50 m-0 box-border w-80 max-w-[calc(100vw_-_1rem)] max-h-[calc(100dvh_-_1rem)] overflow-y-auto rounded-2xl border border-solid border-dialog-line bg-dialog p-6 text-start font-sans text-sm text-content shadow-lg outline-none" :style="{ left: `${left}px`, top: `${top}px`, visibility: positioned ? 'visible' : 'hidden' }">
      <div class="mb-4 flex items-start justify-between gap-4">
        <div class="min-w-0"><h3 :id="`${id}-title`" class="m-0 break-words text-sm font-semibold">{{ title }}</h3><p v-if="description" :id="`${id}-description`" class="mt-1 mb-0 text-xs leading-relaxed text-content-muted">{{ description }}</p></div>
        <button type="button" :aria-label="closeLabel" class="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-content-muted hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus" @click="close()"><X class="size-4" aria-hidden="true" /></button>
      </div>
      <slot :close="() => close()" />
    </div>
  </div>
</template>
