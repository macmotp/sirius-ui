<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useId, watch, useTemplateRef } from 'vue'
import { ChevronDown } from '@lucide/vue'
import SButton from './SButton.vue'
import type { SDropdownItem, SDropdownProps } from './SDropdown.types'

const props = withDefaults(defineProps<SDropdownProps>(), { items: () => [], label: 'Actions', disabled: false, align: 'end', size: 'md', variant: 'outline' })
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ select: [item: SDropdownItem, event: MouseEvent] }>()
defineSlots<{ trigger?(): unknown; icon?(props: { item: SDropdownItem }): unknown; item?(props: { item: SDropdownItem; active: boolean }): unknown }>()
const id = useId()
const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<InstanceType<typeof SButton>>('trigger')
const menu = useTemplateRef<HTMLElement>('menu')
const active = shallowRef(-1)
const above = shallowRef(false)
const offset = shallowRef(0)
const visible = computed(() => open.value && !props.disabled)
const enabled = computed(() => props.items.map((item, index) => item.disabled ? -1 : index).filter(index => index >= 0))
let initial: 'first' | 'last' = 'first'
let search = ''
let searchTimer: ReturnType<typeof setTimeout> | undefined

function focusTrigger() { trigger.value?.$el.focus() }
async function focusActive() {
  await nextTick()
  if (!visible.value || typeof window === 'undefined') return
  const element = menu.value?.querySelector<HTMLElement>(`[data-menu-index="${active.value}"]`)
  if (element) element.focus()
  else menu.value?.focus()
}
function position() {
  if (!visible.value || !root.value || !menu.value || typeof window === 'undefined') return
  const rect = root.value.getBoundingClientRect()
  const width = menu.value.offsetWidth
  above.value = rect.bottom + menu.value.offsetHeight + 8 > window.innerHeight && rect.top > window.innerHeight - rect.bottom
  const rtl = getComputedStyle(root.value).direction === 'rtl'
  const left = (props.align === 'end') !== rtl ? rect.right - width : rect.left
  offset.value = Math.max(8, Math.min(left, window.innerWidth - width - 8)) - left
}
function show(edge: 'first' | 'last' = 'first') {
  if (props.disabled) return
  initial = edge
  if (visible.value) {
    active.value = (edge === 'first' ? enabled.value[0] : enabled.value[enabled.value.length - 1]) ?? -1
    focusActive()
  } else open.value = true
}
function close(restore = true) {
  open.value = false
  search = ''
  clearTimeout(searchTimer)
  if (restore && !props.disabled) focusTrigger()
}
function toggle() { if (visible.value) close(); else show() }
function syncOpen() {
  if (!visible.value) return
  if (menu.value) menu.value.inert = false
  active.value = (initial === 'first' ? enabled.value[0] : enabled.value[enabled.value.length - 1]) ?? -1
  position()
  focusActive()
}
watch(visible, syncOpen, { flush: 'post' })
watch(() => props.disabled, value => { if (value) close(false) })
watch(() => props.items, () => {
  if (visible.value && (active.value < 0 || !props.items[active.value] || props.items[active.value]?.disabled)) {
    active.value = enabled.value[0] ?? -1
    focusActive()
  }
})
function outside(event: Event) {
  if (visible.value && event.target instanceof Node && !root.value?.contains(event.target)) close(false)
}
onMounted(() => {
  if (typeof document === 'undefined') return
  document.addEventListener('pointerdown', outside)
  document.addEventListener('focusin', outside)
  window.addEventListener('resize', position)
  window.addEventListener('scroll', position, true)
  syncOpen()
})
onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  if (typeof document === 'undefined') return
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('focusin', outside)
  window.removeEventListener('resize', position)
  window.removeEventListener('scroll', position, true)
})
function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    show(event.key === 'ArrowDown' ? 'first' : 'last')
  }
}
function onMenuKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    close()
  } else if (event.key === 'Tab') {
    // Return to the trigger before allowing normal forward/backward tabbing.
    close()
  } else if (event.key === ' ') {
    event.preventDefault()
    const target = event.target as HTMLElement
    if (target.getAttribute('role') === 'menuitem') target.click()
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    if (event.key === 'Home') active.value = enabled.value[0] ?? -1
    else if (event.key === 'End') active.value = enabled.value[enabled.value.length - 1] ?? -1
    else {
      const current = enabled.value.indexOf(active.value)
      active.value = enabled.value[(current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.value.length) % enabled.value.length] ?? -1
    }
    focusActive()
  } else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.isComposing) {
    event.preventDefault()
    search += event.key.toLocaleLowerCase()
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => { search = '' }, 500)
    const query = [...search].every(letter => letter === search[0]) ? search[0]! : search
    const start = enabled.value.indexOf(active.value)
    for (let step = 1; step <= enabled.value.length; step++) {
      const index = enabled.value[(start + step) % enabled.value.length]!
      if (props.items[index]?.label.toLocaleLowerCase().startsWith(query)) { active.value = index; focusActive(); break }
    }
  }
}
function select(item: SDropdownItem, event: MouseEvent) {
  if (props.disabled || item.disabled) { event.preventDefault(); event.stopPropagation(); return }
  emit('select', item, event)
  if (!event.defaultPrevented) close()
}
</script>

<template>
  <div ref="root" class="relative inline-flex max-w-full">
    <SButton
      :id="`${id}-trigger`"
      ref="trigger"
      :disabled="disabled"
      :variant="variant"
      :size="size"
      aria-haspopup="menu"
      :aria-expanded="visible"
      :aria-controls="`${id}-menu`"
      @click="toggle"
      @keydown="onTriggerKeydown"
    ><slot name="trigger">{{ label }}</slot><template #trailing><ChevronDown /></template></SButton>
    <div
      v-if="visible"
      :id="`${id}-menu`"
      ref="menu"
      role="menu"
      :aria-labelledby="`${id}-trigger`"
      tabindex="-1"
      class="absolute z-50 max-h-72 w-56 max-w-[calc(100vw_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-solid border-dialog-line bg-dialog p-1.5 text-content shadow-lg outline-none"
      :class="[align === 'start' ? 'start-0' : 'end-0', above ? 'bottom-full mb-2' : 'top-full mt-2']"
      :style="{ transform: `translateX(${offset}px)` }"
      @keydown="onMenuKeydown"
    >
      <template v-for="(item, index) in items" :key="item.id">
        <div v-if="item.separatorBefore && index > 0" role="separator" class="my-1 border-t border-line"></div>
        <component
          :is="item.disabled ? 'span' : item.href ? 'a' : 'button'"
          role="menuitem"
          :type="!item.disabled && !item.href ? 'button' : undefined"
          :href="!item.disabled ? item.href : undefined"
          :target="!item.disabled ? item.target : undefined"
          :rel="!item.disabled ? (item.rel ?? (item.target === '_blank' ? 'noopener noreferrer' : undefined)) : undefined"
          :aria-disabled="item.disabled || undefined"
          :tabindex="!item.disabled && index === active ? 0 : -1"
          :data-menu-index="index"
          class="flex w-full min-w-0 items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-2 text-left font-sans text-sm leading-6 no-underline outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
          :class="[item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-surface-hover focus:bg-surface-hover', item.danger ? 'text-danger-content' : 'text-content']"
          @focus="active = index"
          @click="select(item, $event)"
        >
          <span v-if="item.icon || $slots.icon" aria-hidden="true" class="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-full"><slot name="icon" :item="item"><component :is="item.icon" v-if="item.icon" /></slot></span>
          <span class="min-w-0 flex-1 break-words"><slot name="item" :item="item" :active="index === active">{{ item.label }}</slot></span>
        </component>
      </template>
      <p v-if="!items.length" role="presentation" class="m-0 px-3 py-2 text-sm text-content-muted">No actions available.</p>
    </div>
  </div>
</template>
