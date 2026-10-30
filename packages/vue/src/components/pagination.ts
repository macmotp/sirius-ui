import type { SPaginationData, SPaginationLink, SPaginationMeta } from './SPagination.types'

// Laravel labels may contain entities. Decode text only; never render API HTML.
export function paginationLabel(label: string) {
  const named: Record<string, string> = { laquo: '«', raquo: '»', hellip: '…', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
  return label.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (entity, code: string) => {
    if (code.startsWith('#')) {
      const value = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
      return value > 0 && value <= 0x10ffff && !(value >= 0xd800 && value <= 0xdfff) ? String.fromCodePoint(value) : entity
    }
    return named[code] ?? entity
  })
}

function isLinkList(links: SPaginationData['links']): links is readonly SPaginationLink[] {
  return Array.isArray(links)
}

function navigationUrl(explicit: string | null | undefined, resource: string | null | undefined, fallback: string | null | undefined) {
  if (explicit !== undefined) return explicit
  if (resource !== undefined) return resource
  return fallback ?? null
}

export function paginationState(data: SPaginationData) {
  const meta: SPaginationMeta = data.meta ?? {
    current_page: data.current_page, last_page: data.last_page,
    from: data.from, to: data.to, total: data.total,
  }
  const links = data.links
  const list = isLinkList(links) ? links : meta.links
  const urls = links && !isLinkList(links) ? links : undefined
  // Null is authoritative: never invent a URL from a page number or path.
  const previous = navigationUrl(data.prev_page_url, urls?.prev, list?.[0]?.url)
  const next = navigationUrl(data.next_page_url, urls?.next, list?.[list.length - 1]?.url)
  return { meta, previous, next, pages: list && list.length >= 2 ? list.slice(1, -1) : [] }
}
