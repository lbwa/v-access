<template>
  <div id="app">
    <h1 class="title">v-access with vue-router</h1>
    <subtitle />
    <nav id="nav">
      <router-link class="nav__link" to="/">Home</router-link>
      <router-link class="nav__link" to="/vue"
        >vue.read <strong>AND</strong> vue.write</router-link
      >
      <router-link class="nav__link" to="/react">react.read</router-link>
      <router-link class="nav__link" to="/mongo"
        >vue.write <strong>OR</strong> react.read</router-link
      >
    </nav>
    <router-view class="router-view" />
    <section class="access-list">
      <label>Access list of current user:&nbsp;</label>
      <span>{{ JSON.stringify(Object.keys($$auth.map)) }}</span>
    </section>
    <loading :loading="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fetchUserAccess } from './api'
import Loading from './components/Loading.vue'
import Subtitle from './components/Subtitle.vue'

export default Vue.extend({
  name: 'AppEntry',

  data() {
    return {
      loading: false
    }
  },

  components: {
    Loading,
    Subtitle
  },

  async created() {
    this.loading = true
    try {
      const { list } = await fetchUserAccess()
      this.$$auth.init(list)
    } catch (err) {
      /* eslint-disable-next-line */
      console.error(err.message || err)
    }
    this.loading = false
  }
})
</script>

<style lang="sass" scoped>
#nav
  padding: 30px

.title
  text-transform: capitalize

.nav
  &__link
    & + &::before
      margin: 0 5px
      content: '|'

.router-view
  margin: 20px 40px 40px
  padding: 20px
  border: 1px solid #eeeeee
  border-radius: 5px

.access-list
  margin-top: 40px
</style>

<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

a
  color: #2c3e50

  &.router-link-exact-active
    color: #61dafb
</style>
