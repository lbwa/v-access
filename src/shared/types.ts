import { RouteConfig } from 'vue-router'
import VAccessCore from '../core'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $$auth: VAccessCore
  }
}

declare module 'vue-router/types/router' {
  interface VueRouter {
    options: any

    // https://github.com/vuejs/vue-router/blob/v3.1.2/src/create-matcher.js#L11-L14
    // matcher: {
    //   match: (
    //     raw: RawLocation,
    //     current?: Route,
    //     redirectedFrom?: Location
    //   ) => Route
    //   addRoutes: (routes: RouteConfig[]) => void
    // }
    matcher: any
  }
}

export interface Access {
  readonly id: string
  readonly [accessKey: string]: any
}

export interface AccessMap {
  readonly [accessIdKey: string]: Access
}

export interface RouteWithAccess extends RouteConfig {
  readonly children?: RouteWithAccess[]
  readonly meta?: {
    access?: string[]
    weakAccess?: string[]
    [metaKey: string]: any
  }
}

export type UserGuard<T> = Function | Promise<T>
