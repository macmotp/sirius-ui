<script setup lang="ts">
import { SAvatar, SCard } from '@sirius-ui/vue'
import type { SUserCardProps } from './SUserCard.types'

withDefaults(defineProps<SUserCardProps>(), { layout: 'inline' })
defineSlots<{ badge?(): unknown; actions?(): unknown }>()
</script>

<template>
  <SCard :class="{ 'grid grid-rows-[1fr_auto]': layout === 'stacked' }">
    <div
      class="flex min-w-0 gap-4"
      :class="layout === 'stacked' ? 'flex-col items-center gap-5 text-center' : 'items-start'"
    >
      <SAvatar
        :name="name"
        :src="avatarSrc"
        :size="layout === 'stacked' ? 'xl' : 'lg'"
        :class="layout === 'stacked' ? 'size-24! text-2xl!' : undefined"
        alt=""
      />
      <div class="min-w-0 space-y-1">
        <p class="m-0 font-semibold text-content wrap-anywhere">{{ name }}</p>
        <p v-if="role" class="m-0 text-sm text-content-muted wrap-anywhere">{{ role }}</p>
        <p v-if="detail" class="m-0 text-xs leading-relaxed text-content-muted wrap-anywhere">{{ detail }}</p>
        <div v-if="$slots.badge" :class="layout === 'stacked' ? 'pt-2' : 'pt-1'"><slot name="badge" /></div>
      </div>
    </div>
    <template v-if="$slots.actions" #footer>
      <div :class="layout === 'stacked'
        ? '-mx-6 -mb-6 flex divide-x divide-line border-t border-line [&>*]:min-w-0 [&>*]:flex-1'
        : 'flex flex-wrap gap-2'"
      >
        <slot name="actions" />
      </div>
    </template>
  </SCard>
</template>
