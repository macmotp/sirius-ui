import './style.css'

export { default as SAuthLayout } from './components/SAuthLayout.vue'
export { default as SLoginForm } from './components/SLoginForm.vue'
export { default as SRegisterForm } from './components/SRegisterForm.vue'
export { default as SForgotPasswordForm } from './components/SForgotPasswordForm.vue'
export { default as SResetPasswordForm } from './components/SResetPasswordForm.vue'
export { default as SConfirmPasswordForm } from './components/SConfirmPasswordForm.vue'
export { default as STwoFactorForm } from './components/STwoFactorForm.vue'
export { default as SEmailVerification } from './components/SEmailVerification.vue'
export type {
  SAuthLayoutProps, SAuthFormProps, SAuthErrors,
  SLoginValue, SRegisterValue, SForgotPasswordValue, SResetPasswordValue,
  SConfirmPasswordValue, STwoFactorValue, STwoFactorSubmission,
  SLoginFormProps, SRegisterFormProps, SForgotPasswordFormProps, SResetPasswordFormProps,
  SConfirmPasswordFormProps, STwoFactorFormProps, SEmailVerificationProps,
} from './auth.types'
