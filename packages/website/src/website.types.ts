import type { Component } from 'vue'

export interface SWebsiteNavItem {
  id: string
  label: string
  href: string
  target?: string
  rel?: string
  linkProps?: Record<string, unknown>
}
export interface SWebsiteNavGroup {
  id: string
  label: string
  items: readonly SWebsiteNavItem[]
}
export interface SWebsiteLayoutProps {
  contentId?: string
  mainLabelledby?: string
  skipLinkLabel?: string
}
export interface SWebsiteHeaderProps {
  items: readonly SWebsiteNavItem[]
  current?: string
  navigationKey?: string | number
  contentId?: string
  linkAs?: 'a' | Component
  navigationLabel?: string
  openLabel?: string
  closeLabel?: string
}
export interface SWebsiteFooterProps {
  variant?: 'columns' | 'centered'
  headingLevel?: 2 | 3 | 4 | 5 | 6
  items?: readonly SWebsiteNavItem[]
  socials?: readonly SWebsiteNavItem[]
  navigationLabel?: string
  socialLabel?: string
  groups?: readonly SWebsiteNavGroup[]
  linkAs?: 'a' | Component
}
export interface SWebsiteHeroProps {
  title: string
  headingLevel?: 1 | 2 | 3 | 4
  titleId?: string
  description?: string
  eyebrow?: string
  variant?: 'split' | 'centered' | 'mobile' | 'angled'
}
export interface SWebsiteSectionProps {
  title: string
  description?: string
  eyebrow?: string
  headingLevel?: 2 | 3 | 4
}
export interface SProjectCardProps {
  headingLevel?: 3 | 4 | 5 | 6
  title: string
  href: string
  category?: string
  year?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  linkAs?: 'a' | Component
}
export interface SWebsiteCtaProps {
  title: string
  description?: string
  eyebrow?: string
  variant?: 'banner' | 'simple' | 'centered' | 'gradient' | 'image'
  headingLevel?: 2 | 3 | 4
}
export interface SPricingCardProps {
  headingLevel?: 3 | 4 | 5 | 6
  title: string
  price: string
  period?: string
  description?: string
  billingNote?: string
  features: readonly string[]
  highlighted?: boolean
  badge?: string
}
export interface SArticleCardProps {
  title: string
  href: string
  excerpt?: string
  category?: string
  publishedAt?: string
  dateLabel?: string
  author?: string
  imageSrc?: string
  imageAlt?: string
  linkAs?: 'a' | Component
  variant?: 'default' | 'editorial' | 'horizontal'
  headingLevel?: 3 | 4 | 5 | 6
  categoryHref?: string
  authorHref?: string
  authorRole?: string
  authorImageSrc?: string
}

export interface SWebsiteFeature {
  id: string
  title: string
  description: string
  href?: string
  linkLabel?: string
}
export interface SWebsiteFeaturesProps {
  title: string
  description?: string
  eyebrow?: string
  features: readonly SWebsiteFeature[]
  variant?: 'small-icons' | 'large-icons' | 'grid' | 'image'
  headingLevel?: 2 | 3 | 4
  linkLabel?: string
  linkAs?: 'a' | Component
}

export interface SWebsiteNewsletterDetail {
  id: string
  title: string
  description: string
}
export interface SWebsiteNewsletterProps {
  title: string
  description?: string
  variant?: 'details' | 'simple'
  headingLevel?: 2 | 3 | 4
  details?: readonly SWebsiteNewsletterDetail[]
  emailLabel?: string
  placeholder?: string
  submitLabel?: string
  processing?: boolean
  disabled?: boolean
  error?: string
  status?: string
}

export interface SWebsiteStat {
  id: string | number
  label: string
  value: string
}
export interface SWebsiteStatsProps {
  title: string
  description?: string
  eyebrow?: string
  stats: readonly SWebsiteStat[]
  variant?: 'simple' | 'image' | 'description'
  headingLevel?: 2 | 3 | 4
}

export interface SWebsiteTestimonial {
  id: string | number
  quote: string
  name: string
  role?: string
  company?: string
  avatarSrc?: string
}
export interface SWebsiteTestimonialsProps {
  title: string
  testimonials: readonly SWebsiteTestimonial[]
  variant?: 'simple' | 'image' | 'multiple'
  headingLevel?: 2 | 3 | 4
}

export interface SWebsiteBlogPost extends Omit<SArticleCardProps, 'variant' | 'headingLevel' | 'linkAs'> {
  id: string | number
}
export interface SWebsiteBlogProps {
  title: string
  description?: string
  posts: readonly SWebsiteBlogPost[]
  variant?: 'columns' | 'images' | 'list'
  headingLevel?: 2 | 3 | 4
  linkAs?: 'a' | Component
}

export interface SWebsiteContactDetail {
  id: string | number
  label: string
  value: string
  href?: string
}
export interface SWebsiteContactLocation {
  id: string | number
  title: string
  address: readonly string[]
}
export interface SWebsiteContactProps {
  title: string
  description?: string
  variant?: 'split' | 'locations'
  headingLevel?: 2 | 3 | 4
  details?: readonly SWebsiteContactDetail[]
  locations?: readonly SWebsiteContactLocation[]
  linkAs?: 'a' | Component
}

export interface SWebsiteTeamMember {
  id: string | number
  name: string
  role?: string
  imageSrc?: string
  href?: string
}
export interface SWebsiteTeamProps {
  title: string
  description?: string
  members: readonly SWebsiteTeamMember[]
  variant?: 'small-images' | 'round-images'
  headingLevel?: 2 | 3 | 4
  linkAs?: 'a' | Component
}
