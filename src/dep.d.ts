import { BasicVAccess, EnhanceVAccess } from './core'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $$auth: BasicVAccess | EnhanceVAccess
  }

  interface VueConstructor {
    readonly util: {
      // https://github.com/vuejs/vue/blob/d7d8ff06b70cf1a2345e3839c503fdb08d75ba49/src/core/observer/index.js#L135-L194
      defineReactive: (
        obj: object,
        key: string,
        value: any,
        customSetter?: Function,
        shallow?: boolean
      ) => void
    }
  }
}

declare module 'vue-router/types/router' {
  interface VueRouter {
    options: RouterOptions

    // https://github.com/vuejs/vue-router/blob/v3.1.2/src/create-matcher.js#L11-L14
    matcher: {
      match: (
        raw: RawLocation,
        current?: Route,
        redirectedFrom?: Location
      ) => Route
      addRoutes: (routes: RouteConfig[]) => void
    }
  }
}
