import { onBeforeUnmount, onMounted, watch } from 'vue'
import type { Ref } from 'vue'

// The UI owns pause reasons; this capability owns elapsed time and timer cleanup.
export function useToastTimer(open: Readonly<Ref<boolean>>, duration: () => number, expire: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let remaining = duration()
  let started = 0
  let mounted = false
  const pauses = new Set<string>()
  function stop() {
    if (timer === undefined) return
    clearTimeout(timer)
    timer = undefined
    remaining = Math.max(0, remaining - (Date.now() - started))
  }
  function start() {
    if (!mounted || !open.value || pauses.size || duration() <= 0 || !Number.isFinite(duration()) || timer !== undefined) return
    started = Date.now()
    timer = setTimeout(() => { timer = undefined; remaining = 0; expire() }, remaining)
  }
  function pause(reason: string) { stop(); pauses.add(reason) }
  function resume(reason: string) { pauses.delete(reason); start() }
  function reset() { stop(); remaining = duration(); start() }
  watch([open, duration], reset)
  onMounted(() => { mounted = true; reset() })
  onBeforeUnmount(stop)
  return { pause, resume }
}
