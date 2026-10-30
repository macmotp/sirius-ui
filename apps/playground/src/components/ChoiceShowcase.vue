<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { SButton, SCheckbox, SForm, SRadio, SSelect, SSwitch } from '@sirius-ui/vue'
import type { SChoiceSize } from '@sirius-ui/vue'

const size = ref<SChoiceSize>('md')
const disabled = ref(false)
const valid = ref(false)
const invalid = ref(false)
const required = ref(false)
const checked = ref(false)
const enabled = ref(true)
const radio = ref('standard')
const sizes: SChoiceSize[] = ['sm', 'md', 'lg']
const selected = ref<string[]>(['email'])
const channels = [{ value: 'email', label: 'Email updates' }, { value: 'sms', label: 'SMS updates' }, { value: 'push', label: 'Push notifications' }]
const allSelected = computed({ get: () => selected.value.length === channels.length, set: (value: boolean) => { selected.value = value ? channels.map((channel) => channel.value) : [] } })
const mixed = computed(() => selected.value.length > 0 && !allSelected.value)
const consent = ref(false)
const plan = ref('standard')
const notifications = ref(true)
const consentError = ref('')
const formStatus = ref('Try the controls, then submit to inspect native form values.')
const eventCount = ref(0)

function toggleChannel(value: string, checked: boolean) {
  selected.value = checked ? [...selected.value, value] : selected.value.filter((item) => item !== value)
}

async function submit(event: SubmitEvent) {
  consentError.value = consent.value ? '' : 'Confirm that you agree before continuing.'
  if (!consent.value) {
    formStatus.value = 'Please check the consent field.'
    await nextTick()
    document.getElementById('choice-consent')?.focus()
    return
  }
  const entries = [...new FormData(event.target as HTMLFormElement).entries()]
  formStatus.value = `Form values: ${entries.map(([key, value]) => `${key}=${String(value)}`).join(', ')}. No data was sent.`
}

function reset() {
  consent.value = false
  plan.value = 'standard'
  notifications.value = true
  consentError.value = ''
  formStatus.value = 'Demo reset. No data was sent.'
}
const example = `<SCheckbox v-model="accepted" label="Accept updates" />
<fieldset>
  <legend>Delivery</legend>
  <SRadio v-model="delivery" name="delivery" value="standard" label="Standard" />
  <SRadio v-model="delivery" name="delivery" value="express" label="Express" />
</fieldset>
<SSwitch v-model="enabled" label="Enable notifications" />`
</script>

<template>
  <section id="choices" class="border-t border-line py-10" aria-labelledby="choices-title">
    <div class="mb-3 flex flex-wrap items-center gap-3"><h3 id="choices-title" class="text-xl font-semibold tracking-tight">Choices, with native behavior</h3><span class="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-content">SCheckbox · SRadio · SSwitch</span></div>
    <p class="mb-7 max-w-2xl text-sm leading-relaxed text-content-muted">Choose independent options, select one item from a group, or toggle a setting. Native inputs keep keyboard navigation and form behavior familiar.</p>

    <div class="relative overflow-hidden rounded bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line">
      <div class="p-5 sm:p-7">
        <fieldset>
          <legend class="mb-4 text-sm font-semibold">Explore sizes and states</legend>
          <div class="flex flex-wrap items-center gap-5">
            <div class="grid grid-cols-[auto_6rem] items-center gap-3 text-xs text-content-muted"><label for="choice-size">Choice size</label><SSelect id="choice-size" :model-value="size" :options="sizes.map(value => ({ value, label: value }))" @update:model-value="size = $event as SChoiceSize" /></div>
            <SCheckbox v-model="disabled" label="Choices disabled" />
            <SCheckbox v-model="valid" label="Choices valid" />
            <SCheckbox v-model="invalid" label="Choices invalid" />
            <SCheckbox v-model="required" label="Choices required" />
          </div>
        </fieldset>
        <div class="mt-7 grid gap-7 xl:grid-cols-3">
          <div class="min-w-0"><h4 class="mb-4 text-sm font-semibold">Checkbox</h4><SCheckbox v-model="checked" label="Include a summary" description="An independent yes or no choice." :size="size" :disabled="disabled" :valid="valid" :required="required" :error="invalid ? 'Check this option.' : undefined" @change="eventCount++" /><p class="mt-4 font-mono text-xs text-content-muted">Checked: {{ checked }}</p></div>
          <fieldset class="min-w-0"><legend class="mb-4 text-sm font-semibold">Delivery method</legend><div class="space-y-4"><SRadio v-model="radio" name="showcase-delivery" value="standard" label="Standard delivery" :size="size" :disabled="disabled" :valid="valid" :invalid="invalid" :required="required" @change="eventCount++" /><SRadio v-model="radio" name="showcase-delivery" value="express" label="Express delivery" :size="size" :disabled="disabled" :valid="valid" :invalid="invalid" :required="required" @change="eventCount++" /></div><p class="mt-4 font-mono text-xs text-content-muted">Selected: {{ radio }}</p></fieldset>
          <div class="min-w-0"><h4 class="mb-4 text-sm font-semibold">Switch</h4><SSwitch v-model="enabled" label="Enable activity notifications" description="A setting that stays on or off." :size="size" :disabled="disabled" :valid="valid" :required="required" :error="invalid ? 'Check this setting.' : undefined" @change="eventCount++" /><p class="mt-4 font-mono text-xs text-content-muted">Enabled: {{ enabled }}</p></div>
        </div>
        <p role="status" class="mt-6 text-xs text-content-muted">{{ eventCount }} change events received. Disabled controls do not change their models.</p>
      </div>
      <pre class="overflow-x-auto border-t border-line bg-canvas p-5 font-mono text-xs leading-relaxed text-content-muted sm:p-7"><code>{{ example }}</code></pre>
    </div>

    <div class="mt-5 grid gap-5 xl:grid-cols-2">
      <div class="min-w-0 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
        <h4 class="mb-5 text-sm font-semibold">Select all and partial selection</h4>
        <fieldset><legend class="sr-only">Update channels</legend><SCheckbox v-model="allSelected" :indeterminate="mixed" label="Select all channels" description="Partially selected channels show the mixed state." /><div class="mt-5 space-y-4 border-t border-line pt-5"><SCheckbox v-for="channel in channels" :key="channel.value" :model-value="selected.includes(channel.value)" :label="channel.label" @update:model-value="toggleChannel(channel.value, $event)" /></div></fieldset>
        <p class="mt-5 break-words font-mono text-xs text-content-muted">Selected: {{ selected.join(', ') || '(none)' }}</p>
      </div>
      <div class="min-w-0 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
        <h4 class="mb-5 text-sm font-semibold">Sizes, long labels, and disabled states</h4>
        <div class="space-y-5"><div v-for="item in sizes" :key="item" class="flex flex-wrap items-start gap-5"><SCheckbox :size="item" :model-value="true" :label="`${item.toUpperCase()} checkbox`" /><SSwitch :size="item" :model-value="true" :label="`${item.toUpperCase()} switch`" /></div><SCheckbox label="This longer label wraps naturally while keeping its checkbox aligned at the start of the first line" /><SCheckbox label="Unavailable checkbox" disabled :model-value="true" /><SRadio name="disabled-choice" value="unavailable" model-value="unavailable" label="Unavailable radio" disabled /><SSwitch label="Unavailable switch" disabled :model-value="true" /></div>
      </div>
    </div>

    <div class="mt-5 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
      <h4 class="mb-5 text-sm font-semibold">A form you can submit and reset</h4>
      <SForm :columns="2" aria-label="Choice form demo" novalidate @submit.prevent="submit" @reset.prevent="reset">
        <SCheckbox id="choice-consent" v-model="consent" name="consent" value="yes" label="I agree to receive the requested updates" description="This required checkbox is validated by the demo." :error="consentError" required />
        <fieldset class="space-y-4"><legend class="mb-4 text-sm font-medium">Subscription</legend><SRadio v-model="plan" name="subscription" value="standard" label="Standard" /><SRadio v-model="plan" name="subscription" value="plus" label="Plus" /></fieldset>
        <SSwitch v-model="notifications" name="notifications" value="enabled" label="Send notifications" description="Switches are included in form data only when on." />
        <template #actions><SButton type="submit">Save preferences</SButton><SButton type="reset" variant="outline">Reset preferences</SButton><p role="status" class="min-w-0 text-sm text-content-muted">{{ formStatus }}</p></template>
      </SForm>
      <p class="mt-5 text-xs leading-relaxed text-content-muted">Use Space for checkboxes and switches. Tab into the radio group, then use arrow keys to change the selection. Focus outlines stay visible; switch motion respects reduced-motion preferences.</p>
    </div>
  </section>
</template>
