import invariant from 'tiny-invariant'
import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import registerVAComponent from './components/VAccess'
import { AbilitiesSet, Ability } from './core/ability'
import {
  addRoutes,
  registerAuthorizer,
  removeRoutes,
  RouteWithAbility
} from './core/routes'

let isInitialized = false
const abilitiesRef: Record<'current', AbilitiesSet | null> = {
  current: null
}

function isString(val: any): val is string {
  return typeof val === 'string'
}

export default {
  install(Vue: VueConstructor) {
    Vue.component('VAccess', registerVAComponent(Vue))

    Object.defineProperty(Vue.prototype, '$$auth', {
      get() {
        return abilitiesRef.current
      }
    })
  }
}

export function init(
  vue: Vue,
  abilities: Ability[],
  redirect: string,
  routes: RouteWithAbility[] = []
) {
  invariant(
    isString(redirect),
    `"Redirect" MUST be a vue-router fullPath (string type) and we got ${Object.prototype.toString.call(
      redirect
    )}.`
  )
  if (isInitialized) return
  isInitialized = true

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

export function reset(router: VueRouter) {
  invariant(router, 'Should provide a vue-router instance.')
  removeRoutes(router)
  isInitialized = false
  abilitiesRef.current = null
}
