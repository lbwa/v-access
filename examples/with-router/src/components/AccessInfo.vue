<template>
  <div class="access-info">
    <p v-if="accessList">
      This area is only for
      <strong>{{
        JSON.stringify($route.meta.access || this.$route.meta.weakAccess)
      }}</strong>
    </p>
    <p v-else>This area is for <strong>Public</strong> routes.</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AccessInfo',

  computed: {
    accessList(): string[] | boolean {
      return this.$route.meta.access || this.$route.meta.weakAccess || false
    }
  }
})
</script>

<style scoped lang="sass">
h3
  margin: 40px 0 0

ul
  list-style-type: none
  padding: 0

li
  display: inline-block
  margin: 0 10px

a
  color: #42b983
</style>
