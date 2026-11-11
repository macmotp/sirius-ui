<script setup lang="ts">
import { SButton, SField, SInput } from '@sirius-ui/vue'
import AuthForm from './AuthForm.vue'
import type { SForgotPasswordFormProps, SForgotPasswordValue } from '../auth.types'

withDefaults(defineProps<SForgotPasswordFormProps>(), { submitLabel: 'Send reset link' })
const value = defineModel<SForgotPasswordValue>({ required: true })
const emit = defineEmits<{ submit: [value: SForgotPasswordValue] }>()
defineSlots<{ footer?(): unknown }>()
</script>

<template>
  <AuthForm :processing="processing" :error="error" :status="status" :submit-label="submitLabel" @submit="emit('submit', { ...value })">
    <SField v-slot="{ control }" label="Email address" :error="errors?.email" required>
      <SInput v-bind="control" :model-value="value.email" name="email" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" @update:model-value="value = { email: $event }" />
    </SField>
    <template v-if="$slots.footer || loginHref" #footer>
      <slot name="footer"><SButton :as="linkAs" :href="loginHref" variant="ghost" size="sm" :disabled="processing">Back to sign in</SButton></slot>
    </template>
  </AuthForm>
</template>
