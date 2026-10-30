<script setup lang="ts">
import { ref } from 'vue'
import { Bell, ChartColumn, FileText, Settings } from '@lucide/vue'
import { SBadge, SButton, SCard, SCheckbox, SField, SInput, SSelect, STabs } from '@sirius-ui/vue'

const selected = ref('overview')
const orientation = ref<'horizontal' | 'vertical'>('horizontal')
const activation = ref<'automatic' | 'manual'>('automatic')
const variant = ref<'line' | 'pills'>('line')
const changes = ref(0)
const keepAlive = ref(true)
const items = [
  { value: 'overview', label: 'Overview', icon: ChartColumn },
  { value: 'activity', label: 'Activity', icon: Bell, count: 3 },
  { value: 'notes', label: 'Notes', icon: FileText },
  { value: 'settings', label: 'Settings', icon: Settings, disabled: true },
]
</script>

<template>
  <section id="tabs" class="border-t border-line py-10" aria-labelledby="tabs-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="tabs-title" class="text-xl font-semibold tracking-tight">Related views, one place</h3><SBadge>STabs</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Switch between related panels without leaving the page. Arrow keys skip disabled tabs; Home and End jump to the edges. Manual activation waits for Enter or Space.</p>
    <SCard>
      <template #header><h4 class="text-sm font-semibold">Explore tabs</h4></template>
      <div class="mb-6 grid gap-4 sm:grid-cols-3">
        <div><label for="tabs-variant" class="mb-2 block text-sm font-medium">Tab treatment</label><SSelect id="tabs-variant" :model-value="variant" :options="[{value:'line',label:'Line'}, {value:'pills',label:'Pills'}]" @update:model-value="variant = $event as typeof variant" /></div>
        <div><label for="tabs-orientation" class="mb-2 block text-sm font-medium">Tab orientation</label><SSelect id="tabs-orientation" :model-value="orientation" :options="[{value:'horizontal',label:'Horizontal'}, {value:'vertical',label:'Vertical'}]" @update:model-value="orientation = $event as typeof orientation" /></div>
        <div><label for="tabs-activation" class="mb-2 block text-sm font-medium">Tab activation</label><SSelect id="tabs-activation" :model-value="activation" :options="[{value:'automatic',label:'Automatic'}, {value:'manual',label:'Manual'}]" @update:model-value="activation = $event as typeof activation" /></div>
      </div>
      <STabs v-model="selected" :items="items" label="Workspace views" :orientation="orientation" :activation="activation" :variant="variant" @change="changes++">
        <template #tab="{ item }">{{ item.label }}<SBadge v-if="item.count" class="ms-2" size="sm">{{ item.count }}</SBadge></template>
        <template #panel="{ item }">
          <div v-if="item.value === 'overview'" class="space-y-3"><h4 class="text-lg font-semibold">A clear workspace overview</h4><p class="text-sm leading-relaxed text-content-muted">Keep related information together and give each panel a clear purpose.</p><SButton size="sm" variant="outline" @click="selected = 'activity'">View activity</SButton></div>
          <div v-else-if="item.value === 'activity'"><h4 class="mb-3 text-lg font-semibold">Recent activity</h4><ul class="space-y-3 text-sm text-content-muted"><li>A new workspace was created.</li><li>The design notes were updated.</li><li>A new teammate joined.</li></ul></div>
          <SField v-else-if="item.value === 'notes'" v-slot="{ control }" label="Temporary note" description="This uncontrolled field resets when its panel unmounts."><SInput v-bind="control" placeholder="Write a note…" /></SField>
        </template>
      </STabs>
      <p class="mt-6 text-xs text-content-muted">Selected: {{ selected }} · {{ changes }} change events · Settings is disabled.</p>
    </SCard>
    <SCard class="mt-6">
      <template #header><h4 class="text-sm font-semibold">Preserve panel state</h4></template>
      <SCheckbox v-model="keepAlive" label="Keep inactive panels mounted" class="mb-5" />
      <STabs :items="[{value:'draft',label:'Draft'}, {value:'preview',label:'Preview'}]" label="Draft panels" variant="pills" :keep-alive="keepAlive">
        <template #panel="{ item }"><SField v-if="item.value === 'draft'" v-slot="{ control }" label="Draft title" description="Type here, switch to Preview, then return to check persistence."><SInput v-bind="control" placeholder="Your draft title" /></SField><p v-else class="text-sm text-content-muted">The Draft panel stays mounted when the option is enabled.</p></template>
      </STabs>
    </SCard>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;STabs v-model="tab" :items="items" label="Workspace views"&gt;
  &lt;template #panel="{ item }"&gt;
    &lt;Overview v-if="item.value === 'overview'" /&gt;
    &lt;Activity v-else-if="item.value === 'activity'" /&gt;
  &lt;/template&gt;
&lt;/STabs&gt;</code></pre>
  </section>
</template>
