<script setup lang="ts">
import { SAvatar, SIcon } from '@sirius-ui/vue'
import type { SPeopleListProps } from './SPeopleList.types'

withDefaults(defineProps<SPeopleListProps>(), {
  label: 'People',
  onlineLabel: 'Online',
  lastSeenLabel: 'Last seen',
  emptyText: 'No people to display.',
})
</script>

<template>
  <div class="min-w-0 rounded-2xl border border-line bg-surface text-content">
    <ul v-if="people.length" role="list" :aria-label="label" class="m-0 list-none divide-y divide-line p-0">
      <li
        v-for="person in people"
        :key="person.id"
        class="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-4 first:rounded-t-2xl last:rounded-b-2xl sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,auto)_auto] sm:gap-x-4 sm:px-6"
        :class="{ 'hover:bg-surface-hover': person.href }"
      >
        <SAvatar :name="person.name" :src="person.avatarSrc" size="lg" alt="" class="col-start-1 row-start-1" />
        <div class="col-start-2 row-start-1 min-w-0">
          <a
            v-if="person.href"
            :href="person.href"
            class="text-sm font-semibold text-content no-underline wrap-anywhere after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-focus"
          >{{ person.name }}</a>
          <p v-else class="m-0 text-sm font-semibold wrap-anywhere">{{ person.name }}</p>
          <p v-if="person.email" class="mt-1 mb-0 text-xs text-content-muted wrap-anywhere">
            <a :href="`mailto:${person.email}`" class="relative z-10 text-inherit no-underline hover:underline focus-visible:underline">{{ person.email }}</a>
          </p>
        </div>
        <div
          v-if="person.role || person.presence"
          class="col-start-2 row-start-2 min-w-0 text-xs text-content-muted wrap-anywhere sm:col-start-3 sm:row-start-1 sm:max-w-48 sm:text-end"
        >
          <p v-if="person.role" class="m-0 text-sm text-content">{{ person.role }}</p>
          <p v-if="person.presence?.kind === 'online'" class="mt-1 mb-0 inline-flex items-center gap-2">
            <span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-success"></span>{{ onlineLabel }}
          </p>
          <p v-else-if="person.presence?.kind === 'last-seen'" class="mt-1 mb-0">
            {{ lastSeenLabel }} <time :datetime="person.presence.datetime">{{ person.presence.label }}</time>
          </p>
        </div>
        <SIcon
          v-if="person.href"
          name="chevronRight"
          aria-hidden="true"
          class="col-start-3 row-start-1 size-4 text-content-subtle sm:col-start-4 rtl:rotate-180"
        />
      </li>
    </ul>
    <p v-else class="m-0 px-6 py-5 text-sm text-content-muted">{{ emptyText }}</p>
  </div>
</template>
