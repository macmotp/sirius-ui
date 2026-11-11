# @sirius-ui/auth

Initial authentication templates for Vue 3.5, composed from Sirius primitives. Release preparation targets `0.1.0-alpha.1`. After publication, install with `yarn add @sirius-ui/auth@alpha`.

For installed agents, the catalog and package guides are bundled at `node_modules/@sirius-ui/auth/dist/docs/readme.md`.

## Setup

Import components from `@sirius-ui/auth` and load `@sirius-ui/vue/style.css` and `@sirius-ui/auth/style.css` once in your app entry. The compiled styles work without Tailwind. The app owns its font, reset, appearance, branding, routes, and authentication service.

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { SAuthLayout, SLoginForm } from '@sirius-ui/auth'
import type { SLoginValue } from '@sirius-ui/auth'

defineProps<{
  processing?: boolean
  errors?: Partial<Record<keyof SLoginValue, string>>
  error?: string
}>()
const emit = defineEmits<{ submit: [credentials: SLoginValue] }>()
const credentials = shallowRef<SLoginValue>({ email: '', password: '', remember: false })
</script>

<template>
  <SAuthLayout title="Welcome back" description="Sign in to your workspace.">
    <template #brand><a href="/">Acme</a></template>
    <SLoginForm v-model="credentials" :processing="processing" :errors="errors" :error="error" forgot-password-href="/forgot-password" register-href="/register" @submit="emit('submit', $event)" />
  </SAuthLayout>
</template>
```

## SAuthLayout

| Prop or slot | Contract |
| --- | --- |
| `title` | Required string, rendered as the page h1 and used to name the main landmark |
| `description` | Optional supporting text below the title |
| `variant` | `centered` by default, or `split` with a decorative side panel from 1024px |
| `#brand` | Project logo and optional home link above the form |
| Default slot | Auth form or verification content |
| `#aside` | App-owned side-panel content, hidden at narrow widths |
| `#footer` | Optional small-print or secondary navigation below the form |

The layout owns no model or events. It supplies one main landmark and one h1. Keep essential information and actions in the main column. The side panel can hold project imagery or supporting copy. Override `--sirius-auth-min-height` on the root when embedding beneath preview controls.

## Shared form contract

All form models are required objects. Inputs emit a replacement object through `update:modelValue`. Submit emits a snapshot. Password values retain whitespace and codes retain leading zeroes. Native required/email/pattern checks run before a browser submission. Forms prevent native page navigation.

| Prop | Contract |
| --- | --- |
| `processing` | Default false. Disables the fieldset and built-in navigation/actions, shows the loading submit button, sets aria-busy, and blocks repeated submissions |
| `errors` | Optional object keyed by the model fields, with one message per field. Core controls associate errors with their inputs |
| `error` | Optional form-wide message in an alert |
| `status` | Optional success/information message in a status region |
| `submitLabel` | Optional primary button text overriding the component default |
| `linkAs` | On Login, Register, Forgot, and Reset, a native `a` by default or the app's href-compatible link component |

All forms use native fields with labels and autocomplete values. Password fields offer a keyboard-accessible Show/Hide button. Forms have no exposed imperative methods.

## SLoginForm

- Model `SLoginValue` is `{ email: string, password: string, remember: boolean }`.
- `submit(value)` emits that snapshot. The default button label is Sign in.
- `forgotPasswordHref` and `registerHref` optionally show their respective links.
- `#social` supplies app-owned provider buttons above an email divider. `#footer` replaces the register link row.

## SRegisterForm

- Model `SRegisterValue` is `{ name: string, email: string, password: string, passwordConfirmation: string }`.
- `submit(value)` emits that snapshot. The default label is Create account.
- `loginHref` optionally shows the Sign in link.
- `#social` supplies provider controls. `#agreement` supplies any app-required terms or consent controls. `#footer` replaces the login row.

## SForgotPasswordForm

- Model `SForgotPasswordValue` is `{ email: string }`.
- `submit(value)` emits that snapshot. The default label is Send reset link.
- `loginHref` optionally shows Back to sign in. `#footer` replaces that row.

## SResetPasswordForm

- Model `SResetPasswordValue` is `{ email: string, password: string, passwordConfirmation: string }`.
- `submit(value)` emits that snapshot. The default label is Reset password.
- `loginHref` optionally shows Back to sign in. `#footer` replaces that row.
- The consuming app supplies the reset token from its route when making the request.

## SConfirmPasswordForm

- Model `SConfirmPasswordValue` is `{ password: string }`.
- `submit(value)` emits that snapshot. The default label is Confirm password.
- `#footer` adds app-owned secondary navigation.

## STwoFactorForm

- Model `STwoFactorValue` is `{ code: string, recoveryCode: string }`.
- Optional `v-model:mode` is `code` by default, or `recovery`.
- `submit(value)` emits `{ mode: 'code', code: string }` or `{ mode: 'recovery', recoveryCode: string }`. Only the active credential is submitted.
- `codeLength` defaults to 6. Integers from 1 to 12 set the native code length and pattern. Invalid values use 6.
- The authentication code uses one text input with numeric inputmode and one-time-code autocomplete, supporting paste and leading zeroes. Recovery codes use a text input.
- Switching with the built-in button clears both credentials and updates the mode. `modeLabel` replaces the switch text. The default submit label is Verify code.
- `#footer` adds content after the mode switch.

## SEmailVerification

This component uses no model. It accepts `processing`, `error`, and `status`.

- `email` optionally identifies the destination in the instructions.
- `resendDisabled` defaults to false. The app can set it during a server-defined cooldown.
- `resendLabel` defaults to Resend verification email. `signOutLabel` defaults to Sign out.
- `resend()` requests another verification email. `signOut()` requests sign-out. Both are blocked while processing.
- Default slot replaces the instructions. `#footer` replaces the sign-out action.

## Application integration

Keep credential submission, password rules and matching, validation, rate limits, session/CSRF handling, reset tokens, verification links, MFA verification and recovery-code consumption in your auth backend and application adapter. Map Laravel errors such as `password_confirmation` and `recovery_code` to the camelCase model keys. Clear sensitive values after successful submissions and when leaving the page. Keep them in transient state.

For Inertia, pass its Link through `linkAs`. For Vue Router, supply an app adapter that maps href to to and forwards attributes and click behavior. Use footer and social slots for custom navigation or identity providers. Slot controls and their request state belong to the app.

## Demo and validation

Run `npm run dev:auth` from the repo root, normally at http://127.0.0.1:5190. The separate `apps/auth` demo has seven screens, centered/split layouts, appearance and accent controls, and default/error/submitting/success previews. Local sample submissions complete after a short delay and clear credential fields. Password mismatch feedback is demonstrated on registration and reset.

The package uses Vue and `@sirius-ui/vue` as external runtime imports and the shared theme. Root `npm run check` includes the library, demo, and behavior tests. The package builds declarations and agent documentation before packing, alongside the other Sirius libraries.
