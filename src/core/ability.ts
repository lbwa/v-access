export type Ability = string

export class AbilitiesSet extends Set {
  // hack: used to resolve Set extending error
  // https://github.com/Microsoft/TypeScript/issues/10853
  static create(abilities: Ability[]) {
    const set = new Set(abilities)
    Object.setPrototypeOf(set, AbilitiesSet.prototype)
    return set as AbilitiesSet
  }

  verifyAll(abilityNames: Ability[]) {
    return abilityNames.every(name => this.has(name))
  }

  verifySome(abilityNames: Ability[]) {
    return abilityNames.some(name => this.has(name))
  }
}
