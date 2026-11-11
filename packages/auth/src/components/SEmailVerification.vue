<script setup lang="ts">
import { SButton } from '@sirius-ui/vue'
import AuthForm from './AuthForm.vue'
import type { SEmailVerificationProps } from '../auth.types'

const props = withDefaults(defineProps<SEmailVerificationProps>(), {
  resendLabel: 'Resend verification email', signOutLabel: 'Sign out',
})
const emit = defineEmits<{ resend: []; signOut: [] }>()
defineSlots<{ default?(): unknown; footer?(): unknown }>()
function signOut() { if (!props.processing) emit('signOut') }
</script>

<template>
  <AuthForm :processing="processing" :error="error" :status="status" :submit-label="resendLabel" :submit-disabled="resendDisabled" @submit="emit('resend')">
    <div class="rounded-2xl border border-line bg-surface p-5">
      <slot>
        <p class="m-0 text-sm leading-6 text-content-muted">Open the verification link sent to <strong class="font-medium text-content break-all">{{ email || 'your email address' }}</strong> to finish setting up your account.</p>
        <p class="mt-3 mb-0 text-xs leading-5 text-content-muted">Check your spam folder if it hasn't arrived yet.</p>
      </slot>
    </div>
    <template #footer><slot name="footer"><SButton variant="ghost" size="sm" :disabled="processing" @click="signOut">{{ signOutLabel }}</SButton></slot></template>
  </AuthForm>
</template>
