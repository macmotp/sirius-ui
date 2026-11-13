<script setup lang="ts">
import { SButton, SGrid } from '@sirius-ui/vue'
import { SWebsiteCta, SWebsiteHero, SWebsiteSection } from '@sirius-ui/website'
import StudioServices from '../components/StudioServices.vue'
import StudioTeamCards from '../components/StudioTeamCards.vue'
const values = [
  { title: 'Start with listening.', text: 'Every project begins with a conversation. We take time to understand what matters before we start making.' },
  { title: 'Make it meaningful.', text: 'Beautiful work should have a reason behind it. We look for the idea that holds everything together.' },
  { title: 'Care about the details.', text: 'From a first impression to a final interaction, the little things add up to something people remember.' },
]
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" title="Small studio. Shared curiosity." eyebrow="Hello, we’re Acme Studio" variant="centered" description="A close-knit team of designers and thinkers who believe thoughtful work can make everyday experiences a little better." />
  <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div class="studio-about-art flex min-h-64 flex-col justify-between gap-16 overflow-hidden rounded-2xl bg-primary-soft p-8 text-primary-content sm:min-h-96 sm:p-14"><span class="text-xs font-medium tracking-widest uppercase">Ideas are better together.</span><p class="m-0 max-w-2xl text-4xl leading-tight font-medium tracking-[-0.04em] sm:text-6xl">Different perspectives.<br /><span class="font-serif italic">One shared table.</span></p><span class="text-xs">ACME STUDIO / A PLACE TO MAKE THINGS MATTER</span></div></div>
  <SWebsiteSection title="Built around the work. And the people." eyebrow="Our story"><div class="grid gap-8 text-base leading-8 text-content-muted lg:grid-cols-2"><p class="m-0">Acme Studio is a fictional independent practice created to explore the Sirius website collection. Its story is simple—a few curious people coming together to make brands, websites and ideas feel more human.</p><p class="m-0">The studio works in small, focused teams. Strategy and making happen side by side, with an open conversation throughout. The goal is work that feels clear, useful and full of character.</p></div></SWebsiteSection>
  <SWebsiteSection title="A few things we believe in." eyebrow="What guides us"><SGrid :columns="3" class="gap-8"><article v-for="(value, index) in values" :key="value.title" class="border-t border-line pt-5"><p class="m-0 text-xs text-content-subtle">0{{ index + 1 }}</p><h3 class="mt-8 mb-3 text-xl font-semibold tracking-tight">{{ value.title }}</h3><p class="m-0 text-sm leading-7 text-content-muted">{{ value.text }}</p></article></SGrid></SWebsiteSection>
  <SWebsiteSection title="The people behind the ideas." eyebrow="Meet the team"><StudioTeamCards /></SWebsiteSection>
  <SWebsiteSection title="A studio with a few different tools." eyebrow="Our capabilities"><StudioServices /></SWebsiteSection>
  <SWebsiteCta title="Let’s make something that matters." description="Good projects begin with a good conversation."><template #actions><SButton href="#contact" size="lg">Start a conversation <span aria-hidden="true" class="ms-2">↗</span></SButton></template></SWebsiteCta>
</template>
