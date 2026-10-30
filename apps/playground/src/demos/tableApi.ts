import type { SPaginationLink, STableSort } from '@sirius-ui/vue'

export interface DemoMember { id: number; name: string; email: string; team: string; status: string }
// Only this demo service owns the complete dataset. Replace it with fetch in an app.
const members: DemoMember[] = [
  { id: 1, name: 'Alex Morgan', email: 'alex@example.test', team: 'Design', status: 'Active' },
  { id: 2, name: 'Sam Chen', email: 'sam@example.test', team: 'Engineering', status: 'Active' },
  { id: 3, name: 'Jordan Lee', email: 'jordan@example.test', team: 'Operations', status: 'Invited' },
  { id: 4, name: 'Taylor Park', email: 'taylor@example.test', team: 'Design', status: 'Active' },
  { id: 5, name: 'Casey Patel', email: 'casey@example.test', team: 'Engineering', status: 'Invited' },
  { id: 6, name: 'Riley Wong', email: 'riley@example.test', team: 'Operations', status: 'Active' },
  { id: 7, name: 'Jamie Tan', email: 'jamie@example.test', team: 'Engineering', status: 'Active' },
]
export function memberUrl(page: number, sort: STableSort | null, empty = false) {
  const query = new URLSearchParams({ page: String(page), team: 'all' })
  if (sort) { query.set('sort', sort.key); query.set('direction', sort.direction) }
  if (empty) query.set('empty', '1')
  return `/api/demo-members?${query}`
}
export async function requestMembers(url: string, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')) }
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, 550)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
  const query = new URL(url, 'https://example.test').searchParams
  const sort = query.get('sort') ? { key: query.get('sort')!, direction: query.get('direction') === 'desc' ? 'desc' : 'asc' } as STableSort : null
  const empty = query.get('empty') === '1'
  const data = empty ? [] : [...members]
  if (sort?.key === 'name' || sort?.key === 'team') {
    const key = sort.key as 'name' | 'team'
    data.sort((a, b) => a[key].localeCompare(b[key]) * (sort.direction === 'asc' ? 1 : -1))
  }
  const last = Math.max(1, Math.ceil(data.length / 3))
  const page = Math.max(1, Math.min(last, Number(query.get('page')) || 1))
  const pageUrl = (number: number) => memberUrl(number, sort, empty)
  const previous = page > 1 ? pageUrl(page - 1) : null
  const next = page < last ? pageUrl(page + 1) : null
  const links: SPaginationLink[] = [
    { label: '&laquo; Previous', url: previous, active: false },
    ...Array.from({ length: last }, (_, index) => ({ label: String(index + 1), url: pageUrl(index + 1), active: page === index + 1 })),
    { label: 'Next &raquo;', url: next, active: false },
  ]
  return {
    data: data.slice((page - 1) * 3, page * 3), current_page: page, last_page: last, per_page: 3,
    total: data.length, from: data.length ? (page - 1) * 3 + 1 : null, to: data.length ? Math.min(page * 3, data.length) : null,
    prev_page_url: previous, next_page_url: next, links,
  }
}
