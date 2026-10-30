export type SCardCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface SCardProps {
  bento?: SCardCorner | readonly SCardCorner[]
}
