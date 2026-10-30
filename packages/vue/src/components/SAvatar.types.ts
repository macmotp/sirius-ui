export type SAvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export interface SAvatarProps {
  src?: string
  name?: string
  alt?: string
  initials?: string
  size?: SAvatarSize
  shape?: 'circle' | 'rounded'
}
