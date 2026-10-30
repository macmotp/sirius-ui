<script setup lang="ts" generic="T extends SAccordionItem">
import { computed, useId, useTemplateRef } from 'vue'
import { ChevronDown } from '@lucide/vue'
import type { SAccordionItem, SAccordionProps } from './SAccordion.types'
const props = withDefaults(defineProps<SAccordionProps<T>>(), { items: () => [], multiple: false, headingLevel: 3, keepAlive: false })
const model = defineModel<string[]>({ default: () => [] })
const emit = defineEmits<{ change: [value: string[]] }>()
defineSlots<{ title?(props: { item: T; expanded: boolean }): unknown; default?(props: { item: T; index: number }): unknown }>()
const id = useId()
const root = useTemplateRef<HTMLElement>('root')
const enabled = computed(() => props.items
  .map((item, index) => item.disabled ? -1 : index)
  .filter(index => index >= 0))
const expanded = computed(() => {
  const values = props.items.filter(item => model.value.includes(item.value)).map(item => item.value)
  return props.multiple ? values : values.slice(0, 1)
})
function toggle(item: T) {
  if (item.disabled) return
  const next = expanded.value.includes(item.value) ? expanded.value.filter(value => value !== item.value) : props.multiple ? [...expanded.value, item.value] : [item.value]
  model.value = next
  emit('change', next)
}
function onKeydown(index: number, event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return
  const indices = enabled.value
  const position = indices.indexOf(index)
  let target: number | undefined
  if (event.key === 'ArrowDown') target = indices[(position + 1) % indices.length]
  else if (event.key === 'ArrowUp') target = indices[(position - 1 + indices.length) % indices.length]
  else if (event.key === 'Home') target = indices[0]
  else if (event.key === 'End') target = indices[indices.length - 1]
  if (target === undefined) return
  event.preventDefault()
  root.value?.querySelector<HTMLButtonElement>(`[data-accordion-index="${target}"]`)?.focus()
}
</script>
<template>
  <div
    ref="root"
    class="relative min-w-0 rounded-2xl bg-surface font-sans text-content after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line"
  >
    <div v-for="(item, index) in items" :key="item.value" :class="{ 'border-t border-solid border-line': index > 0 }">
      <component :is="`h${headingLevel}`" class="m-0 text-sm font-semibold">
        <button
          :id="`${id}-trigger-${index}`"
          type="button"
          :data-accordion-index="index"
          :aria-expanded="expanded.includes(item.value)"
          :aria-controls="`${id}-panel-${index}`"
          :disabled="item.disabled"
          class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border-0 bg-transparent px-6 py-5 text-start font-[inherit] text-[inherit] enabled:hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50"
          @click="toggle(item)"
          @keydown="onKeydown(index, $event)"
        >
          <span class="min-w-0 break-words"><slot name="title" :item="item" :expanded="expanded.includes(item.value)">{{ item.label }}</slot></span>
          <ChevronDown
            aria-hidden="true"
            focusable="false"
            class="size-5 shrink-0 transition-transform motion-reduce:transition-none"
            :class="{ 'rotate-180': expanded.includes(item.value) }"
          />
        </button>
      </component>
      <div :id="`${id}-panel-${index}`" :hidden="!expanded.includes(item.value)" :aria-labelledby="`${id}-trigger-${index}`">
        <div v-if="keepAlive || expanded.includes(item.value)" class="min-w-0 break-words px-6 pb-6 text-sm leading-6 text-content-muted"><slot :item="item" :index="index">{{ item.content }}</slot></div>
      </div>
    </div>
  </div>
</template>
