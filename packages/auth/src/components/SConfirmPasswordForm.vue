<script setup lang="ts">
import AuthForm from './AuthForm.vue'
import AuthPasswordField from './AuthPasswordField.vue'
import type { SConfirmPasswordFormProps, SConfirmPasswordValue } from '../auth.types'

withDefaults(defineProps<SConfirmPasswordFormProps>(), { submitLabel: 'Confirm password' })
const value = defineModel<SConfirmPasswordValue>({ required: true })
const emit = defineEmits<{ submit: [value: SConfirmPasswordValue] }>()
defineSlots<{ footer?(): unknown }>()
</script>

<template>
  <AuthForm :processing="processing" :error="error" :status="status" :submit-label="submitLabel" @submit="emit('submit', { ...value })">
    <AuthPasswordField :model-value="value.password" label="Password" name="password" autocomplete="current-password" :error="errors?.password" @update:model-value="value = { password: $event }" />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </AuthForm>
</template>
