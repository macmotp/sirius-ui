import type { SDonutChartItem } from './components/SDonutChart.types'

/** Normalize before summing so proportions remain finite even if the raw total overflows. */
export function donutLayout(data: readonly SDonutChartItem[], width: number, height: number, innerRadius: number) {
  const maximum = data.reduce((max, item) => Math.max(max, typeof item.value === 'number' && Number.isFinite(item.value) && item.value > 0 ? item.value : 0), 0)
  const sum = maximum ? data.reduce((total, item) => total + (typeof item.value === 'number' && Number.isFinite(item.value) && item.value > 0 ? item.value / maximum : 0), 0) : 0
  const total = maximum * sum
  const cx = width / 2, cy = height / 2
  const radius = Math.max(1, Math.min(width, height) / 2 - 12)
  const ratio = Number.isFinite(innerRadius) ? Math.min(.85, Math.max(.35, innerRadius)) : .65
  const inner = radius * ratio
  const sliceCount = maximum ? data.filter(item => typeof item.value === 'number' && Number.isFinite(item.value) && item.value > 0 && item.value / maximum > 0).length : 0
  let angle = -Math.PI / 2
  const coordinate = (r: number, a: number) => `${(cx + Math.cos(a) * r).toFixed(4)},${(cy + Math.sin(a) * r).toFixed(4)}`
  const rows = data.map((item, index) => {
    const valid = typeof item.value === 'number' && Number.isFinite(item.value) && item.value >= 0
    const value = valid ? item.value! : null
    const share = value !== null && maximum ? (value / maximum) / sum : 0
    const start = angle, end = angle + share * 2 * Math.PI, middle = (start + end) / 2
    angle = end
    // A small visual gap, capped for tiny wedges; a single slice stays a complete ring.
    const gap = sliceCount > 1 ? Math.min(2 / inner, (end - start) * .2) : 0
    const drawStart = start + gap / 2, drawEnd = end - gap / 2
    const color = item.color ?? ['var(--sirius-primary-content)', 'var(--sirius-content-muted)', 'var(--sirius-content)'][index % 3]!
    const outerArc = share > 0 ? `M${coordinate(radius, drawStart)} A${radius},${radius} 0 0 1 ${coordinate(radius, middle)} A${radius},${radius} 0 0 1 ${coordinate(radius, drawEnd)}` : ''
    const innerArc = share > 0 ? `M${coordinate(inner, drawEnd)} A${inner},${inner} 0 0 0 ${coordinate(inner, middle)} A${inner},${inner} 0 0 0 ${coordinate(inner, drawStart)}` : ''
    const path = share > 0 ? `${outerArc} L${innerArc.slice(1)} Z` : ''
    const curves = share > 0 ? `${outerArc} ${innerArc}` : ''
    const anchorRadius = (radius + inner) / 2
    return { ...item, value, index, share, color, start: drawStart, end: drawEnd, path, curves, x: cx + Math.cos(middle) * anchorRadius, y: cy + Math.sin(middle) * anchorRadius }
  })
  return { cx, cy, radius, inner, rows, slices: rows.filter(row => row.share > 0), total: Number.isFinite(total) ? total : null }
}
