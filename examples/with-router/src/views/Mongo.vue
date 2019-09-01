<template>
  <div class="route-with-access">
    Restriction:&nbsp;<code>vue.read</code>&nbsp;<strong>OR</strong>&nbsp;<code
      >react.read</code
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'RouteNamedMongo'
})
</script>

<style lang="sass" scoped></style>
