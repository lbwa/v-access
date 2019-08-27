<template>
  <div id="app">
    <nav id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/vue">Vue.read</router-link> |
      <router-link to="/react">React.read</router-link> |
      <router-link to="/mongo">Optional access</router-link>
    </nav>
    <router-view />
    <section>
      <label>Current access:&nbsp;</label>
      <span>{{ JSON.stringify(Object.keys($$auth.map)) }}</span>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fetchUserAccess } from './api'

export default Vue.extend({
  name: 'AppEntry',

  async beforeCreate() {
    try {
      const { list } = await fetchUserAccess()
      this.$$auth.init(list)
    } catch (err) {
      /* eslint-disable-next-line */
      console.error(err.message || err)
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #61dafb;
    }
  }
}
</style>
