<script setup lang="ts">
import { reactive, shallowRef, useId } from 'vue'
import { SButton, SDialog, SField, SForm, SInput, STextarea } from '@sirius-ui/vue'
import { Plus } from '../../../../shared/icons'
import type { CalendarEventDraft } from '../../data/calendar'

const props = defineProps<{ selectedDate: string }>()
const emit = defineEmits<{ create: [event: CalendarEventDraft] }>()
const dialogId = useId()
const open = shallowRef(false)
const titleError = shallowRef('')
const draft = reactive({ title: '', date: '', time: '', detail: '' })

function start() {
  Object.assign(draft, { title: '', date: props.selectedDate, time: '', detail: '' })
  titleError.value = ''
  open.value = true
}

function save() {
  if (!open.value) return
  const title = draft.title.trim()
  if (!title) {
    titleError.value = 'Enter an event title.'
    return
  }
  emit('create', { title, date: draft.date, time: draft.time || undefined, detail: draft.detail.trim() })
  open.value = false
}
</script>

<template>
  <SButton size="sm" aria-haspopup="dialog" :aria-controls="dialogId" :aria-expanded="open" @click="start">
    <template #leading><Plus /></template>
    Add event
  </SButton>
  <SDialog :id="dialogId" v-model:open="open" title="Add event" description="Schedule an event in Singapore time." :close-on-backdrop="false">
    <SForm :columns="2" class="gap-4" @submit.prevent="save">
      <SField v-slot="{ control }" label="Event title" :error="titleError" required full-width>
        <SInput v-bind="control" v-model="draft.title" name="title" maxlength="100" autofocus @input="titleError = ''" />
      </SField>
      <SField v-slot="{ control }" label="Date" required>
        <SInput v-bind="control" v-model="draft.date" name="date" type="date" min="0001-01-01" max="9999-12-31" />
      </SField>
      <SField v-slot="{ control }" label="Time" description="Leave blank for an all-day event.">
        <SInput v-bind="control" v-model="draft.time" name="time" type="time" />
      </SField>
      <SField v-slot="{ control }" label="Notes (optional)" full-width>
        <STextarea v-bind="control" v-model="draft.detail" name="detail" maxlength="500" />
      </SField>
      <template #actions>
        <SButton class="ms-auto" variant="ghost" @click="open = false">Cancel</SButton>
        <SButton type="submit">Save event</SButton>
      </template>
    </SForm>
  </SDialog>
</template>
