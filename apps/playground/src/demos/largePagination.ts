import type { SPaginationData, SPaginationLink } from '@sirius-ui/vue'

// Demo server fixture: builds the link window a backend would return.
// This is never used by SPagination itself or to slice any client-side records.
export function largePaginationResponse(page: number): SPaginationData {
  const current = Math.max(1, Math.min(100, page))
  const url = (number: number) => `/api/demo-audit-log?status=active&page=${number}`
  const previous = current > 1 ? url(current - 1) : null
  const next = current < 100 ? url(current + 1) : null
  const pages = [...new Set([1, 100, ...Array.from({ length: 5 }, (_, i) => current - 2 + i).filter(number => number >= 1 && number <= 100)])].sort((a, b) => a - b)
  const links: SPaginationLink[] = [{ label: '&laquo; Previous', url: previous, active: false }]
  pages.forEach((number, index) => {
    if (index > 0 && number - pages[index - 1]! > 1) links.push({ label: '...', url: null, active: false })
    links.push({ label: String(number), url: url(number), active: number === current })
  })
  links.push({ label: 'Next &raquo;', url: next, active: false })
  return { current_page: current, last_page: 100, from: (current - 1) * 10 + 1, to: current * 10, total: 1000, prev_page_url: previous, next_page_url: next, links }
}
