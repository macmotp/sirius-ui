import { numericDomain } from './numericScale'
import type { SLineChartPoint } from './components/SLineChart.types'


export function lineLayout(data: readonly SLineChartPoint[], width: number, height: number, includeZero: boolean, formatAxis: (value: number) => string, options: { values?: readonly number[]; smooth?: boolean; allLabels?: boolean } = {}) {
  const valid = data.flatMap(point => typeof point.value === 'number' && Number.isFinite(point.value) ? [point.value] : [])
  if (!valid.length) return null
  const scale = numericDomain(options.values?.length ? options.values : valid, includeZero)
  const tickLabels = scale.ticks.map(value => ({ value, label: formatAxis(value) }))
  const left = Math.min(width * 0.32, Math.max(40, Math.min(100, Math.max(...tickLabels.map(tick => Array.from(tick.label).length)) * 7 + 12)))
  const right = width - 16
  const top = 18
  const bottom = height - 32
  const normalizer = Math.max(Math.abs(scale.min), Math.abs(scale.max)) || 1
  const low = scale.min / normalizer, high = scale.max / normalizer
  const y = (value: number) => bottom - ((value / normalizer - low) / (high - low)) * (bottom - top)
  const x = (index: number) => data.length === 1 ? (left + right) / 2 : left + index / (data.length - 1) * (right - left)
  const points = data.flatMap((point, index) => typeof point.value === 'number' && Number.isFinite(point.value) ? [{ ...point, value: point.value, index, x: x(index), y: y(point.value) }] : [])
  const groups: typeof points[] = []
  for (const point of points) {
    const last = groups.at(-1)
    if (!last || last.at(-1)!.index !== point.index - 1) groups.push([point])
    else last.push(point)
  }
  const segments = groups.map(group => linePath(group, options.smooth ?? false))
  const labelWidth = categorySpacing(data)
  const slots = options.allLabels ? data.length : Math.max(2, Math.floor((right - left) / labelWidth))
  const count = Math.min(data.length, slots)
  const indices = [...new Set(Array.from({ length: count }, (_, index) => Math.round(index / Math.max(1, count - 1) * (data.length - 1))))]
  const maxLength = Math.max(4, Math.min(18, Math.floor((right - left) / Math.max(1, indices.length - 1) / 7)))
  const labels = indices.map((index, position) => {
    const label = data[index]!.label
    const characters = Array.from(label)
    return { index, x: x(index), label, text: characters.length > maxLength ? characters.slice(0, maxLength - 1).join('') + '…' : label, anchor: data.length === 1 ? 'middle' : position === 0 ? 'start' : position === indices.length - 1 ? 'end' : 'middle' }
  })
  return { left, right, top, bottom, points, segments, labels, ticks: tickLabels.map(tick => ({ ...tick, y: y(tick.value) })) }
}

/** Conservative SVG text estimate; complete labels remain in title/data view. */
export function categorySpacing(data: readonly SLineChartPoint[]) {
  return Math.max(28, ...data.map(point => Math.min(18, Array.from(point.label).length) * 7 + 14))
}

function linePath(points: readonly { x: number; y: number }[], smooth: boolean) {
  const first = points[0]!
  const coordinate = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`
  let path = `M${coordinate(first.x, first.y)}`
  const slopes = points.slice(1).map((point, index) => (point.y - points[index]!.y) / (point.x - points[index]!.x))
  // Harmonic mean tangents vanish at local extrema and cannot overshoot observations.
  const tangents = points.map((_, index) => {
    const before = slopes[index - 1], after = slopes[index]
    if (before === undefined) return after ?? 0
    if (after === undefined) return before
    return before * after <= 0 ? 0 : 2 / (1 / before + 1 / after)
  })
  for (let index = 1; index < points.length; index++) {
    const point = points[index]!, previous = points[index - 1]!
    const dx = (point.x - previous.x) / 3
    path += smooth && points.length > 2
      ? ` C${coordinate(previous.x + dx, previous.y + dx * tangents[index - 1]!)} ${coordinate(point.x - dx, point.y - dx * tangents[index]!)} ${coordinate(point.x, point.y)}`
      : ` L${coordinate(point.x, point.y)}`
  }
  return path
}
