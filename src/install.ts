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
import { isString } from './shared/utils'
export { Ability } from './core/ability'
export { RouteWithAbility } from './core/routes'

const abilitiesSet: AbilitiesSet = new AbilitiesSet()

function isVue(val: object): val is Vue {
  return (
    Object.hasOwnProperty.call(val, '_isVue') &&
    (val as Record<'_isVue', boolean>)._isVue
  )
}

export default {
  install(Vue: VueConstructor) {
    Vue.component('VAccess', registerVAComponent(Vue))

    Object.defineProperty(Vue.prototype, '$$auth', {
      get() {
        return abilitiesSet.external
      }
    })
  }
}

interface InitOptions {
  instance: Vue | VueRouter
  abilities: Ability[]
  redirect: string
  routes?: RouteWithAbility[]
}

export function init({
  instance,
  abilities,
  redirect,
  routes = []
}: InitOptions) {
  invariant(
    isString(redirect) && /^\/./.test(redirect),
    `"Redirect" MUST be a vue-router fullPath (string type) and we got ${Object.prototype.toString.call(
      redirect
    )}.`
  )

  abilitiesSet.assign(abilities)

  let router: VueRouter
  if (isVue(instance)) {
    let current = instance
    while (!current.$options.router && current.$parent) {
      current = current.$parent
    }

    invariant(current.$options.router, 'Should work with vue-router')
    router = current.$options.router
  } else {
    router = instance
  }

  addRoutes(router, routes, abilitiesSet)
  router.beforeEach(registerAuthorizer(redirect, abilitiesSet))
}

export function reset(router: VueRouter) {
  invariant(router, 'Should provide a vue-router instance.')
  removeRoutes(router)
  abilitiesSet.clear()
}
