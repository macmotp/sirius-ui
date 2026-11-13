import type { SAccordionItem } from '@sirius-ui/vue'

export const processSteps = [
  { title: 'Find the right question.', description: 'We listen, ask questions and agree what a good outcome looks like before exploring directions.' },
  { title: 'Explore the possibilities.', description: 'Ideas become sketches, prototypes and conversations. We share the thinking early and refine it together.' },
  { title: 'Bring it into focus.', description: 'The chosen direction gets the attention it deserves, from the overall system to the smallest details.' },
  { title: 'Make it yours.', description: 'We hand over the work, the guidelines and the knowledge to help your team use it with confidence.' },
] as const
export const serviceDetails = {
  brand: {
    introduction: 'An identity starts with knowing who you are. We connect your story, your audience and your ambition into a visual world with a clear point of view.',
    includes: ['Positioning and brand foundations', 'Naming and verbal direction', 'Logo and visual identity system', 'Color, type and image direction', 'Practical brand guidelines', 'Launch and application design'],
    outcome: 'A distinctive identity your team can use consistently, with enough flexibility to grow alongside you.',
  },
  digital: {
    introduction: 'A website or product should make the next step feel natural. We combine clear thinking with considered interactions to make digital experiences people enjoy using.',
    includes: ['Discovery and user journeys', 'Information architecture', 'Responsive interface design', 'Interactive prototypes', 'Reusable design components', 'Developer handover and collaboration'],
    outcome: 'A coherent digital experience with a reusable foundation, ready for your team to build and evolve.',
  },
  editorial: {
    introduction: 'Some ideas deserve to be held, read and revisited. We work with words, images and materials to make publications and packaging with a lasting presence.',
    includes: ['Editorial concept and structure', 'Publication and layout systems', 'Typography and art direction', 'Packaging concepts', 'Print-ready artwork', 'Digital companion editions'],
    outcome: 'A thoughtful object or publication that tells your story, with a clear system for the next edition or release.',
  },
} as const
export interface FaqGroup {
  id: string
  title: string
  items: readonly SAccordionItem[]
}
export const faqGroups: readonly FaqGroup[] = [
  { id: 'together', title: 'Working together', items: [
    { value: 'start', label: 'How do we get started?', content: 'Tell us about your idea through the contact form. We start with a conversation, then put together a clear scope, approach and proposal.' },
    { value: 'remote', label: 'Can we work together remotely?', content: 'Yes. The studio concept is based in Singapore and designed for collaboration across locations, with shared documents, calls and regular progress updates.' },
    { value: 'team', label: 'Who will I work with?', content: 'You work directly with a small team across strategy, brand and digital design. We agree the people and responsibilities at the start of each project.' },
  ] },
  { id: 'projects', title: 'Projects & delivery', items: [
    { value: 'timeline', label: 'How long does a project take?', content: 'It depends on the scope, feedback cycle and deliverables. A focused exploration may take a few weeks, while a complete identity or website needs a longer schedule. We agree milestones before starting.' },
    { value: 'existing', label: 'Can you work with an existing brand?', content: 'Absolutely. We can build on an established identity, refine a specific touchpoint, or help decide where a broader refresh would make sense.' },
    { value: 'handover', label: 'What happens at handover?', content: 'We organize the agreed deliverables, explain how to use them and share the relevant guidelines. Development, hosting and ongoing support are agreed separately in the project scope.' },
  ] },
  { id: 'billing', title: 'Plans & billing', items: [
    { value: 'plans', label: 'Should I choose a project or a partnership?', content: 'A project suits a defined outcome and timeline. A partnership suits an ongoing stream of design work. Start with the shape of your needs, and we can help choose an approach.' },
    { value: 'annual', label: 'How does annual billing work?', content: 'The sample annual plans show an equivalent monthly price and the full amount billed upfront for the year. All amounts are illustrative and displayed in SGD.' },
    { value: 'scope', label: 'What if the scope changes?', content: 'We discuss the change together and agree any effect on the deliverables, schedule and cost before proceeding.' },
  ] },
]
export interface StudioArticleFigure {
  src: string
  alt: string
  caption: string
  credit: string
  creditHref: string
  width: number
  height: number
}
export interface StudioArticleCode {
  title: string
  language: string
  text: string
}
export interface StudioArticle {
  id: string
  title: string
  category: 'Perspective' | 'Process' | 'Notes'
  date: string
  author: string
  readTime: string
  excerpt: string
  artWord: string
  sections: readonly {
    id: string
    title: string
    paragraphs: readonly string[]
    figure?: StudioArticleFigure
    code?: StudioArticleCode
  }[]
}
const notebookFigure: StudioArticleFigure = {
  src: '/images/article-notebook.jpg',
  alt: 'An open notebook and pencil beside a laptop, phone and small plant on a white desk.',
  caption: 'A blank page leaves room for the questions that shape a better brief.',
  credit: 'JESHOOTS.COM / Unsplash',
  creditHref: 'https://unsplash.com/photos/pUAM5hPaCRI',
  width: 1400, height: 933,
}
const workspaceFigure: StudioArticleFigure = {
  src: '/images/article-workspace.jpg',
  alt: 'A minimal workspace with a white keyboard, a laptop and a red-covered book.',
  caption: 'Giving the essentials a little space can make the next step feel clearer.',
  credit: 'Patrik Michalicka / Unsplash',
  creditHref: 'https://unsplash.com/photos/r3iAqHb7JWs',
  width: 1400, height: 933,
}
export const articles: readonly StudioArticle[] = [
  {
    id: 'a-better-brief', title: 'A better brief starts with a better conversation.', category: 'Process', date: '2026-11-05', author: 'Alex Morgan', readTime: '4 min read', artWord: 'Begin.',
    excerpt: 'A few useful questions can do more for a project than a perfectly polished document. Here is where we like to start.',
    sections: [
      { id: 'start-with-why', figure: notebookFigure, title: 'Start with what needs to change.', paragraphs: ['A brief is a shared starting point. Before talking about pages, colors or deliverables, we ask what is happening today and what should feel different when the work is finished.', 'That conversation creates room for the real problem to emerge. Sometimes a request for a new website is also a question about positioning, clarity or confidence.'] },
      { id: 'give-context', figure: workspaceFigure, title: 'Bring the context into the room.', paragraphs: ['Tell us about your audience, your team and the practical constraints. Share the things that already work as well as the things that get in the way.', 'Useful context can be wonderfully ordinary. A question customers keep asking, a process your team repeats, or a piece of feedback that stayed with you can all point toward a better direction.'] },
      { id: 'agree-outcome', code: {
        title: 'A simple starting point', language: 'Text',
        text: 'Project brief\n\nWhat needs to change?\nWho are we making this for?\nWhat would a good outcome look like?\nWhat should we keep in mind?\n\nNext step: agree the question together.',
      }, title: 'Agree what a good outcome looks like.', paragraphs: ['A clear outcome helps everyone make decisions. It gives us a way to discuss ideas beyond personal preference and keeps the project connected to its original purpose.', 'The brief can evolve as we learn. What matters is that the team keeps a shared understanding of the question and the decisions that follow.'] },
    ],
  },
  {
    id: 'room-to-breathe', title: 'Good design leaves a little room to breathe.', category: 'Perspective', date: '2026-10-22', author: 'Jamie Lim', readTime: '3 min read', artWord: 'Space.',
    excerpt: 'Space is part of the message. A note on rhythm, restraint and making the important things easier to find.',
    sections: [
      { id: 'make-room', figure: workspaceFigure, title: 'Give each idea its own space.', paragraphs: ['A page becomes easier to understand when its parts have a clear relationship. Space helps show where an idea starts, where it ends and what deserves attention first.', 'We think about spacing as part of the content. A small pause between a heading and a paragraph can change the pace, just as a generous margin can make an image feel more intentional.'] },
      { id: 'build-rhythm', code: {
        title: 'A little room for the words', language: 'CSS',
        text: '.reading-column {\n  max-width: 44rem;\n  margin-inline: auto;\n  line-height: 1.8;\n}\n\n.reading-column p + p {\n  margin-block-start: 1.5rem;\n}',
      }, title: 'Find a rhythm you can repeat.', paragraphs: ['A few consistent decisions can bring a whole site together. Content widths, type sizes and section spacing create a rhythm that supports very different kinds of pages.', 'Consistency also makes room for a deliberate exception. A large image or a quiet quote has more presence when the surrounding system is clear.'] },
      { id: 'use-restraint', title: 'Keep asking what the page needs.', paragraphs: ['Every element should earn the space it takes. We revisit the page with its purpose in mind, looking for places where a simpler arrangement would make the next step clearer.', 'The result can feel calm without feeling empty. The aim is a page that gives its content the attention it deserves.'] },
    ],
  },
  {
    id: 'small-systems', title: 'Small systems make space for bigger ideas.', category: 'Notes', date: '2026-10-08', author: 'Sam Chen', readTime: '5 min read', artWord: 'Together.',
    excerpt: 'The value of a reusable foundation, from a handful of brand rules to the components behind a website.',
    sections: [
      { id: 'find-patterns', figure: notebookFigure, title: 'Notice what keeps coming back.', paragraphs: ['As a project grows, certain decisions repeat. A card, a call to action, a heading treatment or a familiar interaction may appear in several places.', 'Recognizing those patterns helps a team decide what should be shared and where a particular page needs something of its own.'] },
      { id: 'keep-it-useful', code: {
        title: 'Start with a small shared vocabulary', language: 'TypeScript',
        text: "const spacing = {\n  small: '0.5rem',\n  medium: '1rem',\n  large: '2rem',\n} as const\n\ntype Spacing = keyof typeof spacing\n\nfunction space(size: Spacing) {\n  return spacing[size]\n}",
      }, title: 'Build around a real need.', paragraphs: ['A useful system grows from the work it supports. We start with the pages and interactions in front of us, then collect the decisions that have proved helpful.', 'Clear examples matter as much as the components themselves. They show how the parts work together and help the next person make a confident choice.'] },
      { id: 'leave-room', title: 'Leave room for the next chapter.', paragraphs: ['A good foundation makes change easier. It gives a team a common language while leaving space for new content, new contexts and new ideas.', 'The system keeps learning from the work. That conversation between the whole and its parts is what keeps it useful over time.'] },
    ],
  },
]
const dateFormat = new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
export function articleDate(date: string) { return dateFormat.format(new Date(`${date}T00:00:00Z`)) }
