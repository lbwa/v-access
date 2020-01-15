import { EnhanceVAccess, UNAUTHORIZED_ROUTE } from './core'
import VAccessComponent from './components/VAccess'
import { authorizer } from './core/guard'
import { accessMap } from './core/map'

const install: typeof EnhanceVAccess.install = function(
  Vue,
  { router, routes = [], redirect = UNAUTHORIZED_ROUTE, exclude = [] }
) {
  if (!router) {
    throw new Error(
      'You need to provide a vue-router instance for routes authorizer.'
    )
  }

  const auth = new EnhanceVAccess({ Vue, router, routes })

  // Only make $$auth.map reactive
  // for better compatibilities use Vue.util.defineReactive,
  // instead Vue.observable(only supported by Vue v2.6.0+)
  Vue.util.defineReactive(auth, 'map', accessMap)
  Vue.prototype.$$auth = auth

  Vue.component('VAccess', VAccessComponent(Vue))

  router.beforeEach(authorizer({ auth, redirect, exclude }))
}

export default install
