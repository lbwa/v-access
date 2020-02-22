import { Ability } from 'src/core/ability'
import { CreateElement, VueConstructor } from 'vue'

export default function VAccess(Vue: VueConstructor) {
  return Vue.extend({
    name: 'VAccess',

    functional: true,

    props: {
      ability: {
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
      const isValid = Array.isArray(props.ability)
        ? parent.$$verify[props.strict ? 'verifyAll' : 'verifySome'](
            props.ability as Ability[]
          )
        : parent.$$verify.has(props.ability as Ability)

      if (isValid) {
        vNodes.push(...defaultSlots)
      }

      return vNodes
    }
  })
}
