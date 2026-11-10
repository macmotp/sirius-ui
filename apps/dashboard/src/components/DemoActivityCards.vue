<script setup lang="ts">
import { shallowRef } from 'vue'
import { STimeline } from '@sirius-ui/dashboard'
import type { STimelineItem } from '@sirius-ui/dashboard'
import { SAvatar, SBadge, SButton, SCard, SField, SForm, SGrid, SIcon, STextarea } from '@sirius-ui/vue'
import type { SBadgeColor } from '@sirius-ui/vue'
import type { demoUser } from '../data/demo'

const props = defineProps<{ account: typeof demoUser }>()

const orderEvents: (STimelineItem & { status: string; color: SBadgeColor; icon: string })[] = [
  { id: 'placed', title: 'Order placed', detail: 'Sam Chen checked out online.', status: 'Placed', color: 'primary', icon: 'appPackage', time: { label: '6:00 pm', datetime: '2026-11-06T18:00:00+08:00' } },
  { id: 'paid', title: 'Payment confirmed', detail: 'The payment was received in full.', status: 'Paid', color: 'success', icon: 'success', time: { label: '6:02 pm', datetime: '2026-11-06T18:02:00+08:00' } },
  { id: 'packing', title: 'Packing started', detail: 'Sam Chen’s items were picked from stock.', status: 'Packing', color: 'warning', icon: 'appPackage', time: { label: '6:18 pm', datetime: '2026-11-06T18:18:00+08:00' } },
  { id: 'ready', title: 'Order #1048 is ready to dispatch', detail: 'The parcel is packed and the shipping label is ready.', status: 'Ready', color: 'success', icon: 'check', time: { label: '6:35 pm', datetime: '2026-11-06T18:35:00+08:00' } },
]

type Feedback = STimelineItem & (
  | { kind: 'comment'; author: string; detail: string }
  | { kind: 'assignment'; detail: string }
  | { kind: 'tags'; tags: readonly string[] }
)
const feedback = shallowRef<readonly Feedback[]>([
  { id: 'feedback-1', kind: 'comment', author: 'Jamie Lim', title: 'Jamie Lim left feedback', detail: 'The delivery estimate would be easier to find beside the shipping options.', time: { label: '6 Nov, 11:15 am', datetime: '2026-11-06T11:15:00+08:00' } },
  { id: 'feedback-2', kind: 'assignment', title: 'Alex Morgan assigned a follow-up', detail: 'Taylor Brooks will review the checkout copy.', time: { label: '6 Nov, 11:40 am', datetime: '2026-11-06T11:40:00+08:00' } },
  { id: 'feedback-3', kind: 'tags', title: 'Taylor Brooks added tags', tags: ['Checkout', 'Shipping'], time: { label: '6 Nov, 12:05 pm', datetime: '2026-11-06T12:05:00+08:00' } },
])
const draft = shallowRef('')
const announcement = shallowRef('')
const formatTime = new Intl.DateTimeFormat('en-SG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Singapore' })

function addComment() {
  const detail = draft.value.trim()
  if (!detail || detail.length > 500) return

  const now = new Date()
  feedback.value = [...feedback.value, {
    id: `feedback-${feedback.value.length + 1}`,
    kind: 'comment',
    author: props.account.name,
    title: `${props.account.name} left feedback`,
    detail,
    time: { label: formatTime.format(now), datetime: now.toISOString() },
  }]
  draft.value = ''
  announcement.value = `Comment added. ${feedback.value.length} activity entries.`
}
</script>

<template>
  <section id="activity" aria-labelledby="activity-card-examples" class="scroll-mt-24">
    <h2 id="activity-card-examples" class="mb-5 text-lg font-semibold">Activity</h2>
    <SGrid :columns="2">
      <SCard>
        <template #header>
          <h3 class="m-0 font-semibold">Order status history</h3>
          <p class="mt-1 mb-0 text-sm text-content-muted">Order #1048 · 6 Nov 2026</p>
        </template>
        <STimeline :items="orderEvents" label="Order #1048 status history">
          <template #marker="{ item }"><SIcon :name="item.icon" class="size-4" /></template>
          <template #detail="{ item }">
            <p class="m-0">{{ item.detail }}</p>
            <SBadge :color="item.color" size="sm" class="mt-2">{{ item.status }}</SBadge>
          </template>
        </STimeline>
      </SCard>

      <SCard>
        <template #header>
          <h3 class="m-0 font-semibold">Team feedback</h3>
          <p class="mt-1 mb-0 text-sm text-content-muted">Checkout and delivery notes</p>
        </template>
        <STimeline :items="feedback" label="Team feedback timeline">
          <template #marker="{ item }">
            <SAvatar v-if="item.kind === 'comment'" :name="item.author" size="sm" alt="" />
            <SIcon v-else :name="item.kind === 'assignment' ? 'appUserPlus' : 'appPlus'" class="size-4" />
          </template>
          <template #detail="{ item }">
            <p v-if="item.kind === 'comment'" class="m-0 rounded-xl bg-surface-muted px-3 py-2 leading-relaxed whitespace-pre-wrap">{{ item.detail }}</p>
            <p v-else-if="item.kind === 'assignment'" class="m-0">{{ item.detail }}</p>
            <div v-else class="flex flex-wrap gap-1.5">
              <SBadge v-for="tag in item.tags" :key="tag" size="sm" variant="outline">{{ tag }}</SBadge>
            </div>
          </template>
        </STimeline>
        <template #footer>
          <SForm class="gap-3 border-t border-line pt-4" aria-label="Add team feedback" @submit.prevent="addComment">
            <SField v-slot="{ control }" label="Add a comment">
              <STextarea v-bind="control" v-model="draft" name="comment" :rows="2" maxlength="500" placeholder="Share a note with your team…" />
            </SField>
            <template #actions><SButton type="submit" size="sm" :disabled="!draft.trim()">Post comment</SButton></template>
          </SForm>
          <p role="status" class="sr-only">{{ announcement }}</p>
        </template>
      </SCard>
    </SGrid>
  </section>
</template>
