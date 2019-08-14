import Vue, { CreateElement } from 'vue'
import { assert } from '@src/_utils'

export default {
  name: 'VAccess',

  abstract: true,

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

  render(this: Vue, h: CreateElement) {
    const children = this.$slots.default

    assert(
      children && children.length === 1,
      'Only support one element as children element when you are using <v-access>.'
    )

    if (Array.isArray(this.access)) {
      return (this.strict
      ? this.$$auth.strictList(this.access)
      : this.$$auth.weakList(this.access))
        ? (children && children[0]) || h()
        : h()
    }

    if (this.$$auth.has(this.access)) {
      return (children && children[0]) || h()
    }
    return h()
  }
}
