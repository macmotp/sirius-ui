<script setup lang="ts">
import { SWebsiteSection } from '@sirius-ui/website'
import StudioEnquiryForm from './StudioEnquiryForm.vue'
withDefaults(defineProps<{ headingLevel?: 2 | 3 | 4; compact?: boolean }>(), { headingLevel: 2, compact: false })
</script>

<template>
  <SWebsiteSection title="A conversation starts here." :heading-level="headingLevel" :class="compact ? 'pt-0 lg:pt-0' : undefined">
    <div class="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
      <div><p class="mt-0 mb-8 max-w-sm text-base leading-8 text-content-muted">We work with people who care about what they’re putting into the world. If that sounds like you, we’d love to talk.</p><dl class="m-0 space-y-7"><div><dt class="text-xs text-content-subtle">Say hello</dt><dd class="mt-2 ms-0 text-lg font-medium">studio@acme.example</dd></div><div><dt class="text-xs text-content-subtle">Find us</dt><dd class="mt-2 ms-0 text-sm leading-6">Singapore<br /><span class="text-content-muted">Working everywhere, together.</span></dd></div></dl><p class="mt-12 flex items-center gap-2 text-xs text-content-muted"><span aria-hidden="true" class="size-1.5 rounded-full bg-success"></span>Open to new conversations.</p></div>
      <StudioEnquiryForm />
    </div>
  </SWebsiteSection>
</template>
