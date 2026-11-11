<script setup lang="ts">
import { computed } from 'vue'
import { SButton, SField, SInput } from '@sirius-ui/vue'
import AuthForm from './AuthForm.vue'
import type { STwoFactorFormProps, STwoFactorSubmission, STwoFactorValue } from '../auth.types'

const props = withDefaults(defineProps<STwoFactorFormProps>(), { submitLabel: 'Verify code', codeLength: 6 })
const value = defineModel<STwoFactorValue>({ required: true })
const mode = defineModel<'code' | 'recovery'>('mode', { default: 'code' })
const emit = defineEmits<{ submit: [value: STwoFactorSubmission] }>()
defineSlots<{ footer?(): unknown }>()
const length = computed(() => Number.isInteger(props.codeLength) && props.codeLength > 0 && props.codeLength <= 12 ? props.codeLength : 6)
function switchMode() {
  value.value = { code: '', recoveryCode: '' }
  mode.value = mode.value === 'code' ? 'recovery' : 'code'
}
function submit() {
  emit('submit', mode.value === 'code' ? { mode: 'code', code: value.value.code } : { mode: 'recovery', recoveryCode: value.value.recoveryCode })
}
</script>

<template>
  <AuthForm :processing="processing" :error="error" :status="status" :submit-label="submitLabel" @submit="submit">
    <SField v-if="mode === 'code'" v-slot="{ control }" label="Authentication code" :description="`Enter the ${length}-digit code from your authenticator app.`" :error="errors?.code" required>
      <SInput v-bind="control" :model-value="value.code" name="code" inputmode="numeric" autocomplete="one-time-code" :pattern="`[0-9]{${length}}`" :minlength="length" :maxlength="length" class="text-center tracking-[0.35em] tabular-nums" @update:model-value="value = { ...value, code: $event }" />
    </SField>
    <SField v-else v-slot="{ control }" label="Recovery code" description="Enter one of the recovery codes you saved when enabling two-factor authentication." :error="errors?.recoveryCode" required>
      <SInput v-bind="control" :model-value="value.recoveryCode" name="recovery_code" autocomplete="off" autocapitalize="none" spellcheck="false" @update:model-value="value = { ...value, recoveryCode: $event }" />
    </SField>
    <template #footer>
      <SButton variant="ghost" size="sm" :disabled="processing" @click="switchMode">{{ modeLabel ?? (mode === 'code' ? 'Use a recovery code' : 'Use an authentication code') }}</SButton>
      <slot name="footer" />
    </template>
  </AuthForm>
</template>
