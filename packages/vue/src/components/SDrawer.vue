<script setup lang="ts">
import { useAttrs, useId, useTemplateRef } from 'vue'
import { useModalDialog } from '../composables/useModalDialog'
import { X } from '@lucide/vue'
import type { SDrawerDismissReason, SDrawerProps } from './SDrawer.types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<SDrawerProps>(), {
  size: 'md',
  side: 'right',
  showClose: true,
  closeLabel: 'Close drawer',
  closeOnEscape: true,
  closeOnBackdrop: true,
})
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ dismiss: [reason: SDrawerDismissReason]; close: [event: Event] }>()
defineSlots<{ default?(): unknown; title?(): unknown; description?(): unknown; footer?(): unknown }>()
const attrs = useAttrs()
const id = useId()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const { rendered, state, dismiss, onAnimationEnd, onCancel, onClose, onPointerDown, onBackdropClick } = useModalDialog(dialog, open, {
  exitAnimation: 'sirius-drawer-out',
  closeOnEscape: () => props.closeOnEscape,
  closeOnBackdrop: () => props.closeOnBackdrop,
  onDismiss: reason => emit('dismiss', reason),
  onClose: event => emit('close', event),
})
const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

function labelledBy(hasTitle: boolean) {
  return typeof attrs['aria-labelledby'] === 'string' ? attrs['aria-labelledby'] : hasTitle ? `${id}-title` : undefined
}
function describedBy(hasDescription: boolean) {
  return [attrs['aria-describedby'], hasDescription && `${id}-description`].filter(Boolean).join(' ') || undefined
}
</script>

<template>
  <dialog
    ref="dialog"
    v-bind="attrs"
    :aria-labelledby="labelledBy(!!(title || $slots.title))"
    :aria-describedby="describedBy(!!(description || $slots.description))"
    aria-modal="true"
    :data-state="state"
    class="fixed inset-y-0 m-0 h-dvh max-h-dvh w-[calc(100%_-_1rem)] overflow-y-auto overscroll-contain sirius-dialog sirius-drawer border border-solid border-dialog-line bg-dialog p-6 font-sans text-content shadow-lg backdrop:bg-overlay"
    :class="[sizes[size], side === 'left' ? 'left-0 right-auto rounded-r-2xl' : 'right-0 left-auto rounded-l-2xl']"
    :data-side="side"
    @animationend="onAnimationEnd"
    @cancel="onCancel"
    @close="onClose"
    @pointerdown="onPointerDown"
    @click="onBackdropClick"
  >
    <template v-if="open || rendered">
      <div v-if="title || $slots.title || description || $slots.description || showClose" class="flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1 break-words">
          <h2 v-if="title || $slots.title" :id="`${id}-title`" class="m-0 text-lg font-semibold leading-7"><slot name="title">{{ title }}</slot></h2>
          <div v-if="description || $slots.description" :id="`${id}-description`" class="mt-2 text-sm leading-6 text-content-muted"><slot name="description">{{ description }}</slot></div>
        </div>
        <button
          v-if="showClose"
          type="button"
          :aria-label="closeLabel"
          class="-m-0.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-content-muted hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          @click="dismiss('close-button')"
        ><X aria-hidden="true" focusable="false" class="size-5" /></button>
      </div>
      <div
        v-if="$slots.default"
        class="min-w-0 break-words text-sm leading-6"
        :class="{ 'mt-6': title || $slots.title || description || $slots.description || showClose }"
      ><slot /></div>
      <div v-if="$slots.footer" class="flex flex-wrap items-center justify-end gap-3 mt-6"><slot name="footer" /></div>
    </template>
  </dialog>
</template>
