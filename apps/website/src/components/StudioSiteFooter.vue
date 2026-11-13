<script setup lang="ts">
import { SWebsiteFooter } from '@sirius-ui/website'
import StudioBrand from './StudioBrand.vue'
import { footerGroups } from '../data'
withDefaults(defineProps<{ headingLevel?: 2 | 3 | 4 | 5 | 6 }>(), { headingLevel: 2 })
</script>

<template>
  <SWebsiteFooter :heading-level="headingLevel" :groups="footerGroups"><template #brand><StudioBrand /></template><p class="m-0">An independent design studio for thoughtful brands, digital experiences, and things worth putting into the world.</p><template #bottom><div class="flex flex-wrap justify-between gap-3"><span>© 2026 Acme Studio · A fictional SiriusUI website concept.</span><span>Made with care. Built with Sirius.</span></div></template></SWebsiteFooter>
</template>
