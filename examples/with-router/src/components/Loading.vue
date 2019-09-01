<template functional>
  <div class="loading" v-if="props.loading"></div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Loading',

  props: {
    loading: {
      type: Boolean,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
=center-in-fixed($z: 0)
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: $z

=circle($w: 2em, $h: 2em, $c: #72beff)
  width: $w
  height: $h
  border-radius: 50%
  border: 2px solid $c

.loading
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(255, 255, 255, 0.9)

  &::before
    +center-in-fixed(0)
    +circle(2em, 2em, #eeeeee)
    content: ''

  &::after
    +center-in-fixed(1)
    +circle(2em, 2em, #72beff)
    border-top-color: transparent
    border-left-color: transparent
    border-right-color: transparent
    animation: 0.5s spinner linear infinite
    content: ''

    @keyframes spinner
      0%
        transform: translate(-50%, -50%) rotate(0)

      100%
        transform: translate(-50%, -50%) rotate(360deg)
</style>
