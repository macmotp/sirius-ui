<script setup lang="ts">
import { computed } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import type { SButtonColor, SButtonProps, SButtonVariant } from './SButton.types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SButtonProps>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()
defineSlots<{ default?(): unknown; leading?(): unknown; trailing?(): unknown }>()

const colors: Record<SButtonColor, Record<SButtonVariant, string>> = {
  primary: {
    solid: 'border-transparent bg-primary text-on-solid data-[disabled=false]:hover:bg-primary-hover data-[disabled=false]:active:bg-primary-active',
    soft: 'border-transparent bg-primary-soft text-primary-content data-[disabled=false]:hover:bg-primary/15 data-[disabled=false]:active:bg-primary/25',
    outline: 'border-primary-content bg-transparent text-primary-content data-[disabled=false]:hover:bg-primary-soft data-[disabled=false]:active:bg-primary/20',
    ghost: 'border-transparent bg-transparent text-primary-content data-[disabled=false]:hover:bg-primary-soft data-[disabled=false]:active:bg-primary/20',
  },
  success: {
    solid: 'border-transparent bg-success text-on-solid data-[disabled=false]:hover:bg-success-hover data-[disabled=false]:active:bg-success-active',
    soft: 'border-transparent bg-success-soft text-success-content data-[disabled=false]:hover:bg-success/15 data-[disabled=false]:active:bg-success/25',
    outline: 'border-success-content bg-transparent text-success-content data-[disabled=false]:hover:bg-success-soft data-[disabled=false]:active:bg-success/20',
    ghost: 'border-transparent bg-transparent text-success-content data-[disabled=false]:hover:bg-success-soft data-[disabled=false]:active:bg-success/20',
  },
  warning: {
    solid: 'border-transparent bg-warning text-on-solid data-[disabled=false]:hover:bg-warning-hover data-[disabled=false]:active:bg-warning-active',
    soft: 'border-transparent bg-warning-soft text-warning-content data-[disabled=false]:hover:bg-warning/15 data-[disabled=false]:active:bg-warning/25',
    outline: 'border-warning-content bg-transparent text-warning-content data-[disabled=false]:hover:bg-warning-soft data-[disabled=false]:active:bg-warning/20',
    ghost: 'border-transparent bg-transparent text-warning-content data-[disabled=false]:hover:bg-warning-soft data-[disabled=false]:active:bg-warning/20',
  },
  danger: {
    solid: 'border-transparent bg-danger text-on-solid data-[disabled=false]:hover:bg-danger-hover data-[disabled=false]:active:bg-danger-active',
    soft: 'border-transparent bg-danger-soft text-danger-content data-[disabled=false]:hover:bg-danger/15 data-[disabled=false]:active:bg-danger/25',
    outline: 'border-danger-content bg-transparent text-danger-content data-[disabled=false]:hover:bg-danger-soft data-[disabled=false]:active:bg-danger/20',
    ghost: 'border-transparent bg-transparent text-danger-content data-[disabled=false]:hover:bg-danger-soft data-[disabled=false]:active:bg-danger/20',
  },
}

const sizes = {
  sm: 'min-h-8 gap-1.5 px-3 py-1.5 text-xs',
  md: 'min-h-10 gap-2 px-4 py-2 text-sm',
  lg: 'min-h-12 gap-2.5 px-6 py-3 text-base',
}
const blocked = computed(() => props.disabled || props.loading)
const element = computed(() => props.as ?? (props.href !== undefined ? 'a' : 'button'))
const nativeButton = computed(() => element.value === 'button')
// Do not mount a router component while blocked: its own handlers or prefetching
// must not activate a disabled link. Keep its label and layout as inert content.
const renderAs = computed(() => !nativeButton.value && blocked.value ? 'span' : element.value)

function onClick(event: MouseEvent) {
  if (blocked.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="renderAs"
    v-bind="$attrs"
    :type="nativeButton ? type : undefined"
    :disabled="nativeButton ? blocked : undefined"
    :href="!nativeButton && !blocked ? href : undefined"
    :role="!nativeButton && blocked ? 'link' : $attrs.role"
    :aria-disabled="!nativeButton && blocked ? true : undefined"
    :tabindex="!nativeButton && blocked ? -1 : $attrs.tabindex"
    :data-disabled="blocked"
    :aria-busy="loading || undefined"
    class="inline-flex max-w-full shrink-0 items-center justify-center rounded-control border border-solid font-sans font-medium leading-normal text-center no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus data-[disabled=false]:cursor-pointer data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 motion-reduce:transition-none"
    :class="[colors[color][variant], sizes[size], { 'w-full': fullWidth }]"
    @click="onClick"
  >
    <span v-if="loading || $slots.leading" class="inline-flex size-[1em] shrink-0 items-center justify-center [&>svg]:size-full" aria-hidden="true">
      <LoaderCircle v-if="loading" class="motion-safe:animate-spin" focusable="false" />
      <slot v-else name="leading" />
    </span>
    <span class="min-w-0 whitespace-normal break-words"><slot /></span>
    <span v-if="$slots.trailing" class="inline-flex size-[1em] shrink-0 items-center justify-center [&>svg]:size-full" aria-hidden="true"><slot name="trailing" /></span>
  </component>
</template>
