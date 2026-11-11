export const screens = [
  { value: 'login', label: 'Sign in', title: 'Welcome back.', description: 'Sign in to your Acme workspace. Pick up right where you left off.' },
  { value: 'register', label: 'Register', title: 'Make yourself at home.', description: 'Create your account and start building something together.' },
  { value: 'forgot', label: 'Forgot password', title: 'Let’s get you back in.', description: 'Enter your email and we’ll send you a password reset link.' },
  { value: 'reset', label: 'Reset password', title: 'A fresh start.', description: 'Choose a new password for your account.' },
  { value: 'verify', label: 'Verify email', title: 'Check your inbox.', description: 'You’re almost there. Verify your email to continue to your workspace.' },
  { value: 'two-factor', label: 'Two-factor challenge', title: 'One more step.', description: 'Confirm it’s you before continuing to your workspace.' },
  { value: 'confirm', label: 'Confirm password', title: 'A quick confirmation.', description: 'Enter your password to continue with this action.' },
] as const
export type AuthScreen = typeof screens[number]['value']
export type PreviewState = 'default' | 'error' | 'processing' | 'success'
