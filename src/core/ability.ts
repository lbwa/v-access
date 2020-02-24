import { isString } from 'src/shared/utils'
import { VueConstructor } from 'vue'

export type Ability = string

/**
 * @issue Why not extends built-in object Set ?
 * @link https://github.com/Microsoft/TypeScript/issues/10853
 *
 * @issue Why not use Object.setPrototypeOf to redirect prototype object ?
 * TL,DR accessor performance issue
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
 * @link https://github.com/mobxjs/mobx/issues/1556
 */
export class AbilitiesSet {
  private _vm: Vue

  private _iterator(type: 'some' | 'every', abilities: Ability[]) {
    if (Array.isArray(abilities)) {
      return abilities[type](ability => this.has(ability))
    }
    if (isString(abilities)) {
      return this.has(abilities)
    }
    return false
  }

  /**
   * How we make state reactive?
   * https://github.com/vuejs/vuex/blob/v3.1.2/src/store.js#L60-L62
   * https://github.com/vuejs/vuex/blob/v3.1.2/src/store.js#L271-L281
   * @param Vue
   */
  constructor(Vue: VueConstructor) {
    this._vm = new Vue({
      data() {
        return {
          state: new Set<Ability>()
        }
      }
    })
  }

  get external() {
    return {
      has: (ability: Ability) => this.has(ability),
      verifyAll: (abilities: Ability[]) => this.verifyAll(abilities),
      verifySome: (abilities: Ability[]) => this.verifySome(abilities)
    }
  }

  get state(): Set<Ability> {
    return this._vm.$data.state
  }

  set state(val: Set<Ability>) {
    this._vm.$data.state = val
  }

  get size() {
    return this.state.size
  }

  assign(abilities: Ability[]) {
    this.state = new Set(abilities)
  }

  clear() {
    this.assign([])
  }

  has(ability: Ability) {
    return this.state.has(ability)
  }

  verifyAll(abilities: Ability[]) {
    return this._iterator('every', abilities)
  }

  verifySome(abilities: Ability[]) {
    return this._iterator('some', abilities)
  }
}
