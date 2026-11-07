export interface SDashboardLayoutProps {
  /** ID of an external page heading, for example in the header slot. */
  mainLabelledby?: string
  navigationLabel?: string
  openNavigationLabel?: string
  closeNavigationLabel?: string
  skipLinkLabel?: string
  /** Pass a route URL/key to close mobile navigation after application navigation. */
  navigationKey?: string | number
}

export interface SDashboardNavigationSlot {
  mobile: boolean
  /** Close mobile navigation and focus the content after the drawer's exit. */
  close: () => void
}
