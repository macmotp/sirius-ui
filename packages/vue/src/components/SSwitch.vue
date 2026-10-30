<script setup lang="ts">
import ChoiceControl from './ChoiceControl.vue'
import type { SSwitchProps } from './SSwitch.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SSwitchProps>(), { disabled: false })
const model = defineModel<boolean>({ default: false })
const emit = defineEmits<{ change: [event: Event]; input: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ default?(): unknown }>()

function onChange(event: Event) {
  model.value = (event.target as HTMLInputElement).checked
  emit('change', event)
}
</script>

<template>
  <ChoiceControl v-bind="{ ...$attrs, ...props }" kind="switch" :checked="model" @change="onChange" @input="emit('input', $event)" @focus="emit('focus', $event)" @blur="emit('blur', $event)">
    <template v-if="$slots.default" #default><slot /></template>
  </ChoiceControl>
</template>
