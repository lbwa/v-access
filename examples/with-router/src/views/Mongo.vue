<template>
  <AccessInfo />
</template>

<script lang="ts">
import Vue from 'vue'
import AccessInfo from '../components/AccessInfo.vue'

export default Vue.extend({
  name: 'RouteNamedMongo',

  components: {
    AccessInfo
  }
})
</script>

<style lang="sass" scoped></style>
