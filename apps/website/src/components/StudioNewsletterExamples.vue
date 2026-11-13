<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import { reactive } from 'vue'
import { SIcon } from '@sirius-ui/vue'
import { SWebsiteNewsletter } from '@sirius-ui/website'

const examples = [
  { id: 'details', name: 'Newsletter with subscriber benefits', summary: 'An invitation and sign-up form beside two reasons to subscribe.', title: 'A little inspiration, delivered.', description: 'Notes from the studio, fresh perspectives, and useful things we’ve found along the way. A small pause for your inbox.' },
  { id: 'simple', name: 'Compact signup band', summary: 'A compact sign-up band in the selected accent.', title: 'New ideas from the studio. Straight to your inbox.', description: undefined },
] as const
const details = [
  { id: 'journal', title: 'Worth a little of your time', description: 'Design notes, thoughtful reads, and a closer look at how good ideas take shape.' },
  { id: 'space', title: 'A quieter kind of newsletter', description: 'An occasional note when we have something to share. Leave whenever you like.' },
]
const forms = reactive({ details: { email: '', status: '' }, simple: { email: '', status: '' } })
function submit(id: keyof typeof forms) {
  forms[id].status = 'Thanks for trying the preview. No subscription was created and no email was sent.'
}
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`newsletter-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteNewsletter · ${example.id}`" :index="index">
      <SWebsiteNewsletter v-model="forms[example.id].email" :title="example.title" :description="example.description" :variant="example.id" :details="details" :heading-level="4" :status="forms[example.id].status" @update:model-value="forms[example.id].status = ''" @submit="submit(example.id)">
        <template #icon="{ detail }"><SIcon :name="detail.id === 'journal' ? 'file' : 'check'" /></template>
        <template #footer>Local preview only. Your address stays in this page’s memory. <a href="#journal" class="rounded font-medium text-primary-content underline underline-offset-4">Read the journal instead <span aria-hidden="true">→</span></a></template>
      </SWebsiteNewsletter>
    </StudioSectionExample>
  </div>
</template>
