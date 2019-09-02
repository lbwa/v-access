import { EnhanceVAccess, UNAUTHORIZED_ROUTE } from './core'
import VAccessComponent from './components/VAccess'
import { authorizer } from './core/guard'
import { assert } from './shared/_utils'

const install: typeof EnhanceVAccess.install = function(
  Vue,
  { router, routes = [], redirect = UNAUTHORIZED_ROUTE, exclude = [] }
) {
  assert(
    router,
    'You need to provide vue-router instance to create authorizer for routes.'
  )

  const auth = new EnhanceVAccess({ Vue, router, routes })

    // use this.$$auth.init() to pass accessList
  ;(Vue as any).util.defineReactive(Vue.prototype, '$$auth', auth)

  Vue.component('VAccess', VAccessComponent(Vue))

  router.beforeEach(authorizer({ auth, redirect, exclude }))
}

export default install
