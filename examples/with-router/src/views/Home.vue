<template>
  <v-access access="react.read">
    <AccessInfo />
  </v-access>
</template>

<script lang="ts">
import AccessInfo from '../components/AccessInfo.vue'

import Vue from 'vue'

export default Vue.extend({
  name: 'home',

  components: {
    AccessInfo
  }
})
</script>
