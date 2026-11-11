<script setup lang="ts">
import { SButton, SCheckbox, SDivider, SField, SInput } from '@sirius-ui/vue'
import AuthForm from './AuthForm.vue'
import AuthPasswordField from './AuthPasswordField.vue'
import type { SLoginFormProps, SLoginValue } from '../auth.types'

withDefaults(defineProps<SLoginFormProps>(), { submitLabel: 'Sign in' })
const value = defineModel<SLoginValue>({ required: true })
const emit = defineEmits<{ submit: [value: SLoginValue] }>()
defineSlots<{ social?(): unknown; footer?(): unknown }>()
function update<K extends keyof SLoginValue>(key: K, field: SLoginValue[K]) {
  value.value = { ...value.value, [key]: field }
}
</script>

<template>
  <AuthForm aria-label="Sign in" :processing="processing" :error="error" :status="status" :submit-label="submitLabel" @submit="emit('submit', { ...value })">
    <template v-if="$slots.social"><slot name="social" /><SDivider label="Or continue with email" /></template>
    <SField v-slot="{ control }" label="Email address" :error="errors?.email" required>
      <SInput v-bind="control" :model-value="value.email" name="email" type="email" autocomplete="username" autocapitalize="none" spellcheck="false" @update:model-value="update('email', $event)" />
    </SField>
    <AuthPasswordField :model-value="value.password" label="Password" name="password" autocomplete="current-password" :error="errors?.password" @update:model-value="update('password', $event)" />
    <div class="flex flex-wrap items-center justify-between gap-2">
      <SCheckbox :model-value="value.remember" label="Remember me" name="remember" :error="errors?.remember" @update:model-value="update('remember', $event)" />
      <SButton v-if="forgotPasswordHref" :as="linkAs" :href="forgotPasswordHref" variant="ghost" size="sm" :disabled="processing">Forgot password?</SButton>
    </div>
    <template v-if="$slots.footer || registerHref" #footer>
      <slot name="footer">New here? <SButton :as="linkAs" :href="registerHref" variant="ghost" size="sm" :disabled="processing">Create an account</SButton></slot>
    </template>
  </AuthForm>
</template>
