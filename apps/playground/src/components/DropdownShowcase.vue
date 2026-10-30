<script setup lang="ts">
import { ref } from 'vue'
import { Archive, Copy, Download, ExternalLink, Pencil, Settings, Trash2 } from '@lucide/vue'
import { SBadge, SCard, SCheckbox, SDropdown, SGrid, SSelect } from '@sirius-ui/vue'
import type { SDropdownItem } from '@sirius-ui/vue'

const disabled = ref(false)
const align = ref<'start' | 'end'>('end')
const result = ref('Choose an action to try the menu.')
const items: SDropdownItem[] = [
  { id: 'edit', label: 'Edit details', icon: Pencil },
  { id: 'copy', label: 'Duplicate demo', icon: Copy },
  { id: 'settings', label: 'Workspace settings', icon: Settings, disabled: true },
  { id: 'components', label: 'Browse components', icon: ExternalLink, href: '#buttons', separatorBefore: true },
  { id: 'archive', label: 'Archive demo', icon: Archive, separatorBefore: true },
  { id: 'delete', label: 'Delete demo', icon: Trash2, danger: true, disabled: true },
]
function select(item: SDropdownItem) { result.value = `Selected: ${item.label}. No data was changed.` }
</script>

<template>
  <section id="dropdowns" class="border-t border-line py-10" aria-labelledby="dropdowns-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="dropdowns-title" class="text-xl font-semibold tracking-tight">Actions, close at hand</h3><SBadge>SDropdown</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">A menu for actions and navigation. Open with Enter, Space, or the arrow keys. Navigate with arrows, Home/End, or type a label; Escape returns to the trigger.</p>
    <SCard>
      <template #header><h4 class="text-sm font-semibold">Try the action menu</h4></template>
      <div class="flex flex-wrap items-center gap-5">
        <div class="flex items-center gap-3"><label for="dropdown-align" class="text-sm font-medium">Menu alignment</label><SSelect id="dropdown-align" :model-value="align" :options="[{value: 'start', label: 'Start'}, {value: 'end', label: 'End'}]" @update:model-value="align = $event as 'start' | 'end'" /></div>
        <SCheckbox v-model="disabled" label="Dropdown disabled" />
        <SDropdown :items="items" :align="align" :disabled="disabled" label="Workspace actions" @select="select" />
      </div>
      <p role="status" class="mt-5 text-sm text-content-muted">{{ result }}</p>
    </SCard>
    <SGrid :columns="3" class="mt-6">
      <SCard>
        <template #header><h4 class="text-sm font-semibold">A quiet trigger</h4></template>
        <p class="mb-5 text-sm leading-relaxed text-content-muted">Use existing button sizes and treatments.</p>
        <SDropdown :items="items.slice(0, 3)" variant="ghost" size="sm" label="More options" align="start" @select="select" />
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Custom item content</h4></template>
        <SDropdown :items="[{id: 'export', label: 'Export data', icon: Download}, {id: 'manage', label: 'Manage access', icon: Settings}]" label="Project tools" variant="soft" align="start" @select="select">
          <template #item="{ item }"><span class="flex flex-wrap items-center justify-between gap-2">{{ item.label }}<SBadge v-if="item.id === 'export'" size="sm">CSV</SBadge></span></template>
        </SDropdown>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">No available actions</h4></template>
        <SDropdown :items="[{id: 'locked', label: 'Locked action', disabled: true}]" label="Restricted tools" align="start" />
      </SCard>
    </SGrid>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SDropdown
  label="Workspace actions"
  :items="[
    { id: 'edit', label: 'Edit details', icon: Pencil },
    { id: 'browse', label: 'Browse projects', href: '/projects' },
    { id: 'delete', label: 'Delete', danger: true, separatorBefore: true }
  ]"
  @select="handleAction"
/&gt;</code></pre>
  </section>
</template>
