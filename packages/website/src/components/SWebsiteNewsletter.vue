<script setup lang="ts">
import { useId } from 'vue'
import { SButton, SInput } from '@sirius-ui/vue'
import type { SWebsiteNewsletterDetail, SWebsiteNewsletterProps } from '../website.types'

const props = withDefaults(defineProps<SWebsiteNewsletterProps>(), { variant: 'details', headingLevel: 2, emailLabel: 'Email address', placeholder: 'Enter your email', submitLabel: 'Subscribe', processing: false, disabled: false })
const email = defineModel<string>({ required: true })
const emit = defineEmits<{ submit: [email: string] }>()
defineSlots<{ icon?(props: { detail: SWebsiteNewsletterDetail }): unknown; footer?(): unknown }>()
const id = useId()
function submit() {
  if (!props.processing && !props.disabled && email.value.trim()) emit('submit', email.value.trim())
}
</script>

<template>
  <section :aria-labelledby="`${id}-title`" class="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
    <div class="grid min-w-0 gap-10" :class="variant === 'simple' ? 'items-center rounded-2xl bg-primary-soft px-7 py-12 sm:px-12 lg:grid-cols-2' : 'newsletter-details rounded-2xl py-4 lg:grid-cols-2 lg:gap-16'">
      <div class="min-w-0">
        <component :is="`h${headingLevel}`" :id="`${id}-title`" class="m-0 max-w-xl text-3xl font-semibold tracking-tight text-content wrap-anywhere sm:text-4xl">{{ title }}</component>
        <p v-if="description" class="mt-4 mb-0 max-w-xl text-base leading-7 text-content-muted">{{ description }}</p>
      </div>
      <form class="min-w-0" :class="{ 'lg:col-start-1 lg:row-start-2': variant === 'details' }" :aria-labelledby="`${id}-title`" :aria-busy="processing || undefined" @submit.prevent="submit">
        <label :for="`${id}-email`" class="sr-only">{{ emailLabel }}</label>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
          <SInput :id="`${id}-email`" v-model="email" name="email" type="email" autocomplete="email" autocapitalize="none" :spellcheck="false" required size="lg" :placeholder="placeholder" :disabled="disabled || processing" :invalid="!!error" :aria-describedby="error ? `${id}-error` : undefined" class="min-w-0 flex-1" />
          <SButton type="submit" size="lg" :loading="processing" :disabled="disabled || processing" class="shrink-0">{{ submitLabel }}</SButton>
        </div>
        <p v-if="error" :id="`${id}-error`" role="alert" class="mt-3 mb-0 text-sm leading-6 text-danger-content">{{ error }}</p>
        <p role="status" class="m-0 text-sm leading-6 text-content-muted" :class="{ 'mt-3': status }">{{ status }}</p>
        <div v-if="$slots.footer" class="mt-4 text-sm leading-6 text-content-muted"><slot name="footer" /></div>
      </form>
      <dl v-if="variant === 'details' && details?.length" class="m-0 grid min-w-0 gap-8 sm:grid-cols-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
        <div v-for="detail in details" :key="detail.id" class="min-w-0">
          <dt class="flex flex-col items-start gap-4 text-base font-semibold text-content"><span v-if="$slots.icon" aria-hidden="true" class="grid size-12 place-items-center rounded-2xl bg-surface text-primary-content ring-1 ring-inset ring-line [&>svg]:size-6"><slot name="icon" :detail="detail" /></span>{{ detail.title }}</dt>
          <dd class="ms-0 mt-3 text-base leading-7 text-content-muted">{{ detail.description }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.newsletter-details { background-image: radial-gradient(ellipse at 75% 20%, var(--sirius-primary-soft), transparent 65%); }
</style>
