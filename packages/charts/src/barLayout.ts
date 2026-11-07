import { numericDomain, numericPosition } from './numericScale'
import type { chartData } from './chartData'

export function barLayout(chart: ReturnType<typeof chartData>, width: number, height: number, horizontal: boolean, formatAxis: (value: number) => string) {
  if (!chart.values.length) return null
  const domain = numericDomain(chart.values, true)
  const ticks = domain.ticks.map(value => ({ value, label: formatAxis(value) }))
  const categories = chart.rows.length, count = chart.series.length
  const categorySize = chart.rows.reduce((max, row) => Math.max(max, Math.min(18, Array.from(row.label).length) * 7 + 16), 32)
  const tickSize = ticks.reduce((max, tick) => Math.max(max, Array.from(tick.label).length * 7 + 12), 40)
  const left = horizontal ? Math.min(width * .45, Math.max(64, Math.min(150, categorySize))) : Math.min(width * .32, Math.min(100, tickSize))
  const plotWidth = horizontal ? Math.max(240, width) : Math.max(width, left + 16 + categories * Math.max(categorySize, count * 18 + 20))
  const plotHeight = horizontal ? Math.max(height, categories * Math.max(40, count * 12 + 12) + 50) : height
  const top = 18, bottom = plotHeight - 32, right = plotWidth - 20
  const band = horizontal ? (bottom - top) / categories : (right - left) / categories
  const size = Math.min(horizontal ? 22 : 40, band * .72 / count)
  const position = (value: number) => numericPosition(value, domain, horizontal ? left : bottom, horizontal ? right : top)
  const zero = position(0)
  const labels = chart.rows.map((row, index) => {
    const center = (horizontal ? top : left) + band * (index + .5)
    const limit = Math.max(3, Math.floor((horizontal ? left - 16 : band - 8) / 7))
    const text = Array.from(row.label)
    return { index, label: row.label, text: text.length > limit ? text.slice(0, limit - 1).join('') + '…' : row.label, center }
  })
  const bars = chart.series.flatMap((series, seriesIndex) => series.data.flatMap((point, index) => {
    if (typeof point.value !== 'number' || !Number.isFinite(point.value)) return []
    const edge = position(point.value)
    const category = labels[index]!.center - size * count / 2 + seriesIndex * size
    return [{
      index, seriesId: series.id, color: series.color, value: point.value,
      x: horizontal ? Math.min(zero, edge) : category + 1,
      y: horizontal ? category + 1 : Math.min(zero, edge),
      width: horizontal ? Math.abs(edge - zero) : Math.max(1, size - 2),
      height: horizontal ? Math.max(1, size - 2) : Math.abs(edge - zero),
    }]
  }))
  const points = labels.filter(label => chart.inspection[label.index]!.value !== null)
  return { width: plotWidth, height: plotHeight, left, right, top, bottom, zero, band, labels, points, bars, ticks: ticks.map(tick => ({ ...tick, position: position(tick.value) })) }
}
