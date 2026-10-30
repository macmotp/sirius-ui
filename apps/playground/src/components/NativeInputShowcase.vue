<script setup lang="ts">
import { computed, reactive } from 'vue'
import { SField, SForm, SInput } from '@sirius-ui/vue'

const values = reactive({
  date: '2026-10-28', time: '09:30', datetime: '2026-10-28T09:30',
  month: '2026-10', week: '2026-W44', quantity: '1', amount: '1250.50', color: '#2dd4bf', range: '50',
})
const formattedAmount = computed(() => values.amount !== '' && Number.isFinite(Number(values.amount))
  ? new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(Number(values.amount))
  : 'Enter an amount')
const example = `<SInput v-model="date" type="date" />
<SInput v-model="time" type="time" step="60" />
<SInput v-model="quantity" type="number" min="0" max="100" step="1" />
<SInput v-model="amount" type="number" inputmode="decimal" min="0" step="0.01" />
<SInput v-model="color" type="color" />`
</script>

<template>
  <div id="native-inputs" class="relative mt-5 overflow-hidden rounded bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line">
    <div class="p-5 sm:p-7">
      <h4 class="text-sm font-semibold">Browser-native pickers and numbers</h4>
      <p class="mt-2 max-w-2xl text-xs leading-relaxed text-content-muted">Use your browser's date, time, color, and slider controls. Native controls may look different or fall back to text on other browsers. The values shown below are strings; local date and time values do not contain a timezone.</p>
      <SForm :columns="2" class="mt-6" aria-label="Native input examples" @submit.prevent>
        <SField v-slot="{ control }" label="Date" :description="`Value: ${values.date || '(empty)'}`"><SInput v-bind="control" v-model="values.date" type="date" name="date" /></SField>
        <SField v-slot="{ control }" label="Time" :description="`Value: ${values.time || '(empty)'}`"><SInput v-bind="control" v-model="values.time" type="time" name="time" step="60" /></SField>
        <SField v-slot="{ control }" label="Local date and time" :description="`Value: ${values.datetime || '(empty)'}`"><SInput v-bind="control" v-model="values.datetime" type="datetime-local" name="datetime" /></SField>
        <SField v-slot="{ control }" label="Month" :description="`Value: ${values.month || '(empty)'}`"><SInput v-bind="control" v-model="values.month" type="month" name="month" /></SField>
        <SField v-slot="{ control }" label="Week" :description="`Value: ${values.week || '(empty)'}`"><SInput v-bind="control" v-model="values.week" type="week" name="week" /></SField>
        <SField v-slot="{ control }" label="Quantity" :description="`Value: ${values.quantity || '(empty)'} · 0–100, step 1`"><SInput v-bind="control" v-model="values.quantity" type="number" name="quantity" min="0" max="100" step="1" /></SField>
        <SField v-slot="{ control }" label="Amount (SGD)" :description="`Preview: ${formattedAmount}`"><SInput v-bind="control" v-model="values.amount" type="number" name="amount" inputmode="decimal" min="0" step="0.01" /></SField>
        <SField v-slot="{ control }" label="Color" :description="`Value: ${values.color}`"><SInput v-bind="control" v-model="values.color" type="color" name="color" /></SField>
        <SField v-slot="{ control }" label="Range" :description="`Value: ${values.range} · 0–100, step 5`"><SInput v-bind="control" v-model="values.range" type="range" name="range" min="0" max="100" step="5" /></SField>
      </SForm>
      <p class="mt-5 text-xs leading-relaxed text-content-muted">Currency uses a decimal number input with a separate formatted preview. Formatting while typing, currency selection, and amount validation belong to your application.</p>
    </div>
    <pre class="overflow-x-auto border-t border-line bg-canvas p-5 font-mono text-xs leading-relaxed text-content-muted sm:p-7"><code>{{ example }}</code></pre>
  </div>
</template>
