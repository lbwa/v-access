import Vue, { VueConstructor } from 'vue'
import invariant from 'tiny-invariant'
import registerVAComponent from './components/VAccess'
import { AbilitiesSet, Ability } from './core/ability'
import {
  addRoutes,
  registerAuthorizer,
  RouteWithPrivilege
} from './core/routes'

const abilitiesRef: Record<'current', AbilitiesSet | null> = {
  current: null
}

export function install(Vue: VueConstructor) {
  Vue.component('VAccess', registerVAComponent(Vue))

  Object.defineProperty(Vue.prototype, '$$verify', {
    get() {
      return abilitiesRef.current
    }
  })
}

export default install

export function init(
  vue: Vue,
  abilities: Ability[],
  routes: RouteWithPrivilege[],
  redirect: string
) {
  abilitiesRef.current = AbilitiesSet.create(abilities)

  let _root = vue
  while (!_root.$options.router && _root.$parent) {
    _root = _root.$parent
  }

  invariant(_root.$options.router, 'Should work with vue-router')

  addRoutes(_root.$options.router!, routes, abilitiesRef.current)
  _root.$options.router!.beforeEach(
    registerAuthorizer(redirect, abilitiesRef.current)
  )
}
