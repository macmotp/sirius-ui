<script setup lang="ts">
import { useAttrs } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { controlAriaInvalid, controlBase, controlPadding, controlStateClasses, controlTextSizes, nativeControlAttrs } from './controlStyles'
import type { SSelectProps } from './SSelect.types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<SSelectProps>(), { options: () => [], placeholder: 'Select an option', size: 'md', disabled: false, invalid: false, valid: false })
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ input: [event: Event]; change: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{}>()
const attrs = useAttrs()
</script>

<template>
  <div
    class="relative rounded-control"
    :class="[controlBase, controlTextSizes[size], controlStateClasses(invalid, valid, attrs['aria-invalid']), { 'cursor-not-allowed opacity-50': disabled }, attrs.class]"
    :style="attrs.style"
  >
    <select
      v-bind="nativeControlAttrs(attrs)"
      v-model="model"
      :multiple="false"
      :disabled="disabled"
      :aria-invalid="controlAriaInvalid(invalid, attrs['aria-invalid'])"
      class="m-0 block w-full min-w-0 appearance-none rounded-control border-0 bg-transparent font-sans shadow-none outline-none disabled:cursor-not-allowed"
      :class="[controlPadding[size], controlTextSizes[size], model === '' && placeholder !== undefined ? 'text-control-placeholder' : 'text-control-content', 'pr-10']"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    >
      <option value="" :selected="model === ''" disabled class="bg-canvas text-content">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value" :selected="model === option.value" :disabled="option.disabled" class="bg-canvas text-content">{{ option.label }}</option>
    </select>
    <ChevronDown aria-hidden="true" focusable="false" class="pointer-events-none absolute top-1/2 right-3 size-[1em] -translate-y-1/2 text-control-placeholder" />
  </div>
</template>
