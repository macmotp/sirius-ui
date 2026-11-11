import type { Component } from 'vue'

export interface SAuthLayoutProps {
  title: string
  description?: string
  variant?: 'centered' | 'split'
}
export interface SAuthFormProps {
  processing?: boolean
  error?: string
  status?: string
  submitLabel?: string
}
export interface SLoginValue {
  email: string
  password: string
  remember: boolean
}
export interface SRegisterValue {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
export interface SForgotPasswordValue { email: string }
export interface SResetPasswordValue {
  email: string
  password: string
  passwordConfirmation: string
}
export interface SConfirmPasswordValue { password: string }
export interface STwoFactorValue {
  code: string
  recoveryCode: string
}
export type STwoFactorSubmission =
  | { mode: 'code', code: string }
  | { mode: 'recovery', recoveryCode: string }
export type SAuthErrors<T> = Partial<Record<keyof T, string>>
export interface SLoginFormProps extends SAuthFormProps {
  errors?: SAuthErrors<SLoginValue>
  forgotPasswordHref?: string
  registerHref?: string
  linkAs?: 'a' | Component
}
export interface SRegisterFormProps extends SAuthFormProps {
  errors?: SAuthErrors<SRegisterValue>
  loginHref?: string
  linkAs?: 'a' | Component
}
export interface SForgotPasswordFormProps extends SAuthFormProps {
  errors?: SAuthErrors<SForgotPasswordValue>
  loginHref?: string
  linkAs?: 'a' | Component
}
export interface SResetPasswordFormProps extends SAuthFormProps {
  errors?: SAuthErrors<SResetPasswordValue>
  loginHref?: string
  linkAs?: 'a' | Component
}
export interface SConfirmPasswordFormProps extends SAuthFormProps {
  errors?: SAuthErrors<SConfirmPasswordValue>
}
export interface STwoFactorFormProps extends SAuthFormProps {
  errors?: SAuthErrors<STwoFactorValue>
  codeLength?: number
  modeLabel?: string
}
export interface SEmailVerificationProps {
  processing?: boolean
  error?: string
  status?: string
  email?: string
  resendDisabled?: boolean
  resendLabel?: string
  signOutLabel?: string
}
