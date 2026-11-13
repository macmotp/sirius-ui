<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import StudioConversationCta from './StudioConversationCta.vue'
import { SButton } from '@sirius-ui/vue'
import { SWebsiteCta } from '@sirius-ui/website'

const examples = [
  { id: 'simple', name: 'Left-aligned invitation', summary: 'A clear invitation with a headline and two actions.', title: 'Your next good idea deserves a place to start.', description: undefined, eyebrow: undefined },
  { id: 'centered', name: 'Centered panel with accent glow', summary: 'A framed invitation with a soft accent glow.', title: 'Make a little room for something great.', description: 'Bring your ambition. We’ll bring a thoughtful process and a fresh pair of eyes. Let’s see where the next conversation takes us.', eyebrow: undefined },
  { id: 'gradient', name: 'Centered invitation with gradient', summary: 'An open, centered layout with a glow in the selected accent.', title: 'A fresh beginning, together.', description: 'From the first sketch to the final detail, we help turn a promising idea into something people want to spend time with.', eyebrow: undefined },
  { id: 'image', name: 'Image-led contact invitation', summary: 'Photography beside an invitation to get in touch.', title: 'Good work starts with a conversation.', description: 'A question, a half-formed idea, or a brief ready to go. Wherever you are in the process, we’d love to hear what you have in mind.', eyebrow: 'A thoughtful partner for what’s next' },
] as const
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample id="cta-example-banner-original" title="Studio conversation banner" description="The original accent-soft banner with an invitation and a contact action." label="SWebsiteCta · banner"><StudioConversationCta :heading-level="4" /></StudioSectionExample>
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`cta-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteCta · ${example.id}`" :index="index">
      <SWebsiteCta :title="example.title" :description="example.description" :eyebrow="example.eyebrow" :variant="example.id" :heading-level="4">
        <template #actions><SButton href="#contact" size="lg">Let’s talk</SButton><SButton v-if="example.id !== 'image'" href="#projects" variant="ghost" size="lg">Explore our work <span aria-hidden="true" class="ms-2">→</span></SButton></template>
        <template v-if="example.id === 'image'" #media><img src="/images/article-notebook.jpg" alt="An open notebook, pencil and laptop on a bright studio desk." width="1400" height="933" loading="lazy" class="h-full min-h-72 w-full object-cover" /></template>
      </SWebsiteCta>
      <template #note><p v-if="example.id === 'image'" class="mt-3 text-xs text-content-muted"><a href="https://unsplash.com/photos/pUAM5hPaCRI" class="rounded underline underline-offset-4">Photo by JESHOOTS.COM / Unsplash</a></p></template>
    </StudioSectionExample>
  </div>
</template>
