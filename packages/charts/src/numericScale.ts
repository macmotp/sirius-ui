export function numericDomain(values: readonly number[], includeZero: boolean) {
  const rawMin = values.reduce((a, b) => Math.min(a, b))
  const rawMax = values.reduce((a, b) => Math.max(a, b))
  let min = includeZero ? Math.min(0, rawMin) : rawMin
  let max = includeZero ? Math.max(0, rawMax) : rawMax
  if (min === max) {
    const padding = Math.abs(min) * 0.1 || 1
    min = includeZero && min === 0 ? 0 : min - padding
    max += padding
  }
  // Nice ticks for ordinary values, with a finite fallback at numeric extremes.
  if (Number.isFinite(max - min)) {
    const rough = (max - min) / 4
    const magnitude = 10 ** Math.floor(Math.log10(rough))
    const fraction = rough / magnitude
    const step = ([1, 2, 2.5, 5, 10].find(value => value >= fraction) ?? 10) * magnitude
    const low = Math.floor(min / step) * step
    const high = Math.ceil(max / step) * step
    if (Number.isFinite(low) && Number.isFinite(high) && high > low && step > 0) {
      const count = Math.round((high - low) / step)
      return { min: low, max: high, ticks: Array.from({ length: Math.min(9, count + 1) }, (_, index) => Number((low + index * step).toPrecision(12))) }
    }
  }
  let finiteMin = Number.isFinite(min) ? min : rawMin
  let finiteMax = Number.isFinite(max) ? max : rawMax
  if (finiteMin === finiteMax) {
    finiteMin = Math.min(0, finiteMin)
    finiteMax = Math.max(0, finiteMax)
    if (finiteMin === finiteMax) finiteMax = 1
  }
  return { min: finiteMin, max: finiteMax, ticks: [finiteMin, finiteMax] }
}

/** Normalize before subtraction to keep extreme finite domains usable. */
export function numericPosition(value: number, domain: { min: number; max: number }, start: number, end: number) {
  const magnitude = Math.max(Math.abs(domain.min), Math.abs(domain.max)) || 1
  return start + (value / magnitude - domain.min / magnitude) / (domain.max / magnitude - domain.min / magnitude) * (end - start)
}
