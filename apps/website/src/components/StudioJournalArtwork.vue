<script setup lang="ts">
import type { StudioArticle } from '../content'
defineProps<{ article: StudioArticle }>()
</script>

<template>
  <div role="img" :aria-label="`${article.artWord} — an abstract editorial cover`" class="journal-art" :data-category="article.category">
    <div aria-hidden="true" class="journal-art-content"><span class="journal-art-label">ACME JOURNAL / {{ article.category.toUpperCase() }}</span><div class="journal-art-shape"></div><strong>{{ article.artWord }}</strong><span class="journal-art-footer">A FEW THOUGHTS FROM THE STUDIO.</span></div>
  </div>
</template>

<style scoped>
.journal-art { position: relative; width: 100%; height: 100%; overflow: hidden; container-type: inline-size; background: var(--sirius-primary-soft); color: var(--sirius-primary-content); }
.journal-art[data-category="Perspective"] { background: var(--sirius-surface-muted); color: var(--sirius-content); }
.journal-art[data-category="Notes"] { background: var(--sirius-warning-soft); color: var(--sirius-warning-content); }
.journal-art-content { position: absolute; inset: 0; }
.journal-art-label, .journal-art-footer { position: absolute; left: 8%; font-size: 1.5cqw; letter-spacing: .12em; }
.journal-art-label { top: 10%; }
.journal-art-footer { bottom: 10%; }
.journal-art strong { position: absolute; bottom: 23%; left: 8%; z-index: 1; font-size: 11cqw; line-height: 1; font-weight: 500; letter-spacing: -.07em; }
.journal-art-shape { position: absolute; top: 11%; right: -5%; width: 62%; aspect-ratio: 1; border: 1px solid currentColor; border-radius: 50%; opacity: .3; box-shadow: 0 0 0 3cqw var(--sirius-primary-soft); }
.journal-art[data-category="Perspective"] .journal-art-shape { border-radius: 0; transform: rotate(24deg); width: 45%; right: 6%; background: currentColor; opacity: .08; box-shadow: none; }
.journal-art[data-category="Notes"] .journal-art-shape { border-radius: 40% 60% 60% 40%; background: currentColor; opacity: .1; box-shadow: none; }
</style>
