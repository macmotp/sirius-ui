<script setup lang="ts">
import { SIcon } from '@sirius-ui/vue'
const activity = [38, 64, 52, 78, 66, 90, 74]
const tasks = [
  { title: 'Brand exploration', subtitle: 'Fieldwork', progress: 'Ready to review' },
  { title: 'Website direction', subtitle: 'Northline', progress: 'In progress' },
]
</script>

<template>
  <div role="img" aria-label="Acme mobile workspace concept showing project updates, weekly activity, and recent work." class="h-full bg-canvas text-content">
    <div aria-hidden="true" class="flex h-full flex-col px-4 pt-3 pb-4">
      <div class="flex justify-between px-1 text-[10px] font-semibold"><span>9:41</span><span>••• ▰</span></div>
      <div class="mt-5 flex items-center justify-between"><span class="text-lg font-semibold tracking-tight">acme<span class="text-primary-content">.</span></span><span class="grid size-7 place-items-center rounded-full bg-primary-soft text-[10px] font-medium text-primary-content">AM</span></div>
      <p class="mt-4 mb-1 text-[10px] text-content-muted">Your day, a little clearer.</p>
      <p class="m-0 text-xl leading-tight font-semibold tracking-tight">Good morning,<br />Alex.</p>
      <div class="mt-4 grid grid-cols-2 gap-2"><div class="rounded-xl bg-primary-soft p-2.5 text-primary-content"><SIcon name="check" class="size-4" /><p class="mt-2 mb-0 text-xl font-semibold">18</p><p class="m-0 text-[10px]">Tasks completed</p></div><div class="rounded-xl bg-surface p-2.5 ring-1 ring-inset ring-line"><SIcon name="file" class="size-4 text-content-muted" /><p class="mt-2 mb-0 text-xl font-semibold">4</p><p class="m-0 text-[10px] text-content-muted">Active projects</p></div></div>
      <div class="mt-3 rounded-xl bg-surface p-2.5 ring-1 ring-inset ring-line"><p class="m-0 flex justify-between text-[10px] font-medium"><span>A little progress, every day</span><span class="text-content-muted">This week</span></p><div class="mt-3 flex h-12 items-end justify-between gap-2"><span v-for="(height, index) in activity" :key="index" class="w-full rounded-t bg-primary/60" :style="{ height: `${height}%` }"></span></div><div class="mt-1 flex justify-between text-[8px] text-content-muted"><span v-for="(day, index) in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="index">{{ day }}</span></div></div>
      <p class="mt-4 mb-2 text-xs font-semibold">On your radar</p>
      <div v-for="task in tasks" :key="task.title" class="flex items-center gap-2 border-b border-line py-1.5"><span class="size-2 rounded-full bg-primary/60"></span><div class="min-w-0"><p class="m-0 text-[10px] font-medium">{{ task.title }}</p><p class="m-0 text-[9px] text-content-muted">{{ task.subtitle }}</p></div><span class="ms-auto text-[8px] text-content-muted">{{ task.progress }}</span></div>
      <div class="mx-auto mt-auto h-1 w-20 shrink-0 rounded-full bg-content/30"></div>
    </div>
  </div>
</template>
