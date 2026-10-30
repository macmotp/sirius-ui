<script setup lang="ts">
import { shallowRef } from 'vue'
import { SButton, SPagination } from '@sirius-ui/vue'
import { largePaginationResponse } from '../demos/largePagination'

const response = shallowRef(largePaginationResponse(50))
const message = shallowRef('Showing the demo server response for page 50 of 100.')
function navigate(url: string) {
  const page = Number(new URL(url, 'https://example.test').searchParams.get('page'))
  response.value = largePaginationResponse(page)
  message.value = `Demo response for page ${page} of 100. Requested URL: ${url}`
}
</script>

<template>
  <div class="mt-10">
    <h4 class="text-lg font-semibold">A server link window across 100 pages</h4>
    <p class="my-3 max-w-2xl text-sm leading-relaxed text-content-muted">The demo server returns the first page, nearby pages, ellipses, and the last page. SPagination displays those links unchanged. An API that sends all 100 links will display all 100; configure the link window on your backend.</p>
    <div class="mb-4 flex flex-wrap gap-2">
      <SButton size="sm" variant="outline" @click="response = largePaginationResponse(1); message = 'Showing page 1 of 100.'">Show first page</SButton>
      <SButton size="sm" variant="outline" @click="response = largePaginationResponse(50); message = 'Showing page 50 of 100.'">Show middle page</SButton>
      <SButton size="sm" variant="outline" @click="response = largePaginationResponse(100); message = 'Showing page 100 of 100.'">Show last page</SButton>
    </div>
    <SPagination :pagination="response" mode="event" label="100-page pagination example" @navigate="navigate" />
    <p role="status" class="mt-3 break-words text-xs text-content-muted">{{ message }}</p>
  </div>
</template>
