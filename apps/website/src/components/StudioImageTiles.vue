<script setup lang="ts">
import StudioArtwork from './StudioArtwork.vue'
import { projects, type StudioProject } from '../data'

type Tile = { id: string; kind: 'photo'; src: string; alt: string } | { id: string; kind: 'artwork'; project: StudioProject }

const columns: Tile[][] = [
  [{ id: 'fieldwork', kind: 'artwork', project: projects[0]! }],
  [
    { id: 'workspace', kind: 'photo', src: '/images/article-workspace.jpg', alt: 'A bright studio desk with a laptop and design book.' },
    { id: 'forma', kind: 'artwork', project: projects.find(project => project.id === 'forma')! },
  ],
  [
    { id: 'northline', kind: 'artwork', project: projects.find(project => project.id === 'northline')! },
    { id: 'notebook', kind: 'photo', src: '/images/article-notebook.jpg', alt: 'An open notebook and pencil ready for the next idea.' },
  ],
]
</script>

<template>
  <figure class="m-0 min-w-0">
    <div class="image-tiles grid grid-cols-3 items-start gap-3 sm:gap-5">
      <div v-for="(column, index) in columns" :key="index" class="image-tile-column grid min-w-0 gap-3 sm:gap-5">
        <div v-for="tile in column" :key="tile.id" class="aspect-[2/3] overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-inset ring-line">
          <img v-if="tile.kind === 'photo'" :src="tile.src" :alt="tile.alt" width="1400" height="933" loading="lazy" class="h-full w-full object-cover" />
          <StudioArtwork v-else :project="tile.project" />
        </div>
      </div>
    </div>
    <figcaption class="mt-5 text-xs leading-5 text-content-muted">Original Acme concept artwork. Photos by <a href="https://unsplash.com/photos/r3iAqHb7JWs" class="rounded underline underline-offset-4">Patrik Michalicka</a> and <a href="https://unsplash.com/photos/pUAM5hPaCRI" class="rounded underline underline-offset-4">JESHOOTS.COM / Unsplash</a>.</figcaption>
  </figure>
</template>

<style scoped>
.image-tiles { padding-block: .5rem; }
.image-tile-column:first-child { padding-top: 70%; }
.image-tile-column:last-child { padding-top: 35%; }
</style>
