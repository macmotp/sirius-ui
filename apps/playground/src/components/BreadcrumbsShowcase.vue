<script setup lang="ts">
import { House } from '@lucide/vue'
import { SBreadcrumbs, SBadge, SCard } from '@sirius-ui/vue'
import DemoLink from './DemoLink.vue'

const trail = [
  { value: 'home', label: 'Overview', href: '#overview', icon: House },
  { value: 'components', label: 'Components', href: '#buttons' },
  { value: 'breadcrumbs', label: 'Breadcrumbs' },
]
const longTrail = [
  { value: 'workspace', label: 'Workspace', href: '#overview' },
  { value: 'team', label: 'Design and product team', href: '#forms' },
  { value: 'project', label: 'A longer project name that wraps on smaller screens' },
]
</script>

<template>
  <section id="breadcrumbs" class="border-t border-line py-10" aria-labelledby="breadcrumbs-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3">
      <h3 id="breadcrumbs-title" class="text-xl font-semibold">A clear way back</h3>
      <SBadge>SBreadcrumbs</SBadge>
    </div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Links show the path to the current page. The final item is text, and long trails wrap naturally.</p>
    <div class="space-y-6">
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Native links and icons</h4></template>
        <SBreadcrumbs :items="trail" label="Component breadcrumb" />
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Custom link component and separator</h4></template>
        <SBreadcrumbs :items="trail" :link-as="DemoLink" label="Custom link breadcrumb">
          <template #separator><span>/</span></template>
        </SBreadcrumbs>
        <p class="mt-4 text-xs text-content-muted">This uses a local anchor adapter. In your app, pass Inertia’s Link component through link-as.</p>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Long labels</h4></template>
        <SBreadcrumbs :items="longTrail" label="Project breadcrumb" />
      </SCard>
    </div>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SBreadcrumbs :items="trail" :link-as="Link" /&gt;</code></pre>
  </section>
</template>
