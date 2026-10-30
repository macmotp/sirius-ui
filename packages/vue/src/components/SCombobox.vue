<script setup lang="ts" generic="T extends SComboboxOption">
import { computed, nextTick, shallowRef, useAttrs, useId, watch, watchEffect, useTemplateRef } from 'vue'
import { Check, ChevronDown, X } from '@lucide/vue'
import { controlAriaInvalid, controlBase, controlPadding, controlStateClasses, controlTextSizes, nativeControlAttrs } from './controlStyles'
import type { SComboboxOption, SComboboxProps } from './SCombobox.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SComboboxProps<T>>(), { options: () => [], placeholder: 'Search options…', size: 'md', disabled: false, readonly: false, invalid: false, valid: false, required: false, requiredMessage: 'Select an option from the list.', clearable: false, clearLabel: 'Clear selection', emptyText: 'No options found.' })
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ change: [value: string]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ option?(props: { option: T; selected: boolean; active: boolean }): unknown; leading?(props: { option: T | undefined }): unknown; empty?(): unknown }>()
const attrs = useAttrs()
const id = useId()
const input = useTemplateRef<HTMLInputElement>('input')
const list = useTemplateRef<HTMLElement>('list')
const expanded = shallowRef(false)
const query = shallowRef('')
const filtering = shallowRef(false)
const active = shallowRef(-1)
const selected = computed(() => props.options.find(option => option.value === model.value))
const filtered = computed(() => {
  const search = query.value.trim().toLocaleLowerCase()
  if (!filtering.value || !search) return props.options
  return props.options.filter(option => [option.label, option.value, ...(option.keywords ?? [])].some(text => text.toLocaleLowerCase().includes(search)))
})
const activeId = computed(() => expanded.value && active.value >= 0 ? `${id}-option-${active.value}` : undefined)
function inputAttrs() {
  const { name: _name, ...rest } = nativeControlAttrs(attrs)
  return rest
}
watch(selected, () => { if (!filtering.value) query.value = selected.value?.label ?? '' }, { immediate: true })
watchEffect(() => input.value?.setCustomValidity(props.required && !selected.value ? props.requiredMessage : ''))
watch(() => [props.disabled, props.readonly], () => { if (props.disabled || props.readonly) close() })
watch(filtered, () => {
  const current = filtered.value[active.value]
  if (active.value < 0 || !current || current.disabled) active.value = filtered.value.findIndex(option => !option.disabled)
})
async function revealActive() {
  await nextTick()
  list.value?.querySelector<HTMLElement>(`[data-index="${active.value}"]`)?.scrollIntoView({ block: 'nearest' })
}
function show() {
  if (props.disabled || props.readonly || expanded.value) return
  filtering.value = false
  expanded.value = true
  const index = filtered.value.findIndex(option => option.value === model.value && !option.disabled)
  active.value = index >= 0 ? index : filtered.value.findIndex(option => !option.disabled)
  revealActive()
}
function toggle() {
  if (props.disabled || props.readonly) return
  input.value?.focus()
  if (expanded.value) close()
  else show()
}
function close() {
  expanded.value = false
  filtering.value = false
  active.value = -1
  query.value = selected.value?.label ?? ''
}
function choose(option: T) {
  if (props.disabled || props.readonly || option.disabled) return
  model.value = option.value
  query.value = option.label
  expanded.value = false
  filtering.value = false
  active.value = -1
  emit('change', option.value)
}
function onInput(event: Event) {
  if (props.disabled || props.readonly) return
  query.value = (event.target as HTMLInputElement).value
  expanded.value = true
  filtering.value = true
  active.value = filtered.value.findIndex(option => !option.disabled)
}
function lastEnabled() {
  for (let index = filtered.value.length - 1; index >= 0; index--) if (!filtered.value[index]?.disabled) return index
  return -1
}
function move(direction: number) {
  const enabled = filtered.value.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0)
  if (!enabled.length) { active.value = -1; return }
  const current = enabled.indexOf(active.value)
  active.value = enabled[(current + direction + enabled.length) % enabled.length]!
  revealActive()
}
function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly || event.isComposing || event.keyCode === 229) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!expanded.value) { show(); if (event.key === 'ArrowUp') { active.value = lastEnabled(); revealActive() } }
    else move(event.key === 'ArrowDown' ? 1 : -1)
  } else if (expanded.value && (event.key === 'Home' || event.key === 'End')) {
    event.preventDefault()
    active.value = event.key === 'Home' ? filtered.value.findIndex(option => !option.disabled) : lastEnabled()
    revealActive()
  } else if (expanded.value && event.key === 'Enter') {
    event.preventDefault()
    const option = filtered.value[active.value]
    if (option) choose(option)
  } else if (expanded.value && event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    close()
  } else if (event.key === 'Tab') close()
}
function clear() {
  if (props.disabled || props.readonly) return
  model.value = ''
  query.value = ''
  close()
  emit('change', '')
  input.value?.focus()
}
function onBlur(event: FocusEvent) { close(); emit('blur', event) }
</script>

<template>
  <div class="relative min-w-0" :class="attrs.class" :style="attrs.style">
    <div
      class="flex items-center gap-2 rounded-control"
      :class="[controlBase, controlPadding[size], controlTextSizes[size], controlStateClasses(invalid, valid, attrs['aria-invalid']), { 'opacity-50': disabled }]"
    >
      <span v-if="$slots.leading" aria-hidden="true" class="inline-flex size-[1em] shrink-0 items-center justify-center [&>svg]:size-full"><slot name="leading" :option="selected" /></span>
      <input
        ref="input"
        v-bind="inputAttrs()"
        :value="query"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="expanded"
        :aria-controls="`${id}-listbox`"
        :aria-activedescendant="activeId"
        :aria-required="required || undefined"
        :aria-invalid="controlAriaInvalid(invalid, attrs['aria-invalid'])"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        autocomplete="off"
        class="m-0 w-full min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-control-content outline-none placeholder:text-control-placeholder disabled:cursor-not-allowed"
        :class="controlTextSizes[size]"
        @input="onInput"
        @keydown="onKeydown"
        @click="show"
        @focus="emit('focus', $event)"
        @blur="onBlur"
      />
      <button
        v-if="clearable && model && !readonly"
        type="button"
        :disabled="disabled"
        :aria-label="clearLabel"
        class="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-control-placeholder focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed"
        @mousedown.prevent
        @click="clear"
      ><X aria-hidden="true" focusable="false" class="size-4" /></button>
      <button
        type="button"
        tabindex="-1"
        :disabled="disabled || readonly"
        :aria-label="expanded ? 'Hide options' : 'Show options'"
        :aria-expanded="expanded"
        :aria-controls="`${id}-listbox`"
        aria-haspopup="listbox"
        class="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-control-placeholder disabled:cursor-not-allowed"
        @mousedown.prevent
        @click="toggle"
      ><ChevronDown aria-hidden="true" focusable="false" class="size-4" /></button>
    </div>
    <input
      type="hidden"
      :name="attrs.name as string | undefined"
      :form="attrs.form as string | undefined"
      :value="model"
      :disabled="disabled"
    />
    <ul
      v-show="expanded"
      :id="`${id}-listbox`"
      ref="list"
      role="listbox"
      :aria-label="(attrs['aria-label'] as string | undefined) ?? 'Options'"
      class="absolute inset-x-0 top-full z-50 m-0 mt-2 max-h-64 list-none overflow-y-auto overscroll-contain rounded-2xl border border-solid border-dialog-line bg-dialog p-1.5 text-content shadow-lg"
      @mousedown.prevent
    >
      <li
        v-for="(option, index) in filtered"
        :id="`${id}-option-${index}`"
        :key="option.value"
        role="option"
        :data-index="index"
        :aria-selected="model === option.value"
        :aria-disabled="option.disabled || undefined"
        class="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-sm leading-6"
        :class="[option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', active === index && !option.disabled ? 'bg-primary-soft text-primary-content' : '']"
        @mousemove="!option.disabled && (active = index)"
        @click="choose(option)"
      >
        <span class="min-w-0 flex-1 break-words"><slot
            name="option"
            :option="option"
            :selected="model === option.value"
            :active="active === index"
          >{{ option.label }}</slot></span>
        <Check
          v-if="model === option.value"
          aria-hidden="true"
          focusable="false"
          class="size-4 shrink-0"
        />
      </li>
      <li v-if="!filtered.length" role="presentation" class="px-3 py-2 text-sm text-content-muted"><slot name="empty">{{ emptyText }}</slot></li>
    </ul>
    <span role="status" class="sr-only">{{ expanded ? `${filtered.length} options available.` : '' }}</span>
  </div>
</template>
