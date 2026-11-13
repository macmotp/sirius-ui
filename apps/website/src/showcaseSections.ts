export const showcaseSections = [
  { id: 'heroes', label: 'Heroes', title: 'Hero sections', description: 'Introductions with artwork, product previews, photography, and the original studio homepage.' },
  { id: 'features', label: 'Features', title: 'Feature sections', description: 'Product features and the original studio services layout.' },
  { id: 'projects', label: 'Projects', title: 'Project sections', description: 'The original portfolio grid, with reusable linked project previews.' },
  { id: 'cta', label: 'Calls to action', title: 'CTA sections', description: 'Invitations to take the next step, including the original studio banner.' },
  { id: 'newsletter', label: 'Newsletter', title: 'Newsletter sections', description: 'Email sign-up layouts with independent local-only form previews.' },
  { id: 'stats', label: 'Stats', title: 'Stats sections', description: 'Key figures in tiles, alongside imagery, or beside supporting copy.' },
  { id: 'testimonials', label: 'Testimonials', title: 'Testimonial sections', description: 'Quotes with clear attribution, branding, and optional imagery.' },
  { id: 'blog', label: 'Blog', title: 'Blog sections', description: 'Article collections, including the original studio journal cards.' },
  { id: 'contact', label: 'Contact', title: 'Contact sections', description: 'Contact forms and location lists, including the original project enquiry.' },
  { id: 'team', label: 'Team', title: 'Team sections', description: 'Compact profiles, circular portraits, and the original studio team cards.' },
  { id: 'pricing', label: 'Pricing', title: 'Pricing sections', description: 'The original studio plans with app-owned billing-period selection.' },
  { id: 'faq', label: 'FAQ', title: 'FAQ sections', description: 'The original grouped questions, composed with the core accordion.' },
  { id: 'footer', label: 'Footers', title: 'Footer sections', description: 'The original grouped site footer and the centered social footer.' },
] as const
export type ShowcaseSectionId = typeof showcaseSections[number]['id']
