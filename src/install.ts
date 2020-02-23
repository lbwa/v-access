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
export { Ability } from './core/ability'
export { RouteWithAbility } from './core/routes'

let isInitialized = false
const abilitiesRef: Record<'current', AbilitiesSet | null> = {
  current: null
}

function isString(val: any): val is string {
  return typeof val === 'string'
}

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
        return abilitiesRef.current
      }
    })
  }
}

export function init(
  instance: Vue | VueRouter,
  abilities: Ability[],
  redirect: string,
  routes: RouteWithAbility[] = []
) {
  invariant(
    isString(redirect) && /^\/./.test(redirect),
    `"Redirect" MUST be a vue-router fullPath (string type) and we got ${Object.prototype.toString.call(
      redirect
    )}.`
  )
  invariant(
    !isInitialized,
    `
  You are trying to init multiple times.
  You should call "reset(theCurrentRouterInstance)" function first if you want to update global ability set.
  `
  )
  isInitialized = true

  abilitiesRef.current = AbilitiesSet.create(abilities)

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

  addRoutes(router, routes, abilitiesRef.current)
  router.beforeEach(registerAuthorizer(redirect, abilitiesRef.current))
}

export function reset(router: VueRouter) {
  invariant(router, 'Should provide a vue-router instance.')
  removeRoutes(router)
  isInitialized = false
  abilitiesRef.current = null
}
