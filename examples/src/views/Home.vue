<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <v-access access="test">
      <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    </v-access>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld
  },

  created() {
    this.$$auth.init([{ id: 'test' }])
  }
})
</script>
