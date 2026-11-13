<script setup lang="ts">
import { SButton } from '@sirius-ui/vue'
import { SWebsiteHero, SWebsiteSection, SWebsiteCta } from '@sirius-ui/website'
import StudioServices from '../components/StudioServices.vue'
import StudioProcessSteps from '../components/StudioProcessSteps.vue'
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" title="A good idea deserves a thoughtful beginning." eyebrow="Our services" variant="centered" description="From the first question to the final detail, we help shape brands, digital experiences and stories that feel like you."><template #actions><SButton href="#contact" size="lg">Tell us what you’re thinking <span aria-hidden="true" class="ms-2">↗</span></SButton><SButton href="#pricing" variant="ghost" size="lg">Explore our plans</SButton></template></SWebsiteHero>
  <SWebsiteSection title="A few ways we can help." eyebrow="Our capabilities"><StudioServices /></SWebsiteSection>
  <div class="bg-surface"><SWebsiteSection title="A clear path, with room to explore." eyebrow="How we work" description="Every project is different. These are the conversations that help us find the right direction."><StudioProcessSteps /></SWebsiteSection></div>
  <SWebsiteSection title="One project or an ongoing conversation?" eyebrow="Ways of working"><div class="grid gap-8 lg:grid-cols-2"><div class="border-t border-line pt-6"><h3 class="mt-0 text-xl font-semibold">A focused project.</h3><p class="text-sm leading-7 text-content-muted">A defined goal, a clear scope and a shared finish line. A good fit for an identity, website, publication or launch.</p></div><div class="border-t border-line pt-6"><h3 class="mt-0 text-xl font-semibold">A design partnership.</h3><p class="text-sm leading-7 text-content-muted">Consistent creative support as your needs evolve. A familiar team to help keep the work moving forward.</p><SButton href="#pricing" variant="ghost" size="sm">See partnership plans <span aria-hidden="true" class="ms-2">↗</span></SButton></div></div></SWebsiteSection>
  <SWebsiteCta title="Let’s find your starting point." description="A little context is all we need to begin a useful conversation."><template #actions><SButton href="#contact" size="lg">Start a conversation</SButton></template></SWebsiteCta>
</template>
