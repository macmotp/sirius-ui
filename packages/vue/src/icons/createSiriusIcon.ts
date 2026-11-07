import { defineComponent, h } from 'vue'
import SIcon from '../components/SIcon.vue'

/** Adapt a semantic name to APIs that accept a Vue icon component. */
export function createSiriusIcon(name: string) {
  return defineComponent({
    name: `SiriusIcon_${name}`,
    inheritAttrs: false,
    setup(_, { attrs }) { return () => h(SIcon, { ...attrs, name }) },
  })
}
