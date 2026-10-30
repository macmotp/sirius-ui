<script setup lang="ts">
import { ref } from 'vue'
import { SAccordion, SBadge, SCheckbox } from '@sirius-ui/vue'
const open = ref(['theme'])
const multiple = ref(false)
const items = [
  { value: 'theme', label: 'Does it follow my theme?', content: 'Yes. The background, inset ring, text, and focus styles use the shared theme tokens.' },
  { value: 'keyboard', label: 'How do I navigate with a keyboard?', content: 'Tab between headers, press Enter or Space to expand, and use Up, Down, Home, or End to move between enabled headers.' },
  { value: 'disabled', label: 'An unavailable section', disabled: true },
  { value: 'custom', label: 'Can I add my own content, including longer titles and interactive controls?', content: 'Use the default scoped slot for your own forms, links, or other components.' },
]
</script>
<template>
  <section id="accordions" class="border-t border-line py-10" aria-labelledby="accordions-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="accordions-title" class="text-xl font-semibold">Details when you need them</h3><SBadge>SAccordion</SBadge></div>
    <SCheckbox v-model="multiple" label="Allow multiple open sections" class="mb-6" />
    <SAccordion :heading-level="4" v-model="open" :items="items" :multiple="multiple" />
    <pre class="mt-5 overflow-auto rounded-2xl bg-surface-muted p-5 text-xs leading-relaxed text-content-muted"><code>&lt;SAccordion :heading-level="4" v-model="openSections" :items="items" :multiple="{{ multiple }}" /&gt;</code></pre>
  </section>
</template>
