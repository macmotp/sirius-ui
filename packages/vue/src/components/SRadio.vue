<script setup lang="ts">
import ChoiceControl from './ChoiceControl.vue'
import type { SRadioProps } from './SRadio.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SRadioProps>(), { disabled: false })
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ change: [event: Event]; input: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ default?(): unknown }>()

function onChange(event: Event) {
  if ((event.target as HTMLInputElement).checked) model.value = props.value
  emit('change', event)
}
</script>

<template>
  <ChoiceControl v-bind="{ ...$attrs, ...props }" kind="radio" :checked="model === value" @change="onChange" @input="emit('input', $event)" @focus="emit('focus', $event)" @blur="emit('blur', $event)">
    <template v-if="$slots.default" #default><slot /></template>
  </ChoiceControl>
</template>
