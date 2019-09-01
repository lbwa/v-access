import { CreateElement, VueConstructor } from 'vue'

export default function VAccess(Vue: VueConstructor) {
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
      if (Array.isArray(this.access)) {
        return (this.strict
        ? this.$$auth.strictList(this.access as string[])
        : this.$$auth.weakList(this.access as string[]))
          ? h('div', { class: 'v-access' }, this.$slots.default)
          : h()
      }

      if (this.$$auth.has(this.access)) {
        return h('div', { class: 'v-access' }, this.$slots.default)
      }
      return h()
    }
  })
}
