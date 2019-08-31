<template functional>
  <p class="subtitle">
    <a class="subtitle__badge" href="https://www.npmjs.com/package/v-access">
      <img
        alt="npm"
        src="https://img.shields.io/npm/v/v-access?logo=npm&style=flat"
      />
    </a>
    <a class="subtitle__badge" href="https://github.com/lbwa/v-access/actions">
      <img
        alt="Unit test workflow"
        src="https://github.com/lbwa/v-access/workflows/Unit%20test/badge.svg"
      />
    </a>
  </p>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppSubtitle'
})
</script>

<style lang="sass" scoped>
.subtitle
  text-align: center

  &__badge
    & + &
      margin-left: 5px
</style>
