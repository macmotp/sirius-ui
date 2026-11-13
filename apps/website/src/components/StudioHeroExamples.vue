<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import StudioHomeHero from './StudioHomeHero.vue'
import { SButton } from '@sirius-ui/vue'
import { SWebsiteHero } from '@sirius-ui/website'
import StudioArtwork from './StudioArtwork.vue'
import StudioMobilePreview from './StudioMobilePreview.vue'
import StudioImageTiles from './StudioImageTiles.vue'
import { projects } from '../data'

const examples = [
  { id: 'centered', title: 'Centered introduction', description: 'A focused headline, supporting copy and a pair of actions.', variant: 'centered', media: 'none' },
  { id: 'split', title: 'Text beside artwork', description: 'A split layout for balancing a message with a visual.', variant: 'split', media: 'artwork' },
  { id: 'mobile', title: 'With a mobile mockup', description: 'An app introduction with a framed, original Acme workspace preview.', variant: 'mobile', media: 'device' },
  { id: 'angled', title: 'With an angled image', description: 'An editorial split with a diagonal image edge that stacks on mobile.', variant: 'angled', media: 'angled-photo' },
  { id: 'image-tiles', title: 'With image tiles', description: 'A staggered collage of photography and original artwork, paired with a clear introduction.', variant: 'split', media: 'tiles' },
  { id: 'wide-image', title: 'Centered with a wide image', description: 'An introduction followed by a full-width visual.', variant: 'centered', media: 'photo' },
] as const

const previews = examples.map(example => ({
  ...example,
  headline: example.media === 'tiles' ? 'Different perspectives. Shared possibilities.' : example.variant === 'mobile' ? 'Good ideas travel with you.' : example.variant === 'angled' ? 'A fresh perspective for what comes next.' : 'A little space for a good idea.',
  eyebrow: example.variant === 'mobile' ? undefined : 'Acme Studio',
  copy: example.variant === 'mobile' ? 'Make room for your best work, wherever the day takes you. A calmer home for projects, little wins, and everything in between.' : 'Thoughtful design for the things you’re ready to put into the world. Let’s find your next starting point together.',
  announcement: example.variant === 'mobile' ? 'Meet your new pocket workspace' : example.variant === 'angled' ? 'A new chapter for Acme Studio' : undefined,
  action: example.variant === 'mobile' ? 'Get started' : 'Start a conversation',
}))
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample id="hero-example-studio-original" title="Studio introduction with featured project" description="The original homepage hero, with a custom headline, project link, and supporting note." label="SWebsiteHero · original studio composition"><StudioHomeHero :heading-level="4" /></StudioSectionExample>
    <StudioSectionExample v-for="(example, index) in previews" :key="example.id" :id="`hero-example-${example.id}`" :title="example.title" :description="example.description" :label="`SWebsiteHero · ${example.variant}`" :index="index" :preview-class="example.media === 'tiles' ? 'hero-tiles-preview' : undefined">
      <SWebsiteHero :heading-level="4" :title="example.headline" :eyebrow="example.eyebrow" :description="example.copy" :variant="example.variant">
        <template v-if="example.announcement" #announcement><SButton href="#projects" variant="soft" size="sm">{{ example.announcement }} <span aria-hidden="true" class="ms-2">↗</span></SButton></template>
        <template #actions><SButton href="#contact" size="lg">{{ example.action }}</SButton><SButton href="#projects" variant="ghost" size="lg">Explore our work <span aria-hidden="true" class="ms-2">↗</span></SButton></template>
        <template v-if="example.media !== 'none'" #media>
          <div v-if="example.media === 'artwork'" class="aspect-[4/3] overflow-hidden rounded-2xl"><StudioArtwork :project="projects[0]!" /></div>
          <StudioImageTiles v-else-if="example.media === 'tiles'" />
          <StudioMobilePreview v-else-if="example.media === 'device'" />
          <img v-else-if="example.media === 'angled-photo'" src="/images/article-workspace.jpg" alt="An airy creative workspace with a laptop, keyboard and design book." width="1400" height="933" loading="lazy" class="aspect-[4/3] h-full min-h-72 w-full object-cover lg:aspect-auto" />
          <figure v-else class="m-0"><img src="/images/article-workspace.jpg" alt="A clean workspace with a keyboard, laptop and design book." width="1400" height="933" loading="lazy" class="aspect-[16/9] w-full rounded-2xl object-cover" /><figcaption class="mt-3 text-start text-xs text-content-muted">A little room for the next idea. <a href="https://unsplash.com/photos/r3iAqHb7JWs" class="rounded text-content-muted underline underline-offset-4">Photo by Patrik Michalicka / Unsplash</a></figcaption></figure>
        </template>
      </SWebsiteHero>
      <template #note><p v-if="example.media === 'angled-photo'" class="mt-3 text-xs text-content-muted"><a href="https://unsplash.com/photos/r3iAqHb7JWs" class="rounded underline underline-offset-4">Photo by Patrik Michalicka / Unsplash</a></p></template>
    </StudioSectionExample>
  </div>
</template>

<style scoped>
:deep(.hero-tiles-preview) {
  background-image: radial-gradient(ellipse at 85% 20%, var(--sirius-primary-soft), transparent 65%);
}
</style>
