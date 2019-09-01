<template>
  <div class="route-with-access">
    <div class="route-with-access">
      Restriction:&nbsp;none
    </div>
    <v-access access="react.read">
      <div class="v-access-component">
        Within <code>&lt;v-access&gt;</code> component:&nbsp;<code
          >react.read</code
        >
      </div>
      <div class="v-access-component">
        Within <code>&lt;v-access&gt;</code> component:&nbsp;<code
          >react.read</code
        >
      </div>
    </v-access>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'home'
})
</script>

<style lang="sass" scoped>
.v-access-component
  margin: 10px
  padding: 20px
  border: 1px solid #eeeeee
  border-radius: 5px
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
</style>
