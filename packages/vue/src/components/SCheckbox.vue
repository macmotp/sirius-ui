<script setup lang="ts">
import ChoiceControl from './ChoiceControl.vue'
import type { SCheckboxProps } from './SCheckbox.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SCheckboxProps>(), { disabled: false, indeterminate: false })
const model = defineModel<boolean>({ default: false })
const emit = defineEmits<{ 'update:indeterminate': [value: boolean]; change: [event: Event]; input: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ default?(): unknown }>()

function onChange(event: Event) {
  model.value = (event.target as HTMLInputElement).checked
  if (props.indeterminate) emit('update:indeterminate', false)
  emit('change', event)
}
</script>

<template>
  <ChoiceControl v-bind="{ ...$attrs, ...props }" kind="checkbox" :checked="model" @change="onChange" @input="emit('input', $event)" @focus="emit('focus', $event)" @blur="emit('blur', $event)">
    <template v-if="$slots.default" #default><slot /></template>
  </ChoiceControl>
</template>
