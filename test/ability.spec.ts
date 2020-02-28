import { AbilitiesSet } from '../src/core/ability'
import Vue from 'Vue'

describe('AbilitiesSet', () => {
  let abilitiesSet: AbilitiesSet
  beforeEach(() => {
    abilitiesSet = new AbilitiesSet(Vue)
  })

  it('Should create a AbilitiesSet instance', () => {
    expect(abilitiesSet).toBeInstanceOf(AbilitiesSet)
    // https://stackoverflow.com/a/53483320
    expect(abilitiesSet['_vm']).toBeInstanceOf(Vue)
    expect(abilitiesSet['_vm'].$data.state).toBeInstanceOf(Set)
    expect(abilitiesSet['_vm'].$data.state.size).toEqual(0)
  })

  it('Should delegate properties', () => {
    expect(abilitiesSet['_vm'].$data.state).toEqual(abilitiesSet.state)
    expect(abilitiesSet.state.size).toEqual(abilitiesSet.size)
  })

  it('Should replace old state', () => {
    const abilities = ['github.repo.read', 'npm.pkg.upload']
    const oldState = abilitiesSet.state
    abilitiesSet.assign(abilities)
    expect(abilitiesSet.state === oldState).toBeFalsy()
    expect(abilitiesSet.size).toEqual(abilities.length)
  })

  it('Should clear state', () => {
    const abilities = ['github.repo.read', 'npm.pkg.upload']
    abilitiesSet.assign(abilities)
    expect(abilitiesSet.size).toEqual(abilities.length)
    abilitiesSet.clear()
    expect(abilitiesSet.size).toEqual(0)
  })

  it('Should verify abilities', () => {
    const abilities = ['github.repo.read', 'npm.pkg.upload']
    const someAbilities = ['github.repo.write', 'npm.pkg.upload']
    const falsyAbilities = ['github.branch.merge', 'github.action.activate']
    abilitiesSet.assign(abilities)
    expect(abilitiesSet.has(abilities[0])).toBeTruthy()
    expect(abilitiesSet.has(abilities[1])).toBeTruthy()
    expect(abilitiesSet.has('github.repo.write')).toBeFalsy()

    expect(abilitiesSet.verifyAll('github.branch.merge' as any)).toBeFalsy()
    expect(abilitiesSet.verifyAll(1 as any)).toBeFalsy()
    expect(abilitiesSet.verifyAll(abilities[0] as any)).toBeTruthy()
    expect(abilitiesSet.verifyAll(abilities)).toBeTruthy()
    expect(abilitiesSet.verifyAll(someAbilities)).toBeFalsy()
    expect(abilitiesSet.verifyAll(falsyAbilities)).toBeFalsy()

    expect(abilitiesSet.verifySome('github.branch.merge' as any)).toBeFalsy()
    expect(abilitiesSet.verifySome(1 as any)).toBeFalsy()
    expect(abilitiesSet.verifySome(abilities[0] as any)).toBeTruthy()
    expect(abilitiesSet.verifySome(abilities)).toBeTruthy()
    expect(abilitiesSet.verifySome(someAbilities)).toBeTruthy()
    expect(abilitiesSet.verifySome(falsyAbilities)).toBeFalsy()
  })
})
