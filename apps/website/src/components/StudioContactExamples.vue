<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import StudioEnquirySection from './StudioEnquirySection.vue'
import { SWebsiteContact } from '@sirius-ui/website'
import StudioContactForm from './StudioContactForm.vue'

const details = [
  { id: 'address', label: 'Address', value: 'Acme House, Example Street\nSingapore · By appointment' },
  { id: 'phone', label: 'Telephone', value: '+1 (202) 555-0148', href: 'tel:+12025550148' },
  { id: 'email', label: 'Email', value: 'studio@acme.example', href: 'mailto:studio@acme.example' },
]
const locations = [
  { id: 'singapore', title: 'Singapore', address: ['Acme House, Example Street', 'Singapore · By appointment'] },
  { id: 'london', title: 'London', address: ['Acme Works, Example Lane', 'London · By appointment'] },
  { id: 'toronto', title: 'Toronto', address: ['Acme Studio, Example Avenue', 'Toronto · By appointment'] },
  { id: 'melbourne', title: 'Melbourne', address: ['Acme Space, Example Road', 'Melbourne · By appointment'] },
]
const detailPaths: Record<string, string> = {
  address: 'M4 21V5h10v16M14 10h6v11M2 21h20M7 8h4M7 12h4M7 16h4M17 13h1M17 17h1',
  phone: 'M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z',
  email: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
}
const examples = [
  { id: 'split', name: 'Contact details with message form', summary: 'Contact details beside a form, with a soft accent backdrop.', title: 'A good conversation starts here.', description: 'A new idea, a question, or a project ready to take shape. Tell us what’s on your mind and where you’d like to go next.' },
  { id: 'locations', name: 'Four-column location directory', summary: 'Four location blocks with clear headings and address details.', title: 'A few places to find us.', description: 'A small studio concept with a shared approach, wherever the next conversation happens.' },
] as const
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample id="contact-example-enquiry-original" title="Project enquiry with service selection" description="The original contact-page enquiry form, including service selection, pending feedback, and reset." label="SWebsiteSection + StudioEnquiryForm"><StudioEnquirySection :heading-level="4" /></StudioSectionExample>
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`contact-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteContact · ${example.id}`" :index="index">
      <SWebsiteContact :title="example.title" :description="example.description" :variant="example.id" :details="details" :locations="locations" :heading-level="4">
        <template #icon="{ detail }"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="detailPaths[String(detail.id)]" /></svg></template>
        <template v-if="example.id === 'split'" #form><StudioContactForm /></template>
      </SWebsiteContact>
      <template #note><p class="mt-3 text-xs leading-5 text-content-muted">Fictional contact details and locations for the Acme Studio preview.</p></template>
    </StudioSectionExample>
  </div>
</template>
