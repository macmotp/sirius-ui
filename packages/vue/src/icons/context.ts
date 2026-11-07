import { computed, inject, provide, toValue } from 'vue'
import type { App, Component, InjectionKey, MaybeRefOrGetter, Plugin } from 'vue'

export type SIconName = 'close' | 'check' | 'minus' | 'chevronDown' | 'chevronLeft' | 'chevronRight' | 'loading' | 'sortAscending' | 'sortDescending' | 'sort' | 'info' | 'success' | 'warning' | 'danger' | 'file' | 'upload' | 'user' | 'inbox' | 'menu'
export type SIconMap = Partial<Record<SIconName, Component>> & Record<string, Component | undefined>
type IconResolver = (name: string) => Component | undefined
const iconKey: InjectionKey<IconResolver> = Symbol('sirius-icons')

/** Provide reactive overrides to descendants; missing entries inherit the parent. */
export function provideSiriusIcons(icons: MaybeRefOrGetter<SIconMap>) {
  const parent = inject(iconKey, undefined)
  provide(iconKey, name => toValue(icons)[name] ?? parent?.(name))
}

/** App-scoped configuration, safe for separate apps and SSR requests. */
export function createSiriusIcons(icons: SIconMap): Plugin {
  return { install(app: App) { app.provide(iconKey, (name: string) => icons[name]) } }
}

export function useSiriusIcon(name: () => string) {
  const resolve = inject(iconKey, undefined)
  return computed(() => resolve?.(name()))
}
