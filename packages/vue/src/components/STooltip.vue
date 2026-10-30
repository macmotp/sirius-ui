<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useId, watch, useTemplateRef } from 'vue'
import type { STooltipPlacement, STooltipProps, STooltipTrigger } from './STooltip.types'

const props = withDefaults(defineProps<STooltipProps>(), { text: '', placement: 'top', delay: 300, disabled: false })
defineSlots<{ default(props: { trigger: STooltipTrigger }): unknown; content?(): unknown }>()
const id = useId()
const root = useTemplateRef<HTMLElement>('root')
const tooltip = useTemplateRef<HTMLElement>('tooltip')
const visible = shallowRef(false)
const positioned = shallowRef(false)
const top = shallowRef(0)
const left = shallowRef(0)
const side = shallowRef<STooltipPlacement>(props.placement)
const popover = shallowRef(false)
let hovered = false
let focused = false
let dismissed = false
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
function clearTimers() { clearTimeout(showTimer); clearTimeout(hideTimer) }
function show(immediate = false) {
  clearTimers()
  if (props.disabled || dismissed || visible.value) return
  if (immediate || props.delay <= 0) visible.value = true
  else showTimer = setTimeout(() => { if (!props.disabled && !dismissed && (hovered || focused)) visible.value = true }, props.delay)
}
function leave() {
  clearTimers()
  if (hovered || focused) return
  dismissed = false
  // Allow the pointer to cross the gap from the trigger to the tooltip.
  hideTimer = setTimeout(() => { if (!hovered && !focused) visible.value = false }, 100)
}
function onPointerenter(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  hovered = true
  show()
}
function onPointerleave() { hovered = false; leave() }
function onFocus() { focused = true; show(true) }
function onBlur() { focused = false; leave() }
function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !visible.value) return
  event.preventDefault()
  event.stopPropagation()
  clearTimers()
  dismissed = true
  visible.value = false
}
const trigger = computed<STooltipTrigger>(() => ({
  'aria-describedby': [props.describedBy, !props.disabled && `${id}-tooltip`].filter(Boolean).join(' ') || undefined,
  onFocus, onBlur, onKeydown: onEscape,
}))
function position() {
  if (!visible.value || !root.value || !tooltip.value || typeof window === 'undefined') return
  const rect = root.value.getBoundingClientRect()
  const width = tooltip.value.offsetWidth
  const height = tooltip.value.offsetHeight
  const space = { top: rect.top - 8, bottom: window.innerHeight - rect.bottom - 8, left: rect.left - 8, right: window.innerWidth - rect.right - 8 }
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
  let placement = props.placement
  const fits = (candidate: STooltipPlacement) => space[candidate] >= (candidate === 'top' || candidate === 'bottom' ? height : width)
  if (!fits(placement)) {
    if (fits(opposite[placement])) placement = opposite[placement]
    else {
      const alternatives: STooltipPlacement[] = placement === 'left' || placement === 'right' ? ['top', 'bottom'] : ['left', 'right']
      const fitting = alternatives.filter(fits).sort((a, b) => space[b] - space[a])[0]
      if (fitting) placement = fitting
      else if (space[opposite[placement]] > space[placement]) placement = opposite[placement]
    }
  }
  const x = placement === 'left' ? rect.left - width - 8 : placement === 'right' ? rect.right + 8 : rect.left + (rect.width - width) / 2
  const y = placement === 'top' ? rect.top - height - 8 : placement === 'bottom' ? rect.bottom + 8 : rect.top + (rect.height - height) / 2
  left.value = Math.max(8, Math.min(x, window.innerWidth - width - 8))
  top.value = Math.max(8, Math.min(y, window.innerHeight - height - 8))
  side.value = placement
  positioned.value = true
}
async function sync() {
  if (!visible.value) {
    positioned.value = false
    if (popover.value && tooltip.value?.matches(':popover-open')) tooltip.value.hidePopover()
    return
  }
  positioned.value = false
  await nextTick()
  if (!visible.value) return
  if (popover.value && !tooltip.value?.matches(':popover-open')) tooltip.value?.showPopover()
  position()
}
watch(visible, sync, { flush: 'post' })
watch(() => [props.placement, props.text], async () => { await nextTick(); position() })
watch(() => props.disabled, value => {
  if (value) { clearTimers(); visible.value = false }
})
onMounted(() => {
  if (typeof document === 'undefined') return
  popover.value = typeof HTMLElement.prototype.showPopover === 'function'
  document.addEventListener('keydown', onEscape, true)
  window.addEventListener('resize', position)
  window.addEventListener('scroll', position, true)
})
onBeforeUnmount(() => {
  clearTimers()
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onEscape, true)
  window.removeEventListener('resize', position)
  window.removeEventListener('scroll', position, true)
})
</script>

<template>
  <span
    ref="root"
    class="inline-flex max-w-full align-middle"
    @pointerenter="onPointerenter"
    @pointerleave="onPointerleave"
  >
    <slot :trigger="trigger" />
    <span
      :id="`${id}-tooltip`"
      ref="tooltip"
      role="tooltip"
      :popover="popover ? 'manual' : undefined"
      :data-placement="side"
      :aria-hidden="!visible"
      class="fixed inset-auto z-50 m-0 w-max max-w-[min(20rem,calc(100vw_-_1rem))] max-h-[calc(100dvh_-_1rem)] overflow-y-auto rounded-xl border border-solid border-dialog-line bg-dialog px-3 py-2 text-start font-sans text-xs leading-5 break-words whitespace-normal text-content shadow-md"
      :style="{ left: `${left}px`, top: `${top}px`, visibility: visible && positioned ? 'visible' : 'hidden' }"
    ><slot name="content">{{ text }}</slot></span>
  </span>
</template>
