<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { Check, Minus } from '@lucide/vue'
import { controlAriaInvalid, nativeControlAttrs } from './controlStyles'
import type { SChoiceProps } from './choice.types'

interface Props extends SChoiceProps {
  kind: 'checkbox' | 'radio' | 'switch'
  checked: boolean
  indeterminate?: boolean
  value?: string
}

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<Props>(), { size: 'md', disabled: false, required: false, invalid: false, valid: false, indeterminate: false })
const emit = defineEmits<{ change: [event: Event]; input: [event: Event]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ default?(): unknown }>()
const attrs = useAttrs()
const generatedId = useId()
const controlId = computed(() => props.id ?? `sirius-choice-${generatedId}`)
function describedBy() {
  return [attrs['aria-describedby'], props.description && `${controlId.value}-description`, props.error && `${controlId.value}-error`].filter(Boolean).join(' ') || undefined
}
const boxSizes = { sm: 'size-4', md: 'size-5', lg: 'size-6' }
const trackSizes = { sm: 'h-5 w-8', md: 'h-6 w-10', lg: 'h-7 w-12' }
const thumbSizes = {
  sm: 'size-4 peer-checked:translate-x-3 rtl:peer-checked:-translate-x-3',
  md: 'size-5 peer-checked:translate-x-4 rtl:peer-checked:-translate-x-4',
  lg: 'size-6 peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5',
}
const textSizes = { sm: 'text-xs leading-5', md: 'text-sm leading-6', lg: 'text-base leading-7' }

function ringClasses() {
  const invalid = props.invalid || !!props.error || [true, 'true', 'grammar', 'spelling'].includes(attrs['aria-invalid'] as string | boolean)
  if (invalid) return 'ring-control-invalid checked:ring-control-invalid focus-visible:outline-control-invalid' + (props.kind === 'checkbox' ? ' indeterminate:ring-control-invalid' : '')
  if (props.valid) return 'ring-control-valid checked:ring-control-valid focus-visible:outline-control-valid' + (props.kind === 'checkbox' ? ' indeterminate:ring-control-valid' : '')
  return 'ring-control-line checked:ring-primary focus-visible:outline-control-focus' + (props.kind === 'checkbox' ? ' indeterminate:ring-primary' : '')
}

function onChange(event: Event) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('change', event)
}
</script>

<template>
  <div class="min-w-0" :class="[{ 'opacity-50': disabled }, attrs.class]" :style="attrs.style">
    <div class="flex items-start gap-3">
      <span class="relative mt-0.5 inline-grid shrink-0">
        <input
          v-bind="nativeControlAttrs(attrs)"
          :id="controlId"
          :type="kind === 'radio' ? 'radio' : 'checkbox'"
          :role="kind === 'switch' ? 'switch' : undefined"
          :checked="checked"
          :indeterminate.prop="kind === 'checkbox' && indeterminate"
          :value="value"
          :disabled="disabled"
          :required="required"
          :aria-checked="kind === 'checkbox' && indeterminate ? 'mixed' : kind === 'switch' ? checked : undefined"
          :aria-invalid="controlAriaInvalid(invalid || !!error, attrs['aria-invalid'])"
          :aria-describedby="describedBy()"
          class="peer m-0 col-start-1 row-start-1 cursor-pointer appearance-none border-0 p-0 shadow-xs ring-1 ring-inset checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
          :class="[kind === 'switch' ? [trackSizes[size], 'bg-switch-track'] : [boxSizes[size], 'bg-control'], kind === 'checkbox' ? 'rounded-full indeterminate:bg-primary' : 'rounded-control', ringClasses()]"
          @change="onChange"
          @input="emit('input', $event)"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
        />
        <template v-if="kind === 'checkbox'">
          <Minus v-if="indeterminate" aria-hidden="true" focusable="false" class="pointer-events-none absolute inset-[10%] size-4/5 text-white" />
          <Check v-else aria-hidden="true" focusable="false" class="pointer-events-none absolute inset-[10%] size-4/5 text-white opacity-0 peer-checked:opacity-100" />
        </template>
        <span v-else-if="kind === 'radio'" aria-hidden="true" class="pointer-events-none absolute inset-[25%] rounded-full bg-white opacity-0 peer-checked:opacity-100"></span>
        <span v-else aria-hidden="true" class="pointer-events-none absolute start-0.5 top-0.5 rounded-full bg-white transition-transform motion-reduce:transition-none" :class="thumbSizes[size]"></span>
      </span>
      <div v-if="label || $slots.default || description || error" class="min-w-0 flex-1" :class="textSizes[size]">
        <label v-if="label || $slots.default" :for="controlId" class="block break-words font-medium text-content" :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"><slot>{{ label }}</slot><span v-if="required" aria-hidden="true" class="ml-1 text-danger-content">*</span></label>
        <p v-if="description" :id="`${controlId}-description`" class="mt-1 break-words text-content-muted">{{ description }}</p>
        <p v-if="error" :id="`${controlId}-error`" class="mt-1 break-words text-danger-content">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
