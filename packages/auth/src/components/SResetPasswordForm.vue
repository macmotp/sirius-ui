<script setup lang="ts">
import { SButton, SField, SInput } from '@sirius-ui/vue'
import AuthForm from './AuthForm.vue'
import AuthPasswordField from './AuthPasswordField.vue'
import type { SResetPasswordFormProps, SResetPasswordValue } from '../auth.types'

withDefaults(defineProps<SResetPasswordFormProps>(), { submitLabel: 'Reset password' })
const value = defineModel<SResetPasswordValue>({ required: true })
const emit = defineEmits<{ submit: [value: SResetPasswordValue] }>()
defineSlots<{ footer?(): unknown }>()
function update<K extends keyof SResetPasswordValue>(key: K, field: SResetPasswordValue[K]) {
  value.value = { ...value.value, [key]: field }
}
</script>

<template>
  <AuthForm :processing="processing" :error="error" :status="status" :submit-label="submitLabel" @submit="emit('submit', { ...value })">
    <SField v-slot="{ control }" label="Email address" :error="errors?.email" required>
      <SInput v-bind="control" :model-value="value.email" name="email" type="email" autocomplete="username" autocapitalize="none" spellcheck="false" @update:model-value="update('email', $event)" />
    </SField>
    <AuthPasswordField :model-value="value.password" label="New password" name="password" autocomplete="new-password" :error="errors?.password" @update:model-value="update('password', $event)" />
    <AuthPasswordField :model-value="value.passwordConfirmation" label="Confirm password" name="password_confirmation" autocomplete="new-password" :error="errors?.passwordConfirmation" @update:model-value="update('passwordConfirmation', $event)" />
    <template v-if="$slots.footer || loginHref" #footer>
      <slot name="footer"><SButton :as="linkAs" :href="loginHref" variant="ghost" size="sm" :disabled="processing">Back to sign in</SButton></slot>
    </template>
  </AuthForm>
</template>
