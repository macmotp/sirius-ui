import type { Component } from 'vue'
import FoundationsShowcase from './components/FoundationsShowcase.vue'
import ButtonShowcase from './components/ButtonShowcase.vue'
import DropdownShowcase from './components/DropdownShowcase.vue'
import FormShowcase from './components/FormShowcase.vue'
import ChoiceShowcase from './components/ChoiceShowcase.vue'
import SearchInputShowcase from './components/SearchInputShowcase.vue'
import FileUploadShowcase from './components/FileUploadShowcase.vue'
import LayoutShowcase from './components/LayoutShowcase.vue'
import DividerShowcase from './components/DividerShowcase.vue'
import AccordionShowcase from './components/AccordionShowcase.vue'
import BreadcrumbsShowcase from './components/BreadcrumbsShowcase.vue'
import TabsShowcase from './components/TabsShowcase.vue'
import DialogShowcase from './components/DialogShowcase.vue'
import DrawerShowcase from './components/DrawerShowcase.vue'
import TooltipShowcase from './components/TooltipShowcase.vue'
import BadgeShowcase from './components/BadgeShowcase.vue'
import AvatarShowcase from './components/AvatarShowcase.vue'
import TableShowcase from './components/TableShowcase.vue'
import AlertShowcase from './components/AlertShowcase.vue'
import ToastShowcase from './components/ToastShowcase.vue'
import ProgressShowcase from './components/ProgressShowcase.vue'
import SkeletonShowcase from './components/SkeletonShowcase.vue'
import EmptyStateShowcase from './components/EmptyStateShowcase.vue'

interface ShowcaseGroup {
  id: string
  title: string
  description: string
  components: Component[]
}

// One ordered list drives the menu and page composition. Demo state stays in each showcase.
export const showcaseGroups: ShowcaseGroup[] = [
  {
    id: 'foundations', title: 'Foundations',
    description: 'Colors, typography, spacing, and the theme in action.',
    components: [FoundationsShowcase],
  },
  {
    id: 'actions', title: 'Actions',
    description: 'Buttons, links, and menus for the next action.',
    components: [ButtonShowcase, DropdownShowcase],
  },
  {
    id: 'forms', title: 'Forms',
    description: 'Form layouts, fields, choices, searchable inputs, and file uploads.',
    components: [FormShowcase, ChoiceShowcase, SearchInputShowcase, FileUploadShowcase],
  },
  {
    id: 'layout', title: 'Layout',
    description: 'Grids, cards, dividers, and expandable content.',
    components: [LayoutShowcase, DividerShowcase, AccordionShowcase],
  },
  {
    id: 'navigation', title: 'Navigation',
    description: 'Breadcrumbs and tabs to move between views.',
    components: [BreadcrumbsShowcase, TabsShowcase],
  },
  {
    id: 'overlays', title: 'Overlays',
    description: 'Dialogs, drawers, tooltips, and popovers for focused context.',
    components: [DialogShowcase, DrawerShowcase, TooltipShowcase],
  },
  {
    id: 'data-display', title: 'Data display',
    description: 'Badges, avatars, tables, and pagination for server-provided data.',
    components: [BadgeShowcase, AvatarShowcase, TableShowcase],
  },
  {
    id: 'feedback', title: 'Feedback',
    description: 'Alerts, toasts, progress, loading placeholders, and empty states.',
    components: [AlertShowcase, ToastShowcase, ProgressShowcase, SkeletonShowcase, EmptyStateShowcase],
  },
]
