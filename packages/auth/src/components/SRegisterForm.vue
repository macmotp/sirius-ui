<script setup lang="ts">
import { SButton, SDivider, SField, SInput } from '@sirius-ui/vue'
import AuthForm from './AuthForm.vue'
import AuthPasswordField from './AuthPasswordField.vue'
import type { SRegisterFormProps, SRegisterValue } from '../auth.types'

withDefaults(defineProps<SRegisterFormProps>(), { submitLabel: 'Create account' })
const value = defineModel<SRegisterValue>({ required: true })
const emit = defineEmits<{ submit: [value: SRegisterValue] }>()
defineSlots<{ social?(): unknown; agreement?(): unknown; footer?(): unknown }>()
function update<K extends keyof SRegisterValue>(key: K, field: SRegisterValue[K]) {
  value.value = { ...value.value, [key]: field }
}
</script>

<template>
  <AuthForm :processing="processing" :error="error" :status="status" :submit-label="submitLabel" @submit="emit('submit', { ...value })">
    <template v-if="$slots.social"><slot name="social" /><SDivider label="Or continue with email" /></template>
    <SField v-slot="{ control }" label="Full name" :error="errors?.name" required>
      <SInput v-bind="control" :model-value="value.name" name="name" autocomplete="name" @update:model-value="update('name', $event)" />
    </SField>
    <SField v-slot="{ control }" label="Email address" :error="errors?.email" required>
      <SInput v-bind="control" :model-value="value.email" name="email" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" @update:model-value="update('email', $event)" />
    </SField>
    <AuthPasswordField :model-value="value.password" label="Password" name="password" autocomplete="new-password" :error="errors?.password" @update:model-value="update('password', $event)" />
    <AuthPasswordField :model-value="value.passwordConfirmation" label="Confirm password" name="password_confirmation" autocomplete="new-password" :error="errors?.passwordConfirmation" @update:model-value="update('passwordConfirmation', $event)" />
    <slot name="agreement" />
    <template v-if="$slots.footer || loginHref" #footer>
      <slot name="footer">Already have an account? <SButton :as="linkAs" :href="loginHref" variant="ghost" size="sm" :disabled="processing">Sign in</SButton></slot>
    </template>
  </AuthForm>
</template>
