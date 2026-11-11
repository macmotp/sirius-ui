<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import {
  SLoginForm, SRegisterForm, SForgotPasswordForm, SResetPasswordForm,
  STwoFactorForm, SConfirmPasswordForm, SEmailVerification,
} from '@sirius-ui/auth'
import type { SLoginValue, SRegisterValue, SForgotPasswordValue, SResetPasswordValue, STwoFactorValue, SConfirmPasswordValue } from '@sirius-ui/auth'
import type { AuthScreen, PreviewState } from './screens'

const props = defineProps<{ screen: AuthScreen; state: PreviewState }>()
const login = ref<SLoginValue>({ email: '', password: '', remember: false })
const register = ref<SRegisterValue>({ name: '', email: '', password: '', passwordConfirmation: '' })
const forgot = ref<SForgotPasswordValue>({ email: '' })
const reset = ref<SResetPasswordValue>({ email: 'alex@acme.example', password: '', passwordConfirmation: '' })
const twoFactor = ref<STwoFactorValue>({ code: '', recoveryCode: '' })
const confirm = ref<SConfirmPasswordValue>({ password: '' })
const pending = shallowRef(false)
const feedback = shallowRef('')
const fieldErrors = shallowRef<Record<string, string>>({})
let timer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(timer))
const messages: Record<AuthScreen, string> = {
  login: 'Sign-in preview completed.',
  register: 'Account creation preview completed.',
  forgot: 'If an account matches that email, you’ll receive a reset link.',
  reset: 'Your password reset preview is complete.',
  verify: 'A new verification email has been requested.',
  'two-factor': 'Verification preview completed.',
  confirm: 'Password confirmation preview completed.',
}
const state = computed(() => ({
  processing: pending.value || props.state === 'processing',
  error: props.state === 'error' ? 'We couldn’t complete that request. Please check your details and try again.' : '',
  status: props.state === 'success' ? messages[props.screen] : feedback.value,
  errors: props.state === 'error' ? {
    name: 'Enter your full name.', email: 'Check your email address.',
    password: 'Please check your password.', passwordConfirmation: 'The passwords must match.',
    code: 'That code has expired. Enter a new code.', recoveryCode: 'Check your recovery code.',
  } : fieldErrors.value,
}))
function submit() {
  if (state.value.processing) return
  feedback.value = ''
  fieldErrors.value = {}
  const passwords = props.screen === 'register' ? register.value : props.screen === 'reset' ? reset.value : undefined
  if (passwords && passwords.password !== passwords.passwordConfirmation) {
    fieldErrors.value = { passwordConfirmation: 'The passwords must match.' }
    return
  }
  pending.value = true
  timer = setTimeout(() => {
    pending.value = false
    feedback.value = messages[props.screen]
    login.value = { ...login.value, password: '' }
    register.value = { ...register.value, password: '', passwordConfirmation: '' }
    reset.value = { ...reset.value, password: '', passwordConfirmation: '' }
    confirm.value = { password: '' }
    twoFactor.value = { code: '', recoveryCode: '' }
  }, 600)
}
</script>

<template>
  <SLoginForm v-if="screen === 'login'" v-model="login" v-bind="state" forgot-password-href="#forgot" register-href="#register" @submit="submit" />
  <SRegisterForm v-else-if="screen === 'register'" v-model="register" v-bind="state" login-href="#login" @submit="submit" />
  <SForgotPasswordForm v-else-if="screen === 'forgot'" v-model="forgot" v-bind="state" login-href="#login" @submit="submit" />
  <SResetPasswordForm v-else-if="screen === 'reset'" v-model="reset" v-bind="state" login-href="#login" @submit="submit" />
  <SEmailVerification v-else-if="screen === 'verify'" email="alex@acme.example" :processing="state.processing" :error="state.error" :status="state.status" @resend="submit" @sign-out="feedback = 'Sign-out preview completed.'" />
  <STwoFactorForm v-else-if="screen === 'two-factor'" v-model="twoFactor" v-bind="state" @submit="submit" />
  <SConfirmPasswordForm v-else v-model="confirm" v-bind="state" @submit="submit" />
</template>
