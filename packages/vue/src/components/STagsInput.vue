<script setup lang="ts">
import { nextTick, shallowRef, useAttrs, useId, watchEffect, useTemplateRef } from 'vue'
import { X } from '@lucide/vue'
import { controlAriaInvalid, controlBase, controlPadding, controlStateClasses, controlTextSizes, nativeControlAttrs } from './controlStyles'
import type { STagsInputProps } from './STagsInput.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<STagsInputProps>(), { size: 'md', disabled: false, readonly: false, invalid: false, valid: false, required: false, requiredMessage: 'Add at least one tag.', placeholder: 'Add a tag…' })
const model = defineModel<string[]>({ default: () => [] })
const emit = defineEmits<{ add: [tag: string]; remove: [tag: string]; change: [tags: string[]]; focus: [event: FocusEvent]; blur: [event: FocusEvent] }>()
defineSlots<{ tag?(props: { tag: string; index: number }): unknown }>()
const attrs = useAttrs()
const id = useId()
const input = useTemplateRef<HTMLInputElement>('input')
const root = useTemplateRef<HTMLElement>('root')
const draft = shallowRef('')
const announcement = shallowRef('')
const composing = shallowRef(false)
function onInput(event: Event) {
  if (!props.disabled && !props.readonly && !composing.value && !(event as InputEvent).isComposing) draft.value = (event.target as HTMLInputElement).value
}
function onCompositionEnd(event: CompositionEvent) {
  composing.value = false
  onInput(event)
}
function inputAttrs() {
  const { name: _name, ...rest } = nativeControlAttrs(attrs)
  return rest
}
watchEffect(() => input.value?.setCustomValidity(props.required && model.value.length === 0 ? props.requiredMessage : ''))
function add(values: string[]) {
  if (props.disabled || props.readonly) return false
  const tags = [...model.value]
  const added: string[] = []
  for (const value of values) {
    const tag = value.trim()
    if (!tag || tags.some(existing => existing.toLocaleLowerCase() === tag.toLocaleLowerCase())) continue
    if (props.maxTags !== undefined && tags.length >= props.maxTags) {
      announcement.value = `Maximum of ${props.maxTags} tags reached.`
      break
    }
    tags.push(tag)
    added.push(tag)
  }
  if (!added.length) return false
  model.value = tags
  for (const tag of added) emit('add', tag)
  emit('change', tags)
  announcement.value = `Added ${added.join(', ')}.`
  return true
}
function commit() {
  const value = draft.value.trim()
  if (add([value]) || model.value.some(tag => tag.toLocaleLowerCase() === value.toLocaleLowerCase())) draft.value = ''
}
async function remove(index: number) {
  if (props.disabled || props.readonly) return
  const tag = model.value[index]
  if (tag === undefined) return
  model.value = model.value.filter((_, item) => item !== index)
  emit('remove', tag)
  emit('change', model.value)
  announcement.value = `Removed ${tag}.`
  await nextTick()
  input.value?.focus()
}
function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly || composing.value || event.isComposing || event.keyCode === 229) return
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    commit()
  } else if (event.key === 'Backspace' && !draft.value) {
    const buttons = root.value?.querySelectorAll<HTMLButtonElement>('[data-tag-remove]')
    if (buttons?.length) { event.preventDefault(); buttons[buttons.length - 1]?.focus() }
  }
}
function onPaste(event: ClipboardEvent) {
  if (props.disabled || props.readonly) return
  const text = event.clipboardData?.getData('text') ?? ''
  if (!/[,\r\n]/.test(text)) return
  event.preventDefault()
  if (add(`${draft.value}${text}`.split(/[,\r\n]+/))) draft.value = ''
}
</script>

<template>
  <div
    ref="root"
    class="flex flex-wrap items-center gap-2 rounded-control"
    :class="[controlBase, controlPadding[size], controlTextSizes[size], controlStateClasses(invalid, valid, attrs['aria-invalid']), { 'opacity-50': disabled }, attrs.class]"
    :style="attrs.style"
  >
    <span
      v-for="(tag, index) in model"
      :key="index"
      class="inline-flex max-w-full items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-primary-content"
    >
      <span class="min-w-0 break-words"><slot name="tag" :tag="tag" :index="index">{{ tag }}</slot></span>
      <button
        v-if="!readonly"
        type="button"
        data-tag-remove
        :aria-label="`Remove ${tag}`"
        :disabled="disabled"
        class="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-current hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed"
        @click="remove(index)"
        @keydown.delete.prevent="remove(index)"
        @keydown.backspace.prevent="remove(index)"
      ><X aria-hidden="true" focusable="false" class="size-3.5" /></button>
    </span>
    <input
      ref="input"
      v-bind="inputAttrs()"
      :value="draft"
      @input="onInput"
      type="text"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :aria-required="required || undefined"
      :aria-invalid="controlAriaInvalid(invalid, attrs['aria-invalid'])"
      :aria-describedby="[attrs['aria-describedby'], `${id}-help`].filter(Boolean).join(' ')"
      class="m-0 w-20 min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-control-content outline-none placeholder:text-control-placeholder disabled:cursor-not-allowed"
      :class="controlTextSizes[size]"
      @keydown="onKeydown"
      @paste="onPaste"
      @compositionstart="composing = true"
      @compositionend="onCompositionEnd"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <input
      v-for="(tag, index) in model"
      :key="`hidden-${index}`"
      type="hidden"
      :name="attrs.name as string | undefined"
      :form="attrs.form as string | undefined"
      :value="tag"
      :disabled="disabled"
    />
    <span :id="`${id}-help`" class="sr-only">Press Enter or comma to add a tag. With an empty input, press Backspace to focus the last remove button.</span>
    <span role="status" class="sr-only">{{ announcement }}</span>
  </div>
</template>
