import { CreateElement, VueConstructor } from 'vue'

export default function VAccess(Vue: VueConstructor) {
  return Vue.extend({
    name: 'VAccess',

    functional: true,

    props: {
      access: {
        type: [Array, String],
        required: true
      },
      strict: {
        type: Boolean,
        default: false
      }
    },

    render(h: CreateElement, { props, slots, parent }) {
      const vNodes = []
      const defaultSlots = slots().default

      if (Array.isArray(props.access)) {
        if (
          parent.$$auth[props.strict ? 'strict' : 'weak'](
            props.access as string[]
          )
        ) {
          vNodes.push(...defaultSlots)
        }
      }

      if (parent.$$auth.has(props.access as string)) {
        vNodes.push(...defaultSlots)
      }

      return vNodes
    }
  })
}
