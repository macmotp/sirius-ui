<script setup lang="ts">
import { shallowRef, useTemplateRef, watch } from 'vue'

const props = defineProps<{
  category: string
  entries: readonly { id: string; label: string; color: string; value: string }[]
  anchor: { x: number; y: number }
  plot: HTMLElement | null
  width: number
  height: number
}>()
const emit = defineEmits<{ dismiss: [] }>()
const tooltip = useTemplateRef<HTMLDivElement>('tooltip')
const position = shallowRef({ left: '8px', top: '8px', maxWidth: '272px', maxHeight: '224px', visibility: 'hidden' as 'hidden' | 'visible' })
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !event.isComposing) emit('dismiss')
}
function update() {
  const target = props.plot
  if (!target || !tooltip.value) return
  const width = target.clientWidth || props.width
  const height = target.clientHeight || props.height
  const maxWidth = Math.max(1, Math.min(288, width - 16))
  const maxHeight = Math.max(1, Math.min(288, height - 16))
  const tooltipWidth = Math.min(maxWidth, tooltip.value.offsetWidth || maxWidth)
  const tooltipHeight = Math.min(maxHeight, tooltip.value.offsetHeight || 48 + props.entries.length * 24)
  const x = props.anchor.x - (target.scrollLeft || 0)
  const y = props.anchor.y - (target.scrollTop || 0)
  const left = x + 12 + tooltipWidth <= width - 8 ? x + 12 : x - tooltipWidth - 12
  const top = y + 12 + tooltipHeight <= height - 8 ? y + 12 : y - tooltipHeight - 12
  position.value = {
    left: `${Math.max(8, Math.min(width - tooltipWidth - 8, left))}px`,
    top: `${Math.max(8, Math.min(height - tooltipHeight - 8, top))}px`,
    maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px`,
    visibility: x >= 0 && x <= width && y >= 0 && y <= height ? 'visible' : 'hidden',
  }
}
watch([() => props.anchor, () => props.entries, () => props.width, () => props.height], update, { flush: 'post' })
watch([() => props.plot, tooltip], ([target, element], _, onCleanup) => {
  if (!target || !element) return
  update()
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined
  observer?.observe(target)
  observer?.observe(element)
  target.addEventListener?.('scroll', update, { passive: true })
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', update)
    window.addEventListener('keydown', onKeydown)
  }
  onCleanup(() => {
    observer?.disconnect()
    target.removeEventListener?.('scroll', update)
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', update)
      window.removeEventListener('keydown', onKeydown)
    }
  })
}, { flush: 'post', immediate: true })
</script>

<template>
  <div ref="tooltip" class="sirius-chart__tooltip" :style="position" aria-hidden="true">
    <p class="sirius-chart__tooltip-title">{{ category }}</p>
    <div v-for="entry in entries" :key="entry.id" class="sirius-chart__tooltip-row">
      <span class="sirius-chart__tooltip-label"><span class="sirius-chart__tooltip-key" :style="{ backgroundColor: entry.color }"></span>{{ entry.label }}</span>
      <span class="sirius-chart__tooltip-value">{{ entry.value }}</span>
    </div>
  </div>
</template>
