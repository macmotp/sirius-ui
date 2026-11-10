export type DemoPage = 'overview' | 'calendar' | 'cards' | 'charts' | 'orders' | 'settings' | 'profile'
export type DemoDestination = DemoPage | 'activity' | 'lists'
export const demoUser = { name: 'Alex Morgan', email: 'alex@acme.example', role: 'Workspace owner', jobTitle: 'Operations manager' }
export function isPlainLinkClick(event: MouseEvent) {
  return !event.defaultPrevented && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey
}
