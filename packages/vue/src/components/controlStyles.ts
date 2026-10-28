import type { HTMLAttributes } from 'vue'

// Shared by the three native text/select controls so their treatment stays aligned.
export const controlBase = 'w-full min-w-0 border-0 bg-control font-sans text-control-content shadow-xs ring-1 ring-inset transition-colors focus-within:ring-1 focus-within:ring-inset motion-reduce:transition-none'
export const controlTextSizes = { sm: 'text-xs leading-5', md: 'text-sm leading-6', lg: 'text-base leading-7' }
export const controlPadding = { sm: 'px-3 py-1', md: 'px-4 py-1.5', lg: 'px-5 py-2' }

export function controlAriaInvalid(invalid: boolean, value: unknown): HTMLAttributes['aria-invalid'] {
  return invalid ? true : value as HTMLAttributes['aria-invalid']
}

export function controlStateClasses(invalid: boolean, valid: boolean, ariaInvalid: unknown) {
  if (invalid || [true, 'true', 'grammar', 'spelling'].includes(ariaInvalid as string | boolean)) {
    return 'ring-control-invalid focus-within:ring-control-invalid'
  }
  if (valid) return 'ring-control-valid focus-within:ring-control-valid'
  return 'ring-control-line focus-within:ring-control-focus'
}

export function nativeControlAttrs(attrs: Record<string, unknown>) {
  const { class: _class, style: _style, ...native } = attrs
  return native
}
