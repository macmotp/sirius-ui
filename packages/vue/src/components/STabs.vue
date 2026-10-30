<script setup lang="ts" generic="T extends STabsItem">
import { computed, nextTick, shallowRef, useId, watch, useTemplateRef } from 'vue'
import type { STabsItem, STabsProps } from './STabs.types'

const props = withDefaults(defineProps<STabsProps<T>>(), { items: () => [], label: 'Tabs', orientation: 'horizontal', activation: 'automatic', variant: 'line', size: 'md', keepAlive: false })
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ change: [value: string] }>()
defineSlots<{ tab?(props: { item: T; selected: boolean }): unknown; panel?(props: { item: T; index: number }): unknown; default?(props: { item: T; index: number }): unknown }>()
const id = useId()
const list = useTemplateRef<HTMLElement>('list')
const focused = shallowRef('')
const enabled = computed(() => props.items.map((item, index) => item.disabled ? -1 : index).filter(index => index >= 0))
const selected = computed(() => props.items.find(item => item.value === model.value && !item.disabled)?.value ?? props.items[enabled.value[0] ?? -1]?.value ?? '')
const tabStop = computed(() => props.items.some(item => item.value === focused.value && !item.disabled) ? focused.value : selected.value)
watch(selected, value => { focused.value = value }, { immediate: true })
const sizes = { sm: 'gap-1.5 px-3 py-1.5 text-xs', md: 'gap-2 px-4 py-2 text-sm', lg: 'gap-2.5 px-5 py-2.5 text-base' }
function select(index: number) {
  const item = props.items[index]
  if (!item || item.disabled) return
  focused.value = item.value
  if (model.value !== item.value) {
    model.value = item.value
    emit('change', item.value)
  }
}
async function focus(index: number) {
  const item = props.items[index]
  if (!item || item.disabled) return
  focused.value = item.value
  if (props.activation === 'automatic') select(index)
  await nextTick()
  list.value?.querySelector<HTMLButtonElement>(`[data-tab-index="${index}"]`)?.focus()
}
function onKeydown(index: number, event: KeyboardEvent) {
  if (props.items[index]?.disabled || event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return
  const rtl = typeof window !== 'undefined' && list.value ? getComputedStyle(list.value).direction === 'rtl' : false
  const previous = props.orientation === 'vertical' ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'
  const next = props.orientation === 'vertical' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    focus((event.key === 'Home' ? enabled.value[0] : enabled.value[enabled.value.length - 1]) ?? -1)
  } else if (event.key === previous || event.key === next) {
    event.preventDefault()
    const current = enabled.value.indexOf(index)
    focus(enabled.value[(current + (event.key === next ? 1 : -1) + enabled.value.length) % enabled.value.length] ?? -1)
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select(index)
  }
}
function onFocusout(event: FocusEvent) {
  if (!list.value?.contains(event.relatedTarget as Node | null)) focused.value = selected.value
}
</script>

<template>
  <div class="min-w-0" :class="orientation === 'vertical' ? 'grid gap-6 sm:grid-cols-[12rem_minmax(0,1fr)]' : 'space-y-6'">
    <div
      ref="list"
      role="tablist"
      :aria-label="label"
      :aria-orientation="orientation"
      class="flex min-w-0 gap-1"
      :class="[orientation === 'vertical' ? 'flex-col self-start' : 'overflow-x-auto', variant === 'pills' ? 'rounded-2xl bg-surface p-1 ring-1 ring-inset ring-line' : orientation === 'vertical' ? 'border-e border-line' : 'border-b border-line']"
      @focusout="onFocusout"
    >
      <button
        v-for="(item, index) in items"
        :id="`${id}-tab-${index}`"
        :key="item.value"
        type="button"
        role="tab"
        :data-tab-index="index"
        :aria-controls="`${id}-panel-${index}`"
        :aria-selected="selected === item.value"
        :disabled="item.disabled"
        :tabindex="!item.disabled && tabStop === item.value ? 0 : -1"
        class="inline-flex min-w-0 shrink-0 cursor-pointer items-center border-solid text-start font-sans font-medium leading-6 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
        :class="[sizes[size], variant === 'pills' ? ['rounded-control border-0', selected === item.value ? 'bg-primary-soft text-primary-content' : 'bg-transparent text-content-muted enabled:hover:bg-surface-hover'] : ['bg-transparent', orientation === 'vertical' ? 'border-0 border-e-2' : 'border-0 border-b-2', selected === item.value ? 'border-primary text-primary-content' : 'border-transparent text-content-muted enabled:hover:bg-surface-hover']]"
        @click="select(index)"
        @focus="focused = item.value"
        @keydown="onKeydown(index, $event)"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          aria-hidden="true"
          focusable="false"
          class="size-[1em] shrink-0"
        />
        <span class="min-w-0 whitespace-nowrap"><slot name="tab" :item="item" :selected="selected === item.value">{{ item.label }}</slot></span>
      </button>
    </div>
    <div class="min-w-0">
      <div
        v-for="(item, index) in items"
        :id="`${id}-panel-${index}`"
        :key="item.value"
        role="tabpanel"
        :aria-labelledby="`${id}-tab-${index}`"
        :hidden="selected !== item.value"
        :tabindex="selected === item.value ? 0 : -1"
        class="min-w-0 break-words rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      >
        <template v-if="selected === item.value || keepAlive"><slot name="panel" :item="item" :index="index"><slot :item="item" :index="index" /></slot></template>
      </div>
    </div>
  </div>
</template>
