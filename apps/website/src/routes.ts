import { projects, services } from './data'
import type { StudioProject, StudioService } from './data'
import { articles } from './content'
import { showcaseSections } from './showcaseSections'
import type { StudioArticle } from './content'

export const pageOptions = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'projects', label: 'Projects' },
  { value: 'services', label: 'Services' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'faq', label: 'FAQ' },
  { value: 'journal', label: 'Blog / journal' },
  { value: 'contact', label: 'Contact' },
  { value: 'sections', label: 'Sections showcase' },
] as const
interface WebsiteRoute {
  page: string
  current: string
  title: string
  anchor?: string
  project?: StudioProject
  service?: StudioService
  article?: StudioArticle
}
export function resolveDestination(destination: string): WebsiteRoute {
  const [section, slug, anchor] = destination.split('/')
  if (section === 'sections') {
    const collection = showcaseSections.find(item => item.id === slug)
    return { page: 'sections', current: 'sections', title: 'Sections showcase', anchor: slug === 'menu' ? 'sections/menu' : collection ? `sections/${collection.id}` : undefined }
  }
  if (section === 'projects') {
    const project = projects.find(project => project.id === slug)
    if (project) return { page: 'project', current: 'projects', title: project.title, project }
    return { page: 'projects', current: 'projects', title: 'Our work' }
  }
  if (section === 'services') {
    const service = services.find(service => service.id === slug)
    if (service) return { page: 'service', current: 'services', title: service.title, service }
    return { page: 'services', current: 'services', title: 'Our services' }
  }
  if (section === 'journal') {
    const article = articles.find(article => article.id === slug)
    if (article) return {
      page: 'article', current: 'journal', title: article.title, article,
      anchor: article.sections.some(section => section.id === anchor) ? `journal/${article.id}/${anchor}` : undefined,
    }
    return { page: 'journal', current: 'journal', title: 'The journal' }
  }
  const page = pageOptions.find(option => option.value === destination) ?? pageOptions[0]
  return { page: page.value, current: page.value, title: page.label }
}
