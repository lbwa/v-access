import { RouterOptions, RouteConfig } from 'vue-router'
import VAccessCore from '@src/core'

declare module 'vue/types/vue' {
  interface Vue {
    access: string[] | string

    strict: boolean

    readonly $$auth: VAccessCore
  }
}
declare module 'vue-router/types/router' {
  interface VueRouter {
    options: RouterOptions
  }
}

export interface Access {
  readonly id: string
  readonly [accessKey: string]: any
}

export interface AccessMap {
  readonly [mapKey: string]: Access
}

export interface RouteWithAccess extends RouteConfig {
  readonly children?: RouteWithAccess[]
  readonly meta: {
    access: string[]
    [metaKey: string]: any
  }
}

export type UserGuard<T> = Function | Promise<T>
