<script setup lang="ts">
import { ref } from 'vue'
import { SDrawer, SButton, SCard, SBadge } from '@sirius-ui/vue'
const menu = ref(false)
const details = ref(false)
</script>
<template>
  <section id="drawers" class="border-t border-line py-10" aria-labelledby="drawers-title">
    <div class="mb-6 flex flex-wrap items-baseline gap-3"><h3 id="drawers-title" class="text-xl font-semibold">A panel from either side</h3><SBadge>SDrawer</SBadge></div>
    <SCard><div class="flex flex-wrap gap-3"><SButton @click="menu = true">Open mobile menu</SButton><SButton variant="outline" @click="details = true">Open information panel</SButton></div></SCard>
    <SDrawer v-model:open="menu" side="left" size="sm" title="Navigation">
      <nav aria-label="Drawer navigation" class="flex flex-col gap-4"><a v-for="item in ['Overview', 'Buttons', 'Forms']" :key="item" :href="`#${item.toLowerCase()}`" class="text-primary-content underline" @click="menu = false">{{ item }}</a></nav>
    </SDrawer>
    <SDrawer v-model:open="details" title="Workspace information" description="A little more context, without leaving the page.">
      <dl class="space-y-4"><div><dt class="text-content-muted">Workspace</dt><dd class="m-0 font-medium">Sirius design studio</dd></div><div><dt class="text-content-muted">Status</dt><dd class="m-0">Ready for your next idea</dd></div></dl>
      <template #footer><SButton @click="details = false">Done</SButton></template>
    </SDrawer>
  </section>
</template>
