<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Calendar, Camera, Cloud, Folder, Heart, Star } from '@lucide/vue'
import { SBadge, SButton, SCard, SCheckbox, SCombobox, SField, SForm, SGrid, SInput, STagsInput } from '@sirius-ui/vue'

const tags = ref(['Design', 'Vue'])
const selected = ref('star')
const disabled = ref(false)
const valid = ref(false)
const invalid = ref(false)
const range = ref('35')
const values = ref('No form submitted yet.')
const icons = [
  { value: 'star', label: 'Star', icon: Star, detail: 'Favorites and highlights', keywords: ['favorite', 'rating'] },
  { value: 'heart', label: 'Heart', icon: Heart, detail: 'Likes and saved items' },
  { value: 'bell', label: 'Bell', icon: Bell, detail: 'Notifications and updates' },
  { value: 'calendar', label: 'Calendar', icon: Calendar, detail: 'Events and schedules' },
  { value: 'camera', label: 'Camera', icon: Camera, detail: 'Photos and media' },
  { value: 'folder', label: 'Folder', icon: Folder, detail: 'Files and collections' },
  { value: 'cloud', label: 'Cloud (unavailable)', icon: Cloud, detail: 'An example of a disabled option', disabled: true },
]
function submit(event: SubmitEvent) {
  const data = new FormData(event.target as HTMLFormElement)
  values.value = `Tags: ${data.getAll('tags[]').join(', ') || '(none)'} · Icon: ${data.get('icon') || '(none)'}. No data was sent.`
}
</script>

<template>
  <section id="search-inputs" class="border-t border-line py-10" aria-labelledby="search-inputs-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="search-inputs-title" class="text-xl font-semibold tracking-tight">Tags, search, and selection</h3><SBadge>STagsInput · SCombobox</SBadge></div>
    <p class="mb-6 max-w-2xl text-sm leading-relaxed text-content-muted">Build a set of tags or find an option by typing. Both controls share input styling and work with labels, validation, and native forms.</p>
    <div class="mb-5 flex flex-wrap gap-5"><SCheckbox v-model="disabled" label="Search controls disabled" /><SCheckbox v-model="valid" label="Search controls valid" /><SCheckbox v-model="invalid" label="Search controls invalid" /></div>
    <SCard>
      <SForm :columns="2" aria-label="Tags and icon demo" @submit.prevent="submit">
        <SField v-slot="{ control }" id="demo-tags" label="Workspace tags" description="Enter or comma adds a tag. You can also paste a comma-separated list.">
          <STagsInput v-bind="control" v-model="tags" name="tags[]" :disabled="disabled" :valid="valid" :invalid="invalid" />
        </SField>
        <SField v-slot="{ control }" id="demo-combobox" label="Workspace icon" description="Type to filter. Use the arrows and Enter to select an icon.">
          <SCombobox v-bind="control" v-model="selected" :options="icons" name="icon" clearable :disabled="disabled" :valid="valid" :invalid="invalid">
            <template #leading="{ option }"><component :is="option.icon" v-if="option" /></template>
            <template #option="{ option }"><span class="flex items-center gap-3"><component :is="option.icon" aria-hidden="true" class="size-5 shrink-0" /><span class="min-w-0"><span class="block">{{ option.label }}</span><span class="block text-xs opacity-75">{{ option.detail }}</span></span></span></template>
          </SCombobox>
        </SField>
        <template #actions><SButton type="submit">Inspect form values</SButton><SButton variant="outline" @click="tags = ['Design', 'Vue']; selected = 'star'; values = 'Demo reset.'">Reset search demo</SButton><p role="status" class="w-full break-words text-xs text-content-muted">{{ values }}</p></template>
      </SForm>
    </SCard>
    <SGrid :columns="2" class="mt-6">
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Limits and readonly tags</h4></template>
        <SField v-slot="{ control }" label="Up to three tags" description="Tags are trimmed; duplicates are ignored regardless of case."><STagsInput v-bind="control" :max-tags="3" /></SField>
        <SField v-slot="{ control }" class="mt-5" label="Readonly tags"><STagsInput v-bind="control" :model-value="['Design system', 'Accessible']" readonly /></SField>
      </SCard>
      <SCard>
        <template #header><h4 class="text-sm font-semibold">Plain options and empty results</h4></template>
        <SField v-slot="{ control }" label="Team" description="Try a search that does not match any team."><SCombobox v-bind="control" :options="[{value: 'design', label: 'Design'}, {value: 'engineering', label: 'Engineering'}, {value: 'operations', label: 'Operations'}]" clearable /></SField>
        <SField v-slot="{ control }" class="mt-5" label="Readonly selection"><SCombobox v-bind="control" model-value="design" :options="[{value: 'design', label: 'Design'}]" readonly /></SField>
      </SCard>
    </SGrid>
    <SCard class="mt-6">
      <template #header><h4 class="text-sm font-semibold">A lighter range input</h4></template>
      <SField v-slot="{ control }" label="Progress" :description="`${range}% · White thumb, accent fill, and a neutral remaining track.`"><SInput v-bind="control" v-model="range" type="range" min="0" max="100" step="5" /></SField>
      <SGrid :columns="3" class="mt-6"><SField v-for="size in (['sm', 'md', 'lg'] as const)" :key="size" v-slot="{ control }" :label="`${size.toUpperCase()} range`"><SInput v-bind="control" v-model="range" type="range" :size="size" /></SField></SGrid>
    </SCard>
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;STagsInput v-model="tags" name="tags[]" /&gt;
&lt;SCombobox v-model="icon" :options="icons" clearable&gt;
  &lt;template #option="{ option }"&gt;
    &lt;component :is="option.icon" aria-hidden="true" /&gt;
    {{ '{' + '{ option.label }' + '}' }}
  &lt;/template&gt;
&lt;/SCombobox&gt;</code></pre>
  </section>
</template>
