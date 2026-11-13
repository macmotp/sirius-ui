<script setup lang="ts">
import { SButton } from '@sirius-ui/vue'
import { SWebsiteSection } from '@sirius-ui/website'
import StudioHomeHero from '../components/StudioHomeHero.vue'
import StudioConversationCta from '../components/StudioConversationCta.vue'
import StudioProjectGrid from '../components/StudioProjectGrid.vue'
import StudioServices from '../components/StudioServices.vue'
import { projects } from '../data'
</script>

<template>
  <StudioHomeHero title-id="studio-page-title" />
  <div class="border-y border-line bg-surface">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-7 sm:px-8 lg:px-10"><p class="m-0 text-xs text-content-muted">A few ideas we’ve helped bring to life</p><div class="flex flex-wrap gap-x-9 gap-y-3 text-lg font-semibold tracking-tight text-content-muted"><span>fieldwork.</span><span class="font-normal tracking-widest">ORBIT</span><span class="font-serif italic">forma</span><span class="text-sm font-medium tracking-widest">NORTHLINE</span></div></div>
  </div>
  <SWebsiteSection title="A few things we’ve made." eyebrow="Selected work" description="Different challenges. A shared belief that the best work feels both useful and unmistakably itself.">
    <template #aside><SButton href="#projects" variant="ghost">View all projects <span aria-hidden="true" class="ms-2">↗</span></SButton></template>
    <StudioProjectGrid :projects="projects.slice(0, 2)" />
  </SWebsiteSection>
  <SWebsiteSection title="From first thought to the finer details." eyebrow="What we do" description="We work across disciplines, bringing the big picture and the small details into the same conversation."><StudioServices /></SWebsiteSection>
  <SWebsiteSection title="Good work is a conversation." eyebrow="Our approach">
    <div class="grid gap-8 lg:grid-cols-2"><p class="m-0 max-w-lg text-2xl leading-relaxed tracking-tight">We listen closely, ask useful questions, and make space for the unexpected.</p><div class="text-base leading-8 text-content-muted"><p class="mt-0">We’re a small independent studio with a hands-on approach. You work directly with the people doing the work, from the first conversation to the final handover.</p><SButton href="#about" variant="ghost" class="mt-3">A little more about us <span aria-hidden="true" class="ms-2">↗</span></SButton></div></div>
  </SWebsiteSection>
  <StudioConversationCta />
</template>
