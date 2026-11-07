<script setup lang="ts">
import { nextTick } from 'vue'
import { SPopover } from '@sirius-ui/vue'
import { Check, Ellipsis, FileText } from '../../../../shared/icons'
import type { Order } from '../../data/orders'
const props = defineProps<{ order: Order; disabled: boolean }>()
const emit = defineEmits<{ view: [order: Order]; fulfill: [ids: number[]] }>()
async function choose(action: 'view' | 'fulfill', close: () => void) {
  close()
  await nextTick()
  if (action === 'view') emit('view', props.order)
  else emit('fulfill', [props.order.id])
}
</script>

<template>
  <SPopover :title="`Order #${order.id}`" :disabled="disabled" align="end">
    <template #trigger="{ trigger }"><button v-bind="trigger" type="button" :aria-label="`Actions for order #${order.id}`" class="acme-icon-button size-8"><Ellipsis aria-hidden="true" class="size-4" /></button></template>
    <template #default="{ close }"><div class="space-y-1"><button type="button" class="acme-menu-item" @click="choose('view', close)"><FileText aria-hidden="true" class="size-4" />View order</button><button v-if="order.status === 'processing'" type="button" class="acme-menu-item" @click="choose('fulfill', close)"><Check aria-hidden="true" class="size-4" />Mark as fulfilled</button></div></template>
  </SPopover>
</template>
