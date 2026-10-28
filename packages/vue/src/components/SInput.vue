<script setup lang="ts">
import { useAttrs } from 'vue'
import { controlAriaInvalid, controlBase, controlStateClasses, controlTextSizes, nativeControlAttrs } from './controlStyles'
import type { SInputProps } from './SInput.types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<SInputProps>(), { type: 'text', size: 'md', disabled: false, readonly: false, invalid: false, valid: false })
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ input: [event: Event]; change: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ leading?(): unknown; trailing?(): unknown }>()
const attrs = useAttrs()
const sizes = {
  sm: 'gap-1.5 px-3 py-1 text-xs',
  md: 'gap-2 px-4 py-1.5 text-sm',
  lg: 'gap-2.5 px-5 py-2 text-base',
}
</script>

<template>
  <div
    class="flex items-center rounded-control"
    :class="[controlBase, sizes[size], controlStateClasses(invalid, valid, attrs['aria-invalid']), { 'cursor-not-allowed opacity-50': disabled }, $attrs.class]"
    :style="$attrs.style"
  >
    <span v-if="$slots.leading" aria-hidden="true" class="inline-flex size-[1em] shrink-0 items-center justify-center text-control-placeholder [&>svg]:size-full"><slot name="leading" /></span>
    <input
      v-bind="nativeControlAttrs(attrs)"
      v-model="model"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="controlAriaInvalid(invalid, attrs['aria-invalid'])"
      class="m-0 block w-full min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-control-content shadow-none outline-none placeholder:text-control-placeholder disabled:cursor-not-allowed"
      :class="controlTextSizes[size]"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <span v-if="$slots.trailing" aria-hidden="true" class="inline-flex size-[1em] shrink-0 items-center justify-center text-control-placeholder [&>svg]:size-full"><slot name="trailing" /></span>
  </div>
</template>
