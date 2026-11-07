import { shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

// Follow the plot ref, including when loading/error states replace its DOM node.
export function useChartWidth(element: Readonly<Ref<HTMLElement | null>>) {
  const width = shallowRef(640)
  watch(() => element.value, (target, _, onCleanup) => {
    if (!target) return
    function measure() {
      if (target?.clientWidth && Number.isFinite(target.clientWidth)) width.value = Math.max(160, target.clientWidth)
    }
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(entries => {
        const next = entries[0]?.contentRect.width
        if (next && Number.isFinite(next)) width.value = Math.max(160, next)
      })
      observer.observe(target)
      onCleanup(() => observer.disconnect())
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', measure)
      onCleanup(() => window.removeEventListener('resize', measure))
    }
  }, { flush: 'post', immediate: true })
  return width
}
