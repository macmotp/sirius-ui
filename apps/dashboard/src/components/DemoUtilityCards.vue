<script setup lang="ts">
import { nextTick, shallowRef } from 'vue'
import { SUtilityCard } from '@sirius-ui/dashboard'
import { SAvatar, SBadge, SDialog, SPopover } from '@sirius-ui/vue'
import { Ellipsis } from '../../../shared/icons'
import { orderDate, orderMoney } from '../data/orders'

const statusColors = { Paid: 'success', Due: 'warning', Overdue: 'danger' } as const
const clients = [
  { name: 'Northstar Studio', contact: 'Priya Shah', email: 'priya@acme.example', invoice: 'INV-1041', date: '2026-11-04', amount: 248000, status: 'Paid' },
  { name: 'Papertrail Supply', contact: 'Drew Wong', email: 'drew@acme.example', invoice: 'INV-1038', date: '2026-11-01', amount: 92000, status: 'Due' },
  { name: 'Harbor Goods', contact: 'Morgan Ellis', email: 'morgan@acme.example', invoice: 'INV-1019', date: '2026-10-21', amount: 156000, status: 'Overdue' },
] as const
type Client = typeof clients[number]
const summaries = clients.map(client => ({
  client,
  rows: [
    { id: 'date', label: 'Last invoice', value: orderDate(client.date) },
    { id: 'amount', label: 'Amount', value: orderMoney(client.amount) },
  ],
}))
const selected = shallowRef<{ client: Client; kind: 'client' | 'invoice' }>()
const open = shallowRef(false)

async function view(client: Client, kind: 'client' | 'invoice', close: () => void) {
  close()
  await nextTick()
  selected.value = { client, kind }
  open.value = true
}
</script>

<template>
  <section aria-labelledby="utility-card-examples">
    <h2 id="utility-card-examples" class="mb-5 text-lg font-semibold">Utility cards</h2>
    <ul role="list" class="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="{ client, rows } in summaries" :key="client.invoice" class="min-w-0">
        <SUtilityCard :title="client.name" :rows="rows" class="h-full">
          <template #identity><SAvatar :name="client.name" shape="rounded" size="lg" alt="" /></template>
          <template #actions>
            <SPopover :title="`${client.name} options`" align="end">
              <template #trigger="{ trigger }">
                <button v-bind="trigger" type="button" class="acme-icon-button" :aria-label="`Options for ${client.name}`">
                  <Ellipsis aria-hidden="true" class="size-5" />
                </button>
              </template>
              <template #default="{ close }">
                <div class="space-y-1">
                  <button type="button" class="acme-menu-item" @click="view(client, 'client', close)">View client</button>
                  <button type="button" class="acme-menu-item" @click="view(client, 'invoice', close)">View invoice</button>
                </div>
              </template>
            </SPopover>
          </template>
          <template #value="{ row }">
            <time v-if="row.id === 'date'" :datetime="client.date">{{ row.value }}</time>
            <template v-else>
              <span class="tabular-nums">{{ row.value }}</span>
              <SBadge :color="statusColors[client.status]" size="sm">{{ client.status }}</SBadge>
            </template>
          </template>
        </SUtilityCard>
      </li>
    </ul>
    <SDialog v-model:open="open" :title="selected?.kind === 'invoice' ? selected.client.invoice : selected?.client.name" size="sm">
      <dl v-if="selected" class="mt-4 space-y-3 text-sm">
        <div v-if="selected.kind === 'client'">
          <dt class="text-content-muted">Billing contact</dt>
          <dd class="m-0 wrap-anywhere">
            <span class="block font-medium">{{ selected.client.contact }}</span>
            <span class="block text-content-muted">{{ selected.client.email }}</span>
          </dd>
        </div>
        <div v-else>
          <dt class="text-content-muted">Client</dt>
          <dd class="m-0 font-medium">{{ selected.client.name }}</dd>
        </div>
        <div>
          <dt class="text-content-muted">Invoice date</dt>
          <dd class="m-0"><time :datetime="selected.client.date">{{ orderDate(selected.client.date) }}</time></dd>
        </div>
        <div>
          <dt class="text-content-muted">Amount</dt>
          <dd class="m-0 flex flex-wrap items-center gap-2 font-medium">
            {{ orderMoney(selected.client.amount) }}
            <SBadge :color="statusColors[selected.client.status]" size="sm">{{ selected.client.status }}</SBadge>
          </dd>
        </div>
      </dl>
    </SDialog>
  </section>
</template>
