import type { SIconName } from './context'

// Small, dependency-free control glyphs. Applications can replace every entry.
export const fallbackPaths: Record<SIconName, string> = {
  close: 'm6 6 12 12M18 6 6 18',
  check: 'm5 12 4 4L19 6',
  minus: 'M5 12h14',
  chevronDown: 'm6 9 6 6 6-6',
  chevronLeft: 'm15 6-6 6 6 6',
  chevronRight: 'm9 6 6 6-6 6',
  loading: 'M20 12a8 8 0 1 1-8-8',
  sortAscending: 'M12 20V4m-6 6 6-6 6 6',
  sortDescending: 'M12 4v16m-6-6 6 6 6-6',
  sort: 'M8 20V4m-4 4 4-4 4 4m4-4v16m-4-4 4 4 4-4',
  info: 'M12 11v6m0-10h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  success: 'm7 12 3 3 7-7M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  warning: 'M12 3 2 21h20L12 3Zm0 6v5m0 3h.01',
  danger: 'M12 8v5m0 3h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
  file: 'M14 3H5v18h14V8l-5-5Zm0 0v5h5',
  upload: 'M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  inbox: 'M3 14 6 4h12l3 10v6H3v-6Zm0 0h5l2 3h4l2-3h5',
  menu: 'M4 6h16M4 12h16M4 18h16',
}
