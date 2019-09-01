<template>
  <div id="app">
    <h1 class="title">v-access with vue-router</h1>
    <p class="subtitle">
      <a class="subtitle__badge" href="https://www.npmjs.com/package/v-access">
        <img
          alt="npm"
          src="https://img.shields.io/npm/v/v-access?logo=npm&style=flat"
        />
      </a>
      <a
        class="subtitle__badge"
        href="https://github.com/lbwa/v-access/actions"
      >
        <img
          alt="Unit test workflow"
          src="https://github.com/lbwa/v-access/workflows/Unit%20test/badge.svg"
        />
      </a>
    </p>
    <section class="access-list">
      <label>Access list of current user:&nbsp;</label>
      <span
        class="access-list__item"
        v-for="access of $$auth.map"
        :key="access.id"
        ><code>{{ access.id }}</code></span
      >
    </section>
    <loading :loading="loading" />

    <div class="navigation">
      <ul class="nav">
        <li class="nav__item">
          <router-link class="nav__item__link" to="/"
            >Public routes without any authorization</router-link
          >
        </li>
        <li class="nav__item">
          <router-link class="nav__item__link" to="/angular"
            >Public routes with strict authorization
            (<code>vue.write</code>)</router-link
          >
        </li>
        <li class="nav__item">
          <router-link class="nav__item__link" to="/vue"
            >Private route with strict authorization (<code>vue.read</code>
            <strong>AND</strong> <code>vue.write</code>)</router-link
          >
        </li>
        <li class="nav__item">
          <router-link class="nav__item__link" to="/react"
            >Private route with strict authorization
            (<code>react.read</code>)</router-link
          >
        </li>
        <li class="nav__item">
          <router-link class="nav__item__link" to="/mongo"
            >Private route with weak authorization (<code>vue.write</code>
            <strong>OR</strong> <code>react.read</code>)</router-link
          >
        </li>
      </ul>
      <div class="router-view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { fetchUserAccess } from './api'
import Loading from './components/Loading.vue'

export default Vue.extend({
  name: 'AppEntry',

  data() {
    return {
      loading: false
    }
  },

  components: {
    Loading
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
.title
  text-transform: capitalize

.subtitle
  text-align: center

  &__badge
    & + &
      margin-left: 5px

.navigation
  display: flex

.nav
  flex: 1
  margin: 0
  padding: 30px
  list-style: none

  &__item
    margin: 10px 0

    &__link
      & + &::before
        margin: 0 5px
        content: '|'

.router-view
  flex: 1
  display: flex
  flex-direction: column
  justify-content: center
  margin: 30px
  padding: 20px
  border: 1px solid #eeeeee
  border-radius: 5px
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)

.access-list
  margin-top: 40px

  &__item
    & + &
      &::before
        margin-right: 5px
        content: ','
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
  text-decoration: none

  &:hover
    text-decoration: dotted underline

  &.router-link-exact-active
    color: #61dafb

code
  padding: 4px 8px
  background-color: #0366d6
  border-radius: 3px
  color: white
</style>
