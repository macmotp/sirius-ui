<script setup lang="ts">
import { useAttrs } from 'vue'
import { controlAriaInvalid, controlBase, controlPadding, controlStateClasses, controlTextSizes } from './controlStyles'
import type { STextareaProps } from './STextarea.types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<STextareaProps>(), { size: 'md', rows: 3, resize: 'vertical', disabled: false, readonly: false, invalid: false, valid: false })
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ input: [event: Event]; change: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
const attrs = useAttrs()
const resizing = { none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize' }
</script>

<template>
  <textarea
    v-bind="attrs"
    v-model="model"
    :rows="rows"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="controlAriaInvalid(invalid, attrs['aria-invalid'])"
    class="m-0 block rounded-2xl outline-none placeholder:text-control-placeholder disabled:cursor-not-allowed disabled:opacity-50"
    :class="[controlBase, controlPadding[size], controlTextSizes[size], resizing[resize], controlStateClasses(invalid, valid, attrs['aria-invalid'])]"
    @input="emit('input', $event)"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  />
</template>
