<script setup lang="ts">
import { SWebsiteFooter, type SWebsiteNavItem } from '@sirius-ui/website'
import StudioSocialIcon from './StudioSocialIcon.vue'
import StudioSectionExample from './StudioSectionExample.vue'
import StudioSiteFooter from './StudioSiteFooter.vue'

const items: SWebsiteNavItem[] = [
  { id: 'about', label: 'The studio', href: '#about' },
  { id: 'projects', label: 'Our work', href: '#projects' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'journal', label: 'Journal', href: '#journal' },
  { id: 'faq', label: 'Questions & answers', href: '#faq' },
  { id: 'contact', label: 'Get in touch', href: '#contact' },
]
const socials: SWebsiteNavItem[] = [
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { id: 'x', label: 'X', href: 'https://x.com/' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/macmotp/sirius-ui' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
]
const year = new Date().getFullYear()
</script>

<template>
  <div class="space-y-12">
    <StudioSectionExample id="footer-example-columns-original" title="Studio footer with grouped navigation" description="The original site footer, with shared branding, grouped links, supporting copy, and copyright." label="SWebsiteFooter · columns"><StudioSiteFooter :heading-level="4" /></StudioSectionExample>
    <StudioSectionExample id="footer-example-centered" title="Centered footer with social links" description="A compact footer with wrapping navigation, app-owned social icons, and a copyright line." label="SWebsiteFooter · centered">
      <SWebsiteFooter variant="centered" :items="items" :socials="socials" navigation-label="Centered footer navigation" social-label="Social destinations"><template #socialIcon="{ item }"><StudioSocialIcon :name="String(item.id)" /></template><template #bottom><p class="m-0">© {{ year }} Acme Studio. All rights reserved.</p></template></SWebsiteFooter>
      <template #note><p class="mt-3 text-xs leading-5 text-content-muted">Acme is fictional. Social links open platform homepages; GitHub opens the SiriusUI repository.</p></template>
    </StudioSectionExample>
  </div>
</template>
