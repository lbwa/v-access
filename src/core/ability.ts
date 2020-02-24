import { isString } from 'src/shared/utils'

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
  private _set: Set<Ability> = new Set()

  get external() {
    return {
      has: (ability: Ability) => this.has(ability),
      verifyAll: (abilities: Ability[]) => this.verifyAll(abilities),
      verifySome: (abilities: Ability[]) => this.verifySome(abilities)
    }
  }

  get size() {
    return this._set.size
  }

  private _iterator(type: 'some' | 'every', abilities: Ability[]) {
    if (Array.isArray(abilities)) {
      return abilities[type](ability => this.has(ability))
    }
    if (isString(abilities)) {
      return this.has(abilities)
    }
    return false
  }

  assign(abilities: Ability[]) {
    this._set = new Set(abilities)
  }

  clear() {
    this.assign([])
  }

  has(ability: Ability) {
    return this._set.has(ability)
  }

  verifyAll(abilities: Ability[]) {
    return this._iterator('every', abilities)
  }

  verifySome(abilities: Ability[]) {
    return this._iterator('some', abilities)
  }
}
