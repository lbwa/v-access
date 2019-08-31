import Vue from 'vue'
import VAccess from 'v-access'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $$auth: VAccess
  }
}
