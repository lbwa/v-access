import { CreateElement, VueConstructor } from 'vue'
import { assert } from '../shared/_utils'

export default function VAccessComponent(Vue: VueConstructor) {
  return Vue.extend({
    name: 'VAccess',

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

    render(h: CreateElement) {
      const children = this.$slots.default

      assert(
        children && children.length === 1,
        'Only support one element as children element when you are using <v-access>.'
      )

      if (Array.isArray(this.access)) {
        return (this.strict
        ? this.$$auth.strictList(this.access as string[])
        : this.$$auth.weakList(this.access as string[]))
          ? (children && children[0]) || h()
          : h()
      }

      if (this.$$auth.has(this.access)) {
        return (children && children[0]) || h()
      }
      return h()
    }
  })
}
