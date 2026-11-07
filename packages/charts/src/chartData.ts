import type { SLineChartPoint, SLineChartSeries } from './components/SLineChart.types'

const finite = (value: number | null | undefined): value is number => typeof value === 'number' && Number.isFinite(value)

/** Shared categories/scale, without mutating, sorting or interpolating application data. */
export function chartData(data: readonly SLineChartPoint[], series: readonly SLineChartSeries[] | undefined, label: string) {
  const source = series ?? [{ id: 'value', label, data }]
  const categories = series ? [...new Set(source.flatMap(item => item.data.map(point => point.label)))] : data.map(point => point.label)
  const dashes = { solid: '', dashed: '8 4', dotted: '2 5' }
  const aligned = source.map((item, index) => {
    const pattern = item.pattern ?? (['solid', 'dashed', 'dotted'] as const)[index % 3]!
    const values = new Map(item.data.map(point => [point.label, point.value]))
    return {
      ...item,
      color: item.color ?? ['var(--sirius-primary-content)', 'var(--sirius-content-muted)', 'var(--sirius-content)'][index % 3]!,
      dash: dashes[pattern],
      pattern,
      data: categories.map((category, position) => ({ label: category, value: (series ? values.get(category) : item.data[position]?.value) ?? null })),
    }
  })
  const rows = categories.map((category, index) => ({ label: category, values: aligned.map(item => item.data[index]!.value) }))
  const values = aligned.flatMap(item => item.data.flatMap(point => finite(point.value) ? [point.value] : []))
  const inspection = rows.map(row => ({ label: row.label, value: row.values.find(finite) ?? null }))
  return { series: aligned, rows, values, inspection }
}
