import type { SWebsiteNavGroup, SWebsiteNavItem } from '@sirius-ui/website'

export const navigation: readonly SWebsiteNavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'The studio', href: '#about' },
  { id: 'projects', label: 'Our work', href: '#projects' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'journal', label: 'Journal', href: '#journal' },
]
export const footerGroups: readonly SWebsiteNavGroup[] = [
  { id: 'explore', label: 'Explore', items: [...navigation, { id: 'contact', label: 'Get in touch', href: '#contact' }] },
  { id: 'information', label: 'Good to know', items: [
    { id: 'pricing', label: 'Pricing', href: '#pricing' },
    { id: 'faq', label: 'Questions & answers', href: '#faq' },
  ] },
  { id: 'elsewhere', label: 'Sirius previews', items: [
    { id: 'sections', label: 'Website sections', href: '#sections' },
    { id: 'dashboard', label: 'Dashboard', href: 'http://127.0.0.1:5180' },
    { id: 'auth', label: 'Authentication', href: 'http://127.0.0.1:5190' },
    { id: 'components', label: 'Component library', href: 'http://127.0.0.1:5173' },
  ] },
]
export type ProjectCategory = 'Brand' | 'Digital' | 'Editorial'
export interface StudioProject {
  id: 'fieldwork' | 'orbit' | 'forma' | 'northline'
  title: string
  category: ProjectCategory
  year: string
  tagline: string
  description: string
  challenge: string
  approach: string
  deliverables: readonly string[]
  artLabel: string
}
export const projects: readonly StudioProject[] = [
  {
    id: 'fieldwork', title: 'Fieldwork', category: 'Brand', year: '2026',
    tagline: 'A little closer to nature.',
    description: 'A warm, grounded identity for a fictional everyday skincare brand.',
    challenge: 'Give a new skincare brand a clear voice in a crowded category, with packaging that feels at home on the bathroom shelf.',
    approach: 'We paired a confident wordmark with a calm green palette and simple botanical forms. A small set of rules carries the identity from a jar label to a full brand story.',
    deliverables: ['Brand strategy', 'Visual identity', 'Packaging system', 'Art direction'],
    artLabel: 'Fieldwork brand study with a botanical green background and three cream skincare containers.',
  },
  {
    id: 'orbit', title: 'Orbit', category: 'Digital', year: '2026',
    tagline: 'Make room for the important things.',
    description: 'A clear digital home for a fictional team planning product.',
    challenge: 'Turn a busy collection of tasks and reports into a useful daily starting point for small teams.',
    approach: 'We organized the experience around what needs attention today. Spacious cards, a consistent type scale and a small set of interactions make the product feel familiar from the first visit.',
    deliverables: ['Product strategy', 'User experience', 'Interface design', 'Design system'],
    artLabel: 'Orbit product concept showing a clean planning dashboard on a lavender background.',
  },
  {
    id: 'forma', title: 'Forma Journal', category: 'Editorial', year: '2025',
    tagline: 'A different way of seeing.',
    description: 'An expressive editorial direction for a fictional culture journal.',
    challenge: 'Create a journal that gives long-form stories room to breathe while keeping a recognizable visual rhythm across every issue.',
    approach: 'Large serif headlines meet careful spacing and a simple geometric language. The resulting system lets photography, illustration and words take turns leading the page.',
    deliverables: ['Editorial direction', 'Publication design', 'Typography', 'Digital edition'],
    artLabel: 'Forma Journal cover study with oversized serif lettering and a rust-colored circular composition.',
  },
  {
    id: 'northline', title: 'Northline', category: 'Brand', year: '2025',
    tagline: 'Built with a sense of place.',
    description: 'An understated identity for a fictional architecture practice.',
    challenge: 'Express an architecture practice’s thoughtful approach without competing with the buildings and spaces it creates.',
    approach: 'An architectural grid and a restrained material palette underpin the identity. A custom monogram works at small scales, while generous layouts leave the projects in focus.',
    deliverables: ['Positioning', 'Visual identity', 'Website direction', 'Stationery'],
    artLabel: 'Northline identity study with an architectural navy monogram on a warm paper background.',
  },
]
export const services = [
  { id: 'brand', projectId: 'fieldwork', number: '01', title: 'Brand & identity', description: 'Find the thread that makes you different, then give it a voice and a visual world.', details: 'Strategy · Identity · Art direction' },
  { id: 'digital', projectId: 'orbit', number: '02', title: 'Digital experiences', description: 'Useful, considered websites and products that feel good to spend time with.', details: 'Websites · Products · Design systems' },
  { id: 'editorial', projectId: 'forma', number: '03', title: 'Stories & print', description: 'Bring ideas into the world through thoughtful publications, packaging and campaigns.', details: 'Editorial · Packaging · Campaigns' },
] as const

export type StudioService = typeof services[number]
