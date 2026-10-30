import { onBeforeUnmount, onMounted, readonly, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

type DismissReason = 'escape' | 'backdrop' | 'close-button'
interface ModalDialogOptions {
  exitAnimation: string
  closeOnEscape: () => boolean
  closeOnBackdrop: () => boolean
  onDismiss: (reason: DismissReason) => void
  onClose: (event: Event) => void
}

// Own the native modal lifecycle per instance; layouts and naming stay in the SFC.
export function useModalDialog(
  dialog: Readonly<Ref<HTMLDialogElement | null>>,
  open: Ref<boolean>,
  options: ModalDialogOptions,
) {
  const rendered = shallowRef(open.value)
  const state = shallowRef<'open' | 'closed'>(open.value ? 'open' : 'closed')
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  function clearCloseTimer() {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
  function finishClose() {
    clearCloseTimer()
    if (open.value) return
    dialog.value?.close()
    rendered.value = false
  }
  function onAnimationEnd(event: AnimationEvent) {
    if (event.target === dialog.value && event.animationName === options.exitAnimation) finishClose()
  }
  let startedOutside = false

  function syncOpen() {
    const element = dialog.value
    if (!element) return
    clearCloseTimer()
    if (open.value) {
      rendered.value = true
      state.value = 'open'
      if (!element.open) element.showModal()
    } else if (element.open) {
      state.value = 'closed'
      // Ensure closure even if a consumer overrides or cancels the animation.
      closeTimer = setTimeout(finishClose, 200)
    }
  }
  onMounted(syncOpen)
  watch(open, syncOpen, { flush: 'post' })
  onBeforeUnmount(() => {
    clearCloseTimer()
    if (dialog.value?.open) dialog.value.close()
  })

  function dismiss(reason: DismissReason) {
    if (!open.value) return
    open.value = false
    options.onDismiss(reason)
  }
  function onCancel(event: Event) {
    // Let the bound model decide whether to close, including controlled dialogs.
    event.preventDefault()
    if (options.closeOnEscape()) dismiss('escape')
  }
  function onClose(event: Event) {
    // A queued native close event can arrive after a parent has reopened it.
    if (dialog.value?.open) return
    clearCloseTimer()
    rendered.value = false
    state.value = 'closed'
    open.value = false
    options.onClose(event)
  }
  function outside(event: MouseEvent | PointerEvent) {
    if (event.target !== dialog.value || !dialog.value) return false
    const rect = dialog.value.getBoundingClientRect()
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
  }
  function onPointerDown(event: PointerEvent) { startedOutside = outside(event) }
  function onBackdropClick(event: MouseEvent) {
    const backdropClick = startedOutside && outside(event)
    startedOutside = false
    if (options.closeOnBackdrop() && backdropClick) dismiss('backdrop')
  }
  return {
    rendered: readonly(rendered),
    state: readonly(state),
    dismiss,
    onAnimationEnd,
    onCancel,
    onClose,
    onPointerDown,
    onBackdropClick,
  }
}
