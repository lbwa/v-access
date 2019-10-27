import { EnhanceVAccess, UNAUTHORIZED_ROUTE } from './core'
import VAccessComponent from './components/VAccess'
import { authorizer } from './core/guard'
import VueRouter from 'vue-router'

const install: typeof EnhanceVAccess.install = function(
  Vue,
  { router, routes = [], redirect = UNAUTHORIZED_ROUTE, exclude = [] }
) {
  if (!(router instanceof VueRouter)) {
    throw new Error(
      'You need to provide a vue-router instance for routes authorizer.'
    )
  }

  const auth = new EnhanceVAccess({ Vue, router, routes })

  // make $$auth is reactivity
  // for better compatibilities use Vue.util.defineReactive,
  // instead Vue.observable(only supported by Vue v2.6.0+)
  Vue.util.defineReactive(Vue.prototype, '$$auth', auth)

  Vue.component('VAccess', VAccessComponent(Vue))

  router.beforeEach(authorizer({ auth, redirect, exclude }))
}

export default install
