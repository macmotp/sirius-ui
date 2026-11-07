<script setup lang="ts">
import { SSelect } from '@sirius-ui/vue'
import { useId } from 'vue'
import { iconOptions, useDemoIconSelection } from './iconSets'
const icons = useDemoIconSelection()
const id = useId()
</script>

<template>
  <div v-if="icons" class="grid gap-2 text-sm text-content-muted">
    <label :for="id">Icon set</label>
    <SSelect :id="id" :model-value="icons.selection.value" :options="iconOptions" @update:model-value="icons.select" />
  </div>
</template>
