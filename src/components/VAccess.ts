import Vue, { CreateElement } from 'vue'

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

    if (Array.isArray(this.access)) {
      return (this.strict
      ? this.$_auth.strictList(this.access)
      : this.$_auth.weakList(this.access))
        ? (children && children[0]) || h()
        : h()
    }

    if (this.$_auth.has(this.access)) {
      return (children && children[0]) || h()
    }
    return h()
  }
}
