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

export type AuthMethods = {
  has: AbilitiesSet['has']
  verifyAll: AbilitiesSet['verifyAll']
  verifySome: AbilitiesSet['verifySome']
}

let abilitiesSet: AbilitiesSet | null = null

function isVue(val: object): val is Vue {
  return (
    Object.hasOwnProperty.call(val, '_isVue') &&
    (val as Record<'_isVue', boolean>)._isVue
  )
}

export default {
  install(Vue: VueConstructor) {
    Vue.component('VAccess', registerVAComponent(Vue))

    abilitiesSet = new AbilitiesSet(Vue)

    Object.defineProperty(Vue.prototype, '$$auth', {
      enumerable: true,
      get(): AuthMethods {
        return {
          has: (ability: Ability) => abilitiesSet!.has(ability),
          verifyAll: (abilities: Ability[]) =>
            abilitiesSet!.verifyAll(abilities),
          verifySome: (abilities: Ability[]) =>
            abilitiesSet!.verifySome(abilities)
        }
      }
    })
  }
}

interface InitOptions {
  vm: Vue | VueRouter
  abilities: Ability[]
  redirect: string
  routes?: RouteWithAbility[]
}

export function init({ vm, abilities, redirect, routes = [] }: InitOptions) {
  invariant(vm, 'MUST has a Vue/VueRouter instance as vm.')
  invariant(
    abilitiesSet,
    'MUST call Vue.use(VAccess) before starting initialization.'
  )
  invariant(
    isString(redirect) && /^\/./.test(redirect),
    `"Redirect" MUST be a vue-router fullPath (string type) and we got ${Object.prototype.toString.call(
      redirect
    )}.`
  )

  abilitiesSet.assign(abilities)

  let router: VueRouter
  if (isVue(vm)) {
    invariant(vm.$root.$options.router, 'Should work with vue-router')
    router = vm.$root.$options.router
  } else {
    router = vm
  }

  addRoutes(router, routes, abilitiesSet)
  router.beforeEach(registerAuthorizer(redirect, abilitiesSet))
}

export function reset(router: VueRouter) {
  invariant(abilitiesSet, 'MUST call init function first.')
  invariant(router, 'Should provide a vue-router instance.')
  removeRoutes(router)
  abilitiesSet.clear()
}
