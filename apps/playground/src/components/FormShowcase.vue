<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { Check, Mail, Search, User } from '@lucide/vue'
import { SButton, SField, SForm, SInput, SSelect, STextarea } from '@sirius-ui/vue'
import MoreFormControls from './MoreFormControls.vue'
import type { SFormColumns, SInputSize, SInputType } from '@sirius-ui/vue'

const columns = ref<SFormColumns>(2)
const size = ref<SInputSize>('md')
const type = ref<SInputType>('text')
const value = ref('')
const disabled = ref(false)
const readonly = ref(false)
const invalid = ref(false)
const valid = ref(false)
const required = ref(false)
const sizes: SInputSize[] = ['sm', 'md', 'lg']
const types: SInputType[] = ['text', 'email', 'password', 'search', 'tel', 'url']
const demo = reactive({ name: '', email: '', title: '', department: '', note: '' })
const errors = reactive({ name: '', email: '', department: '' })
const status = ref('This form is a local demo. No data is sent.')
const example = computed(() => `<SForm :columns="${columns.value}" @submit.prevent="save">\n  <SField v-slot="{ control }" label="Your name"${required.value ? ' required' : ''}${invalid.value ? ' error="Check this value and try again."' : ''}>\n    <SInput v-bind="control" v-model="name" type="${type.value}" size="${size.value}"${disabled.value ? ' disabled' : ''}${readonly.value ? ' readonly' : ''}${valid.value ? ' valid' : ''} />\n  </SField>\n  <template #actions>\n    <SButton type="submit">Save</SButton>\n  </template>\n</SForm>`)

async function submit() {
  errors.name = demo.name.trim() ? '' : 'Enter your full name.'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demo.email) ? '' : 'Enter a valid email address.'
  errors.department = demo.department ? '' : 'Choose a department.'
  if (errors.name || errors.email || errors.department) {
    status.value = 'Please correct the highlighted fields.'
    await nextTick()
    document.getElementById(errors.name ? 'demo-full-name' : errors.email ? 'demo-email' : 'demo-department')?.focus()
    return
  }
  status.value = `Preview saved for ${demo.name.trim()}. No data was sent.`
}

function reset() {
  Object.assign(demo, { name: '', email: '', title: '', department: '', note: '' })
  Object.assign(errors, { name: '', email: '', department: '' })
  status.value = 'Form reset. No data was sent.'
}
</script>

<template>
  <section id="forms" class="border-t border-line py-10" aria-labelledby="forms-title">
    <div class="mb-3 flex flex-wrap items-center gap-3"><span class="font-mono text-xs text-content-subtle">06</span><h2 id="forms-title" class="text-xl font-semibold tracking-tight">Forms that fit your layout</h2><span class="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary-content">SForm · SField · SInput · SSelect · STextarea</span></div>
    <p class="mb-7 max-w-2xl text-sm leading-relaxed text-content-muted">Compose labels, hints, errors, and inputs with subtle inset rings. Choose up to four columns; fields stack on small screens. Submission and validation stay in your application.</p>

    <div class="relative overflow-hidden rounded bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-line">
      <div class="grid gap-8 p-5 sm:p-7 xl:grid-cols-2">
        <fieldset class="min-w-0">
          <legend class="mb-5 text-sm font-semibold">Build an input</legend>
          <div class="grid grid-cols-2 gap-4">
            <div class="min-w-0 text-xs text-content-muted"><label for="input-size">Input size</label><SSelect id="input-size" :model-value="size" :options="sizes.map(value => ({ value, label: value }))" class="mt-2" @update:model-value="size = $event as SInputSize" /></div>
            <div class="min-w-0 text-xs text-content-muted"><label for="input-type">Input type</label><SSelect id="input-type" :model-value="type" :options="types.map(value => ({ value, label: value }))" class="mt-2" @update:model-value="type = $event as SInputType" /></div>
          </div>
          <div class="mt-5 flex flex-wrap gap-4 text-sm">
            <label class="flex items-center gap-2"><input v-model="disabled" type="checkbox" class="accent-primary" />Input disabled</label>
            <label class="flex items-center gap-2"><input v-model="readonly" type="checkbox" class="accent-primary" />Readonly</label>
            <label class="flex items-center gap-2"><input v-model="valid" type="checkbox" class="accent-primary" />Valid</label>
            <label class="flex items-center gap-2"><input v-model="invalid" type="checkbox" class="accent-primary" />Invalid</label>
            <label class="flex items-center gap-2"><input v-model="required" type="checkbox" class="accent-primary" />Required</label>
          </div>
        </fieldset>
        <div class="min-w-0 self-center">
          <SField v-slot="{ control }" label="Your name" description="The label and hint are linked to this input." :error="invalid ? 'Check this value and try again.' : undefined" :required="required">
            <SInput v-bind="control" v-model="value" :type="type" :size="size" :disabled="disabled" :readonly="readonly" :valid="valid" placeholder="Type something…"><template #leading><User /></template></SInput>
          </SField>
          <p class="mt-4 break-words font-mono text-xs text-content-muted">{{ type === 'password' ? 'Value hidden for password input' : `v-model: ${value || '(empty)'}` }}</p>
        </div>
      </div>
      <pre class="overflow-x-auto border-t border-line bg-canvas p-5 font-mono text-xs leading-relaxed text-content-muted sm:p-7"><code>{{ example }}</code></pre>
    </div>

    <div class="mt-5 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h3 class="text-sm font-semibold">A responsive form, ready to try</h3><p class="mt-2 text-xs text-content-muted">Submit empty values to see validation. Reset clears the demo model and errors.</p></div>
        <div class="grid grid-cols-[auto_5rem] items-center gap-3 text-xs text-content-muted"><label for="form-columns">Form columns</label><SSelect id="form-columns" :model-value="String(columns)" :options="[1, 2, 3, 4].map(value => ({ value: String(value), label: String(value) }))" @update:model-value="columns = Number($event) as SFormColumns" /></div>
      </div>
      <SForm :columns="columns" novalidate aria-label="Profile demo" @submit.prevent="submit" @reset.prevent="reset">
        <SField id="demo-full-name" v-slot="{ control }" label="Full name" description="Use the name your team recognizes." :error="errors.name" required><SInput v-bind="control" v-model="demo.name" name="name" autocomplete="name" placeholder="Marco Gava"><template #leading><User /></template></SInput></SField>
        <SField id="demo-email" v-slot="{ control }" label="Email address" :error="errors.email" required><SInput v-bind="control" v-model="demo.email" name="email" type="email" autocomplete="email" placeholder="marco@example.com"><template #leading><Mail /></template></SInput></SField>
        <SField v-slot="{ control }" label="Job title" description="Optional"><SInput v-bind="control" v-model="demo.title" name="title" autocomplete="organization-title" placeholder="Product designer" /></SField>
        <SField v-slot="{ control }" label="Workspace ID" description="Readonly values can be focused and copied."><SInput v-bind="control" model-value="sirius-demo" name="workspace" readonly><template #trailing><Check /></template></SInput></SField>
        <SField id="demo-department" v-slot="{ control }" label="Department" :error="errors.department" required><SSelect v-bind="control" v-model="demo.department" name="department" placeholder="Choose a department" :options="[{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }, { value: 'archived', label: 'Archived team', disabled: true }]" /></SField>
        <SField v-slot="{ control }" label="A longer label for a field that spans every column in the form" description="full-width keeps this field across the entire grid at every breakpoint." full-width><STextarea v-bind="control" v-model="demo.note" name="note" :rows="3" placeholder="Add an optional note for your team" /></SField>
        <template #actions><SButton type="submit">Save profile</SButton><SButton type="reset" variant="outline">Reset form</SButton><p role="status" class="min-w-0 text-sm text-content-muted">{{ status }}</p></template>
      </SForm>
    </div>

    <div class="mt-5 grid gap-5 xl:grid-cols-2">
      <div class="min-w-0 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
        <h3 class="mb-6 text-sm font-semibold">Sizes and icon slots</h3>
        <div class="space-y-5"><SField v-for="item in sizes" :key="item" v-slot="{ control }" :label="`${item.toUpperCase()} search input`"><SInput v-bind="control" :size="item" type="search" placeholder="Search your workspace"><template #leading><Search /></template><template #trailing><Check /></template></SInput></SField></div>
        <p class="mt-4 text-xs leading-relaxed text-content-muted">Borderless controls use inset rings and a small shadow. The neutral background and focus accent follow your selections.</p>
      </div>
      <div class="min-w-0 rounded bg-surface p-5 ring-1 ring-inset ring-line sm:p-7">
        <h3 class="mb-6 text-sm font-semibold">Validation and native states</h3>
        <div class="space-y-5">
          <SField v-slot="{ control }" label="Validated input" description="This value has been checked. Invalid takes priority if both states are set."><SInput v-bind="control" model-value="Looks good" valid><template #trailing><Check class="text-success-content" /></template></SInput></SField>
          <SField v-slot="{ control }" label="Disabled input" description="Skipped by keyboard navigation and form submission."><SInput v-bind="control" model-value="Unavailable" disabled /></SField>
          <SField v-slot="{ control }" label="Readonly input" description="Remains focusable and is included in form submission."><SInput v-bind="control" model-value="You can copy this value" readonly /></SField>
          <SField v-slot="{ control }" label="Password" description="Uses the browser’s native password input."><SInput v-bind="control" type="password" autocomplete="new-password" placeholder="Enter a password" /></SField>
        </div>
      </div>
    </div>
    <MoreFormControls />
  </section>
</template>
