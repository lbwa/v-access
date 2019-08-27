<template>
  <div id="app">
    <div class="map">
      <p>Current access map:</p>
      <p>{{ $$auth.map }}</p>
    </div>
    <v-access access="vue.read"
      ><p>
        Component verification: <strong>vue.read</strong>&nbsp;access
      </p></v-access
    >
    <p>
      Has <strong>react.read</strong>&nbsp;access ?
      <span>{{ $$auth.has('react.read') }}</span>
    </p>
    <p>
      Has <strong>vue.read</strong>&nbsp;access ?
      <span>{{ $$auth.has('vue.read') }}</span>
    </p>
    <p>
      Has <strong>react.read</strong> or <strong>vue.read</strong> access ?
      <span>{{ $$auth.weak(['react.read', 'vue.read']) }}</span>
    </p>
    <p>
      Has <strong>read.read</strong> and <strong>vue.read</strong> access ?
      <span>{{ $$auth.strict(['react.read', 'vue.read']) }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  created() {
    this.$$auth.init([
      {
        id: 'vue.read'
      }
    ])
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.map {
  margin: 0 auto;
  width: 30%;
  border: 1px solid #eeeeee;
  border-radius: 5px;
}
</style>
