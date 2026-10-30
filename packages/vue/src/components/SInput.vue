<script setup lang="ts">
import { useAttrs } from 'vue'
import { controlAriaInvalid, controlBase, controlStateClasses, controlTextSizes, nativeControlAttrs } from './controlStyles'
import type { SInputProps } from './SInput.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SInputProps>(), { type: 'text', size: 'md', disabled: false, readonly: false, invalid: false, valid: false })
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ input: [event: Event]; change: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ leading?(): unknown; trailing?(): unknown }>()
const attrs = useAttrs()
let composing = false
function rangeProgress() {
  const min = attrs.min === undefined ? 0 : Number(attrs.min)
  const max = attrs.max === undefined ? 100 : Number(attrs.max)
  const value = model.value === '' ? (min + max) / 2 : Number(model.value)
  return `${max > min && Number.isFinite(value) ? Math.min(100, Math.max(0, (value - min) / (max - min) * 100)) : 0}%`
}
function rangeValidation() {
  if (props.invalid || [true, 'true', 'grammar', 'spelling'].includes(attrs['aria-invalid'] as string | boolean)) return 'var(--sirius-control-invalid)'
  if (props.valid) return 'var(--sirius-control-valid)'
  return undefined
}
const rangeThumbs = { sm: '[--sirius-range-thumb:1.25rem]', md: '[--sirius-range-thumb:1.5rem]', lg: '[--sirius-range-thumb:1.75rem]' }
const pickerHeights = { sm: 'h-5', md: 'h-6', lg: 'h-7' }

function updateValue(event: Event) {
  model.value = (event.target as HTMLInputElement).value
}

function onInput(event: Event) {
  // Read the native string value without Vue's automatic number coercion.
  if (!composing && !(event as InputEvent).isComposing) updateValue(event)
  emit('input', event)
}

function onCompositionEnd(event: CompositionEvent) {
  if (!composing) return
  composing = false
  updateValue(event)
}

function onChange(event: Event) {
  // Native pickers may commit with change, and some IMEs finish on blur.
  composing = false
  updateValue(event)
  emit('change', event)
}
const sizes = {
  sm: 'gap-1.5 px-3 py-1 text-xs',
  md: 'gap-2 px-4 py-1.5 text-sm',
  lg: 'gap-2.5 px-5 py-2 text-base',
}
</script>

<template>
  <div
    class="flex items-center rounded-control"
    :class="[type === 'range' ? 'w-full min-w-0 border-0 bg-transparent' : controlBase, type === 'range' ? 'p-0' : sizes[size], type === 'range' ? undefined : controlStateClasses(invalid, valid, attrs['aria-invalid']), { 'cursor-not-allowed opacity-50': disabled }, $attrs.class]"
    :style="$attrs.style"
  >
    <span v-if="$slots.leading" aria-hidden="true" class="inline-flex size-[1em] shrink-0 items-center justify-center text-control-placeholder [&>svg]:size-full"><slot name="leading" /></span>
    <input
      v-bind="nativeControlAttrs(attrs)"
      :value="model"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="controlAriaInvalid(invalid, attrs['aria-invalid'])"
      class="m-0 block w-full min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-control-content shadow-none outline-none placeholder:text-control-placeholder disabled:cursor-not-allowed"
      :class="[controlTextSizes[size], type === 'color' || type === 'range' ? pickerHeights[size] : undefined, type === 'range' ? ['sirius-range cursor-pointer appearance-none', rangeThumbs[size]] : undefined, { 'cursor-pointer': type === 'color' }]"
      :style="type === 'range' ? { '--sirius-range-progress': rangeProgress(), '--sirius-range-state': rangeValidation() } : undefined"
      @input="onInput"
      @compositionstart="composing = true"
      @compositionend="onCompositionEnd"
      @change="onChange"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <span v-if="$slots.trailing" aria-hidden="true" class="inline-flex size-[1em] shrink-0 items-center justify-center text-control-placeholder [&>svg]:size-full"><slot name="trailing" /></span>
  </div>
</template>
