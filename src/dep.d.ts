import { AuthMethods } from './install'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $$auth: AuthMethods
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
