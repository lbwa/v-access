import { RouterOptions } from 'vue-router'
import VAccessCore from '@src/core'

declare module 'vue/types/vue' {
  interface Vue {
    access: string[] | string

    strict: boolean

    $$auth: VAccessCore
  }
}
declare module 'vue-router/types/router' {
  interface VueRouter {
    options: RouterOptions
  }
}

export interface Access {
  id: string
  [accessKey: string]: any
}

export interface AccessMap {
  [mapKey: string]: Access
}
