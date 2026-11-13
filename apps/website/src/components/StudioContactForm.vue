<script setup lang="ts">
import { nextTick, reactive, shallowRef, useTemplateRef } from 'vue'
import { SButton, SField, SForm, SInput, STextarea } from '@sirius-ui/vue'

const root = useTemplateRef<HTMLElement>('root')
const draft = reactive({ firstName: '', lastName: '', email: '', phone: '', message: '' })
const errors = shallowRef<Record<string, string>>({})
const status = shallowRef('')
async function submit() {
  status.value = ''
  errors.value = {
    ...(!draft.firstName.trim() ? { firstName: 'Enter your first name.' } : {}),
    ...(!draft.lastName.trim() ? { lastName: 'Enter your last name.' } : {}),
    ...(!draft.message.trim() ? { message: 'Tell us a little about your idea.' } : {}),
  }
  if (Object.keys(errors.value).length) {
    await nextTick()
    root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  status.value = 'Thanks for trying the preview. No message was sent.'
}
</script>

<template>
  <div ref="root">
    <SForm :columns="2" aria-label="Send a message to Acme Studio" @submit.prevent="submit" @input="status = ''">
      <SField v-slot="{ control }" label="First name" :error="errors.firstName" required><SInput v-bind="control" v-model="draft.firstName" name="first-name" autocomplete="given-name" maxlength="100" /></SField>
      <SField v-slot="{ control }" label="Last name" :error="errors.lastName" required><SInput v-bind="control" v-model="draft.lastName" name="last-name" autocomplete="family-name" maxlength="100" /></SField>
      <SField v-slot="{ control }" label="Email address" required full-width><SInput v-bind="control" v-model="draft.email" name="email" type="email" autocomplete="email" :spellcheck="false" autocapitalize="none" maxlength="254" /></SField>
      <SField v-slot="{ control }" label="Phone number (optional)" full-width><SInput v-bind="control" v-model="draft.phone" name="phone" type="tel" autocomplete="tel" maxlength="40" /></SField>
      <SField v-slot="{ control }" label="Message" :error="errors.message" required full-width><STextarea v-bind="control" v-model="draft.message" name="message" :rows="4" maxlength="3000" placeholder="What would you like to make happen?" /></SField>
      <template #actions><div class="w-full space-y-4"><p v-if="Object.keys(errors).length" role="alert" class="m-0 text-sm text-danger-content">Check the highlighted fields before sending.</p><p role="status" class="m-0 text-sm leading-6 text-content-muted">{{ status }}</p><div class="flex flex-wrap items-center justify-between gap-4"><p class="m-0 max-w-xs text-xs leading-5 text-content-muted">Local preview only. Your details stay in this page.</p><SButton type="submit">Send message <span aria-hidden="true" class="ms-2">↗</span></SButton></div></div></template>
    </SForm>
  </div>
</template>
