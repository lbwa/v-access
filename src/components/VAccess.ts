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
    const slots = this.$slots.default

    if (
      (Array.isArray(this.access) &&
        (this.strict
          ? this.$_auth.strictList(this.access)
          : this.$_auth.weakList(this.access))) ||
      this.$_auth.has(this.access as string)
    ) {
      return (slots && slots[0]) || h()
    }
    return h()
  }
}
