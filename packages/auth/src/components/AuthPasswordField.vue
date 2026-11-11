<script setup lang="ts">
import { shallowRef } from 'vue'
import { SField, SInput } from '@sirius-ui/vue'

defineProps<{
  label: string
  name: string
  autocomplete: 'current-password' | 'new-password'
  error?: string
}>()
const value = defineModel<string>({ required: true })
const visible = shallowRef(false)
</script>

<template>
  <SField v-slot="{ control }" :label="label" :error="error" required>
    <div class="relative">
      <SInput v-bind="control" v-model="value" :type="visible ? 'text' : 'password'" :name="name" :autocomplete="autocomplete" class="pe-16" />
      <button type="button" class="absolute inset-y-0 end-2 my-auto h-7 cursor-pointer rounded-full border-0 bg-transparent px-2 font-sans text-xs font-medium text-content-muted hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-focus" :aria-label="`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`" :aria-controls="control.id" :aria-pressed="visible" @click="visible = !visible">{{ visible ? 'Hide' : 'Show' }}</button>
    </div>
  </SField>
</template>
