<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, shallowRef, useTemplateRef } from 'vue'
import { SAlert, SButton, SCard, SField, SForm, SInput, SSelect, STextarea } from '@sirius-ui/vue'

const root = useTemplateRef<HTMLElement>('root')
const draft = reactive({ name: '', email: '', service: '', message: '' })
const errors = shallowRef<Record<string, string>>({})
const processing = shallowRef(false)
const sent = shallowRef(false)
let timer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(timer))
async function submit() {
  if (processing.value) return
  errors.value = {
    ...(!draft.name.trim() ? { name: 'Tell us your name.' } : {}),
    ...(!draft.message.trim() ? { message: 'Tell us a little about your idea.' } : {}),
  }
  if (Object.keys(errors.value).length) {
    await nextTick()
    root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  processing.value = true
  timer = setTimeout(async () => {
    processing.value = false
    sent.value = true
    await nextTick()
    root.value?.querySelector<HTMLElement>('[role="status"]')?.focus()
  }, 650)
}
async function reset() {
  Object.assign(draft, { name: '', email: '', service: '', message: '' })
  errors.value = {}
  sent.value = false
  await nextTick()
  root.value?.querySelector<HTMLInputElement>('input')?.focus()
}
</script>

<template>
  <div ref="root">
    <SCard>
      <div v-if="sent" class="space-y-6 py-4"><SAlert role="status" tabindex="-1" color="success" title="Thanks for the conversation.">Preview complete. No message was sent.</SAlert><SButton variant="outline" @click="reset">Write another message</SButton></div>
      <SForm v-else :columns="2" :aria-busy="processing || undefined" aria-label="Contact the studio" @submit.prevent="submit">
        <SField v-slot="{ control }" label="Your name" :error="errors.name" required><SInput v-bind="control" v-model="draft.name" name="name" autocomplete="name" maxlength="100" :disabled="processing" /></SField>
        <SField v-slot="{ control }" label="Email address" required><SInput v-bind="control" v-model="draft.email" name="email" type="email" autocomplete="email" maxlength="254" :disabled="processing" /></SField>
        <SField v-slot="{ control }" label="What can we help with?" full-width><SSelect v-bind="control" v-model="draft.service" name="service" placeholder="Choose a starting point (optional)" :options="[{ value: 'brand', label: 'Brand & identity' }, { value: 'digital', label: 'A website or digital product' }, { value: 'editorial', label: 'Editorial or packaging' }, { value: 'other', label: 'Something else' }]" :disabled="processing" /></SField>
        <SField v-slot="{ control }" label="A little about your idea" :error="errors.message" required full-width><STextarea v-bind="control" v-model="draft.message" name="message" :rows="5" maxlength="3000" placeholder="What are you thinking? What would you like to change?" :disabled="processing" /></SField>
        <template #actions><div class="flex w-full flex-wrap items-center justify-between gap-4"><p class="m-0 max-w-xs text-xs leading-5 text-content-muted">This is a local template preview. Your details stay in this page.</p><SButton type="submit" :loading="processing">Send message <span aria-hidden="true" class="ms-2">↗</span></SButton></div></template>
      </SForm>
    </SCard>
  </div>
</template>
