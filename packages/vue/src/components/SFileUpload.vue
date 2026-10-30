<script setup lang="ts">
import { nextTick, shallowRef, useAttrs, useId, useTemplateRef, watchEffect } from 'vue'
import { File as FileIcon, Upload, X } from '@lucide/vue'
import type { SFileUploadProps, SFileUploadRejection } from './SFileUpload.types'
import { fileKey, fileSize, selectFiles } from './fileSelection'
import { controlAriaInvalid, nativeControlAttrs } from './controlStyles'

const props = withDefaults(defineProps<SFileUploadProps>(), { multiple: false, disabled: false, required: false, invalid: false, browseLabel: 'Choose files', removeLabel: 'Remove' })
defineOptions({ inheritAttrs: false })
const files = defineModel<File[]>({ default: () => [] })
const emit = defineEmits<{ reject: [rejections: SFileUploadRejection[]] }>()
defineSlots<{ file?(props: { file: File; index: number }): unknown }>()
const attrs = useAttrs()
const id = useId()
const input = useTemplateRef<HTMLInputElement>('input')
const dragging = shallowRef(false)
const message = shallowRef('')
let dragDepth = 0
function zoneClasses() {
  const invalid = props.invalid || [true, 'true', 'grammar', 'spelling'].includes(attrs['aria-invalid'] as string | boolean)
  return [
    props.disabled ? 'cursor-not-allowed opacity-50' : !invalid && 'hover:border-primary',
    invalid ? 'border-control-invalid' : dragging.value ? 'border-primary' : 'border-line-strong',
    dragging.value ? 'bg-primary-soft' : 'bg-control',
  ]
}
function inputAttrs() {
  return { ...nativeControlAttrs(attrs), id: String(attrs.id ?? id),
    'aria-describedby': [attrs['aria-describedby'], `${id}-help`].filter(Boolean).join(' '),
    'aria-invalid': controlAriaInvalid(props.invalid, attrs['aria-invalid']) }
}
function syncInput() {
  if (!input.value) return
  // Keep native form submission and constraint validation aligned with dropped/removed files.
  if (typeof DataTransfer !== 'undefined') {
    const transfer = new DataTransfer()
    files.value.forEach(file => transfer.items.add(file))
    input.value.files = transfer.files
  }
  input.value.setCustomValidity?.(props.required && !files.value.length ? 'Please choose a file.' : '')
}
watchEffect(() => {
  // Reading the model here also observes external clears, including form reset handlers.
  void files.value
  void props.required
  syncInput()
}, { flush: 'post' })
watchEffect(() => { if (props.disabled) { dragging.value = false; dragDepth = 0 } })
function add(incoming: File[]) {
  if (props.disabled) return
  const result = selectFiles(files.value, incoming, props)
  files.value = result.files
  message.value = result.rejected.length ? `${result.rejected.length} file(s) not added. Check file type, size, count, or duplicates.` : `${result.files.length} file(s) selected.`
  if (result.rejected.length) emit('reject', result.rejected)
  void nextTick(syncInput)
}
function change(event: Event) { add(Array.from((event.target as HTMLInputElement).files ?? [])) }
function drag(event: DragEvent, enter = false) {
  if (!event.dataTransfer?.types.includes('Files')) return
  event.preventDefault()
  event.dataTransfer.dropEffect = props.disabled ? 'none' : 'copy'
  if (props.disabled) return
  if (enter) dragDepth++
  dragging.value = true
}
function leave() { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) dragging.value = false }
function drop(event: DragEvent) {
  dragging.value = false
  dragDepth = 0
  if (!event.dataTransfer?.types.includes('Files')) return
  event.preventDefault()
  if (!props.disabled) add(Array.from(event.dataTransfer.files))
}
async function remove(index: number) {
  if (props.disabled) return
  const remaining = files.value.filter((_, position) => position !== index)
  files.value = remaining
  message.value = `${remaining.length} file(s) selected.`
  await nextTick()
  input.value?.focus()
}
</script>

<template>
  <div :class="$attrs.class" :style="$attrs.style">
    <div class="relative rounded-2xl border border-dashed p-6 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus motion-reduce:transition-none" :class="zoneClasses()" @dragenter="drag($event, true)" @dragover="drag($event)" @dragleave="leave" @drop="drop">
      <Upload aria-hidden="true" class="mx-auto mb-3 size-6 text-content-muted" />
      <label :for="String($attrs.id ?? id)" class="block break-words text-sm font-medium text-content">{{ label }}</label>
      <p :id="`${id}-help`" class="mt-1 mb-4 text-xs leading-relaxed text-content-muted">{{ description || 'Drop files here or choose them from your device.' }}</p>
      <span aria-hidden="true" class="inline-flex min-h-9 items-center rounded-control bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary-content">{{ browseLabel }}</span>
      <input ref="input" v-bind="inputAttrs()" type="file" :accept="accept" :multiple="multiple" :disabled="disabled" :aria-required="required || undefined" class="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed" @change="change" />
    </div>
    <ul v-if="files.length" class="mt-3 mb-0 list-none space-y-2 p-0" :aria-label="`${label}: selected files`">
      <li v-for="(file, index) in files" :key="fileKey(file)" class="flex min-w-0 items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-inset ring-line">
        <FileIcon aria-hidden="true" class="size-5 shrink-0 text-content-muted" />
        <div class="min-w-0 flex-1"><slot name="file" :file="file" :index="index"><p class="m-0 break-words text-sm font-medium text-content">{{ file.name }}</p><p class="mt-1 mb-0 text-xs text-content-muted">{{ fileSize(file.size) }}</p></slot></div>
        <button type="button" :disabled="disabled" :aria-label="`${removeLabel} ${file.name}`" class="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-content-muted hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50" @click="remove(index)"><X aria-hidden="true" class="size-4" /></button>
      </li>
    </ul>
    <p role="status" aria-atomic="true" class="sr-only">{{ message }}</p>
  </div>
</template>
