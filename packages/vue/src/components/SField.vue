<script setup lang="ts">
import { computed, useId } from 'vue'
import type { SFieldControl, SFieldProps } from './SField.types'

const props = withDefaults(defineProps<SFieldProps>(), { required: false, fullWidth: false })
defineSlots<{ default(props: { control: SFieldControl }): unknown }>()
const generatedId = useId()
const controlId = computed(() => props.id ?? `sirius-field-${generatedId}`)
const control = computed<SFieldControl>(() => ({
  id: controlId.value,
  required: props.required,
  'aria-describedby': [props.description && `${controlId.value}-description`, props.error && `${controlId.value}-error`].filter(Boolean).join(' ') || undefined,
  'aria-invalid': props.error ? true : undefined,
}))
</script>

<template>
  <div class="min-w-0 space-y-2" :class="{ 'col-span-full': fullWidth }">
    <label :for="controlId" class="block text-sm font-medium text-content">{{ label }}<span v-if="required" aria-hidden="true" class="ml-1 text-danger-content">*</span></label>
    <slot :control="control" />
    <p v-if="description" :id="`${controlId}-description`" class="text-sm leading-relaxed text-content-muted">{{ description }}</p>
    <p v-if="error" :id="`${controlId}-error`" class="text-sm leading-relaxed text-danger-content">{{ error }}</p>
  </div>
</template>
