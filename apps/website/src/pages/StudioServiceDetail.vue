<script setup lang="ts">
import { computed } from 'vue'
import { SButton, SGrid, SIcon } from '@sirius-ui/vue'
import { SWebsiteHero, SWebsiteSection, SWebsiteCta } from '@sirius-ui/website'
import StudioProjectGrid from '../components/StudioProjectGrid.vue'
import { projects } from '../data'
import type { StudioService } from '../data'
import { processSteps, serviceDetails } from '../content'
const props = defineProps<{ service: StudioService }>()
const detail = computed(() => serviceDetails[props.service.id])
const work = computed(() => projects.filter(project => project.id === props.service.projectId))
</script>

<template>
  <SWebsiteHero title-id="studio-page-title" :title="service.title" :eyebrow="`Our services / ${service.number}`" :description="service.description" variant="centered"><template #actions><SButton href="#contact" size="lg">Talk about your project</SButton><SButton href="#services" variant="ghost" size="lg">All services</SButton></template></SWebsiteHero>
  <SWebsiteSection title="A clear idea, thoughtfully expressed." eyebrow="The approach"><div class="grid gap-10 lg:grid-cols-2"><p class="m-0 text-xl leading-9 tracking-tight">{{ detail.introduction }}</p><div><h3 class="mt-0 mb-5 text-sm font-semibold">What we can make together</h3><ul class="m-0 list-none space-y-4 p-0"><li v-for="item in detail.includes" :key="item" class="flex gap-3 text-sm leading-6 text-content-muted"><SIcon name="check" class="mt-1 size-4 shrink-0 text-primary-content" /><span>{{ item }}</span></li></ul></div></div></SWebsiteSection>
  <div class="bg-surface"><SWebsiteSection title="From the first question to the final handover." eyebrow="The process"><SGrid :columns="4" class="gap-8"><article v-for="(step, index) in processSteps" :key="step.title"><span class="text-xs text-primary-content">0{{ index + 1 }}</span><h3 class="mt-6 mb-3 text-lg font-semibold">{{ step.title }}</h3><p class="m-0 text-sm leading-7 text-content-muted">{{ step.description }}</p></article></SGrid></SWebsiteSection></div>
  <SWebsiteSection title="What you take forward." eyebrow="The outcome" :description="detail.outcome"><StudioProjectGrid :projects="work" /></SWebsiteSection>
  <SWebsiteCta :title="`Thinking about ${service.title.toLowerCase()}?`" description="Let’s talk about where you are and where you want to go."><template #actions><SButton href="#contact" size="lg">Get in touch</SButton></template></SWebsiteCta>
</template>
