<script setup lang="ts">
import { computed } from 'vue'
import { SPeopleList } from '@sirius-ui/dashboard'
import type { SPeopleListItem } from '@sirius-ui/dashboard'
import type { demoUser } from '../data/demo'

const props = defineProps<{ account: typeof demoUser }>()
const people = computed<SPeopleListItem[]>(() => [
  { id: 'owner', name: props.account.name, email: props.account.email, role: props.account.jobTitle, href: '#profile', presence: { kind: 'online' } },
  {
    id: 'support', name: 'Jamie Lim', email: 'jamie@acme.example', role: 'Customer support specialist',
    presence: { kind: 'last-seen', label: '6 Nov, 3:20 pm', datetime: '2026-11-06T15:20:00+08:00' },
  },
  { id: 'inventory', name: 'Sam Chen', email: 'sam@acme.example', role: 'Inventory coordinator', presence: { kind: 'online' } },
  {
    id: 'fulfillment', name: 'Taylor Brooks', email: 'taylor@acme.example', role: 'Fulfillment coordinator',
    presence: { kind: 'last-seen', label: '5 Nov, 10:45 am', datetime: '2026-11-05T10:45:00+08:00' },
  },
])
</script>

<template>
  <SPeopleList id="lists" :people="people" label="Acme teammates" class="scroll-mt-24" />
</template>
