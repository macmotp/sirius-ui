<script setup lang="ts">
import { shallowRef } from 'vue'
import { Folder, Plus, Search } from '@lucide/vue'
import { SBadge, SButton, SCard, SEmptyState, SGrid } from '@sirius-ui/vue'

const projects = shallowRef<string[]>([])
const filtered = shallowRef(true)
</script>

<template>
  <section id="empty-states" class="border-t border-line py-10" aria-labelledby="empty-states-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="empty-states-title" class="text-xl font-semibold tracking-tight">An empty view, with a way forward</h3><SBadge>SEmptyState</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Explain what is missing and offer a useful next action. Content and actions belong to your application.</p>
    <SEmptyState :heading-level="4" v-if="!projects.length" title="No projects yet" description="Create your first project to give your team's ideas a home." :icon="Folder" class="rounded-2xl bg-surface ring-1 ring-inset ring-line">
      <template #actions><SButton @click="projects = ['My first project']"><template #leading><Plus /></template>Create demo project</SButton></template>
    </SEmptyState>
    <SCard v-else><h4 class="font-semibold">{{ projects[0] }}</h4><p role="status" class="mt-2 text-sm text-success-content">Demo project created locally.</p><SButton class="mt-5" size="sm" variant="outline" @click="projects = []">Reset empty project demo</SButton></SCard>
    <SGrid :columns="2" class="mt-6">
      <SEmptyState :heading-level="4" v-if="filtered" title="No matching results" description="Try removing a filter or searching for a different phrase." :icon="Search" class="rounded-2xl bg-surface ring-1 ring-inset ring-line"><template #actions><SButton variant="outline" @click="filtered = false">Clear demo filters</SButton></template></SEmptyState>
      <SCard v-else><h4 class="font-semibold">All results are visible</h4><SButton class="mt-5" size="sm" variant="outline" @click="filtered = true">Apply demo filter</SButton></SCard>
      <SEmptyState :heading-level="4" title="You're all caught up" description="New updates will appear here when your team has something to share." :icon="false" class="rounded-2xl bg-surface ring-1 ring-inset ring-line"><template #title>You're all caught up <SBadge color="success" size="sm">Done</SBadge></template></SEmptyState>
    </SGrid>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SEmptyState :heading-level="4" title="No projects yet" description="Create a project to get started." :icon="Folder"&gt;
  &lt;template #actions&gt;
    &lt;SButton @click="createProject"&gt;Create project&lt;/SButton&gt;
  &lt;/template&gt;
&lt;/SEmptyState&gt;</code></pre>
  </section>
</template>
