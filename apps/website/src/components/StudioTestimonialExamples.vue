<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import { SWebsiteTestimonials } from '@sirius-ui/website'

const testimonials = [
  { id: 'maya', quote: 'They helped us find the thread that made our idea feel like us. Every conversation made the direction clearer, and every detail had a reason to be there.', name: 'Maya Chen', role: 'Co-founder', company: 'Fieldwork' },
  { id: 'alex', quote: 'From the first sketch to the final handover, it felt like working with an extension of our team. We came away with a clearer product and a much better way to tell its story.', name: 'Alex Morgan', role: 'Product lead', company: 'Orbit' },
]
const examples = [
  { id: 'simple', name: 'Centered partner quote', summary: 'A centered quote with brand treatment and an avatar.', items: [testimonials[0]!] },
  { id: 'image', name: 'Quote beside studio photography', summary: 'A studio photograph alongside a prominent quote.', items: [testimonials[1]!] },
  { id: 'multiple', name: 'Two-column partner quotes', summary: 'Two quotes side by side, with aligned attribution and a subtle divider.', items: testimonials },
] as const
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`testimonial-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteTestimonials · ${example.id}`" :index="index">
      <SWebsiteTestimonials :title="`${example.name} partner testimonials`" :testimonials="example.items" :variant="example.id" :heading-level="4">
        <template v-if="example.id !== 'image'" #brand="{ testimonial }"><span class="text-2xl font-semibold tracking-tight text-primary-content">{{ testimonial.company }}<span aria-hidden="true">.</span></span></template>
        <template v-if="example.id === 'image'" #media><img src="/images/article-workspace.jpg" alt="A bright Acme studio workspace with a laptop and design book." width="1400" height="933" loading="lazy" class="h-full min-h-64 w-full object-cover" /></template>
      </SWebsiteTestimonials>
      <template #note><p class="mt-3 text-xs leading-5 text-content-muted">Fictional people and quotes for this preview. Avatars show placeholder initials.<template v-if="example.id === 'image'"> <a href="https://unsplash.com/photos/r3iAqHb7JWs" class="rounded underline underline-offset-4">Photo by Patrik Michalicka / Unsplash</a></template></p></template>
    </StudioSectionExample>
  </div>
</template>
