<script setup lang="ts">
import StudioSectionExample from './StudioSectionExample.vue'
import StudioServices from './StudioServices.vue'
import StudioProcessSteps from './StudioProcessSteps.vue'
import { SIcon, type SIconName } from '@sirius-ui/vue'
import { SWebsiteSection, SWebsiteFeatures, type SWebsiteFeature, type SWebsiteFeaturesProps } from '@sirius-ui/website'
import StudioArtwork from './StudioArtwork.vue'
import { projects } from '../data'

type DemoFeature = SWebsiteFeature & { icon: SIconName }
interface FeatureExample {
  id: string
  name: string
  summary: string
  title: string
  eyebrow?: string
  description?: string
  variant: NonNullable<SWebsiteFeaturesProps['variant']>
  features: DemoFeature[]
}

const workflow: DemoFeature[] = [
  { id: 'share', title: 'Share the next step', description: 'Bring a first draft into the conversation. Keep feedback close to the work so everyone knows where to go next.', href: '#services/digital', icon: 'upload' },
  { id: 'review', title: 'Make room for feedback', description: 'Give every idea a thoughtful review, with clear decisions and a shared understanding of what is ready.', href: '#services/brand', icon: 'check' },
  { id: 'organize', title: 'Keep the details together', description: 'A home for the notes, files, and small decisions that help a good project become a great one.', href: '#projects', icon: 'file' },
]
const collaboration: DemoFeature[] = [
  { id: 'inbox', title: 'One place for conversations', description: 'Turn scattered questions into useful conversations. Pick up where you left off without searching through another thread.', href: '#services/digital', icon: 'inbox' },
  { id: 'team', title: 'A little more in sync', description: 'Invite the right people into each project, share responsibilities, and make the next handover feel effortless.', href: '#about', icon: 'user' },
  { id: 'focus', title: 'Space to focus', description: 'Keep important updates in view and let the rest wait. A calmer workspace makes it easier to do your best work.', href: '#services/brand', icon: 'info' },
]
const examples: FeatureExample[] = [
  { id: 'small-icons', name: 'Three columns with small icons', summary: 'A centered introduction with subtle icons and aligned feature links.', variant: 'small-icons', eyebrow: 'A clearer way to work', title: 'The little things that move work forward.', description: 'Less time finding the pieces. More time making something worth sharing.', features: workflow },
  { id: 'large-icons', name: 'Three columns with large icons', summary: 'A left-aligned introduction with larger, accent-colored icon tiles.', variant: 'large-icons', title: 'Good work starts with a connected team.', description: 'Make everyday collaboration feel a little more human, from the first question to the final delivery.', features: collaboration },
  { id: 'grid', name: 'Four-feature grid', summary: 'An introduction beside four features, arranged in two columns.', variant: 'grid', title: 'A thoughtful home for every part of the project.', features: [
    { id: 'brief', title: 'Start with a clear brief', description: 'Give the team a shared starting point, with the goals and context that make the work meaningful.', icon: 'file' },
    { id: 'people', title: 'Bring people together', description: 'Keep collaborators close to the decisions they need to make, with a clear sense of who is doing what.', icon: 'user' },
    { id: 'feedback', title: 'Keep feedback useful', description: 'Gather notes in one place and turn the next round of feedback into a focused plan.', icon: 'inbox' },
    { id: 'finish', title: 'Finish with confidence', description: 'Review the details, celebrate the progress, and make a handover that feels as good as the work.', icon: 'check' },
  ] },
  { id: 'image', name: 'Workflow with product preview', summary: 'A compact feature list paired with an original product preview.', variant: 'image', eyebrow: 'From the first idea to the final detail', title: 'A better rhythm for your working day.', description: 'See what is moving, what needs a second look, and where your attention can make a difference.', features: workflow.map(({ href, ...feature }) => feature) },
]
const icons = Object.fromEntries(examples.flatMap(example => example.features.map(feature => [feature.id, feature.icon])))
const orbit = projects.find(project => project.id === 'orbit')!
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample id="feature-example-services-original" title="Studio services with numbered columns" description="The original homepage services section, with linked service summaries." label="SWebsiteSection + StudioServices"><SWebsiteSection title="From first thought to the finer details." eyebrow="What we do" description="We work across disciplines, bringing the big picture and the small details into the same conversation." :heading-level="4"><StudioServices :heading-level="5" /></SWebsiteSection></StudioSectionExample>
    <StudioSectionExample id="feature-example-process-original" title="Studio process in four steps" description="The original Services-page process, with numbered steps and concise explanations." label="SWebsiteSection + StudioProcessSteps"><SWebsiteSection title="A clear path, with room to explore." eyebrow="How we work" description="Every project is different. These are the conversations that help us find the right direction." :heading-level="4"><StudioProcessSteps :heading-level="5" /></SWebsiteSection></StudioSectionExample>
    <StudioSectionExample v-for="(example, index) in examples" :key="example.id" :id="`feature-example-${example.id}`" :title="example.name" :description="example.summary" :label="`SWebsiteFeatures · ${example.variant}`" :index="index">
      <SWebsiteFeatures :title="example.title" :description="example.description" :eyebrow="example.eyebrow" :features="example.features" :variant="example.variant" :heading-level="4">
        <template #icon="{ feature }"><SIcon :name="icons[feature.id]!" /></template>
        <template v-if="example.variant === 'image'" #media>
          <figure class="m-0">
            <div class="rounded-2xl bg-primary-soft p-4 ring-1 ring-inset ring-line sm:p-6"><div class="aspect-[4/3] overflow-hidden rounded-2xl shadow-sm"><StudioArtwork :project="orbit" /></div></div>
            <figcaption class="mt-3 text-xs leading-5 text-content-muted">Orbit, an original Acme workspace concept. Preview content is illustrative.</figcaption>
          </figure>
        </template>
      </SWebsiteFeatures>
    </StudioSectionExample>
  </div>
</template>
