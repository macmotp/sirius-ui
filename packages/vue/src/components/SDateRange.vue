<script setup lang="ts">
import { computed, useId } from 'vue'
import SButton from './SButton.vue'
import SField from './SField.vue'
import SInput from './SInput.vue'
import { getDateRangeError } from './dateRange'
import type { SDateRangeProps, SDateRangeValue } from './SDateRange.types'

const props = withDefaults(defineProps<SDateRangeProps>(), {
  label: 'Date range',
  fromLabel: 'From date',
  toLabel: 'To date',
  size: 'md',
  presets: () => [],
  clearable: true,
  clearLabel: 'Clear dates',
})
const model = defineModel<SDateRangeValue>({ required: true })
const errorId = `sirius-date-range-${useId()}-error`
const constraints = computed(() => ({ min: props.min, max: props.max, required: props.required }))
const rangeError = computed(() => getDateRangeError(model.value, constraints.value))
const message = computed(() => props.error || rangeError.value)
const inputState = computed(() => ({
  'aria-describedby': message.value ? errorId : undefined,
  'aria-invalid': message.value ? true as const : undefined,
}))
const bounds = computed(() => ({ min: props.min, max: props.max }))
const fromMax = computed(() => model.value.to && !getDateRangeError({ from: '', to: model.value.to }, bounds.value)
  ? model.value.to : props.max)
const toMin = computed(() => model.value.from && !getDateRangeError({ from: model.value.from, to: '' }, bounds.value)
  ? model.value.from : props.min)
const presets = computed(() => props.presets.map(preset => ({
  ...preset,
  disabled: Boolean(getDateRangeError(preset.range, constraints.value)),
  selected: preset.range.from === model.value.from && preset.range.to === model.value.to,
})))

function replace(range: SDateRangeValue) {
  if (props.disabled || (range.from === model.value.from && range.to === model.value.to)) return
  model.value = { from: range.from, to: range.to }
}

function edit(key: keyof SDateRangeValue, value: string) {
  replace({ ...model.value, [key]: value })
}
</script>

<template>
  <fieldset :disabled="disabled" class="m-0 min-w-0 border-0 p-0">
    <legend class="mb-2 p-0 text-sm font-medium text-content">{{ label }}</legend>
    <div class="flex flex-wrap gap-3">
      <SField v-slot="{ control }" :label="fromLabel" :required="required" class="flex-1 basis-36">
        <SInput
          v-bind="{ ...control, ...inputState }" type="date" :size="size" :name="fromName" :disabled="disabled"
          :model-value="model.from" :min="min" :max="fromMax" @update:model-value="edit('from', $event)"
        />
      </SField>
      <SField v-slot="{ control }" :label="toLabel" :required="required" class="flex-1 basis-36">
        <SInput
          v-bind="{ ...control, ...inputState }" type="date" :size="size" :name="toName" :disabled="disabled"
          :model-value="model.to" :min="toMin" :max="max" @update:model-value="edit('to', $event)"
        />
      </SField>
    </div>
    <p v-if="message" :id="errorId" class="mt-2 text-sm text-danger-content" role="status">{{ message }}</p>
    <div v-if="presets.length || clearable" class="mt-2 flex flex-wrap gap-2">
      <SButton
        v-for="preset in presets" :key="preset.id" size="sm" :variant="preset.selected ? 'soft' : 'outline'"
        :aria-pressed="preset.selected" :disabled="disabled || preset.disabled" @click="replace(preset.range)"
      >{{ preset.label }}</SButton>
      <SButton v-if="clearable" size="sm" variant="ghost" :disabled="disabled" @click="replace({ from: '', to: '' })">{{ clearLabel }}</SButton>
    </div>
  </fieldset>
</template>
