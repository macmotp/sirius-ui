export interface SAccordionItem {
  value: string
  label: string
  content?: string
  disabled?: boolean
}
export interface SAccordionProps<T extends SAccordionItem = SAccordionItem> {
  items?: readonly T[]
  multiple?: boolean
  headingLevel?: 2 | 3 | 4 | 5 | 6
  keepAlive?: boolean
}
