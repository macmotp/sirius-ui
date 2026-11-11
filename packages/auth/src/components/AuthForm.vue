<script setup lang="ts">
import { SAlert, SButton, SForm } from '@sirius-ui/vue'
import type { SAuthFormProps } from '../auth.types'

const props = defineProps<SAuthFormProps & { submitDisabled?: boolean }>()
const emit = defineEmits<{ submit: [] }>()
defineSlots<{ default?(): unknown; footer?(): unknown }>()
function submit() { if (!props.processing && !props.submitDisabled) emit('submit') }
</script>

<template>
  <SForm class="gap-5" :aria-busy="processing || undefined" @submit.prevent="submit">
    <SAlert v-if="error" color="danger" role="alert">{{ error }}</SAlert>
    <SAlert v-if="status" color="success" role="status">{{ status }}</SAlert>
    <fieldset :disabled="processing" class="m-0 min-w-0 space-y-5 border-0 p-0"><slot /></fieldset>
    <SButton type="submit" full-width :loading="processing" :disabled="submitDisabled">{{ submitLabel }}</SButton>
    <div v-if="$slots.footer" class="text-center text-sm text-content-muted"><slot name="footer" /></div>
  </SForm>
</template>
