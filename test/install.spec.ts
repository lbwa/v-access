import Vue from 'vue'
import plugin, { init, reset } from '../src/install'

describe('Install', () => {
  let routerPrototype: any
  let router: any
  jest.spyOn(console, 'log')

  beforeEach(() => {
    routerPrototype = {
      constructor: jest.fn(() => ({
        tag: 'new tag'
      })),
      beforeEach: jest.fn(),
      addRoutes: jest.fn()
    }
    router = Object.create(routerPrototype)
    router.matcher = {
      tag: 'should be deleted'
    }
  })

  it('Should reset function throws a error before init calling', () => {
    expect(() => {
      reset(router)
    }).toThrowError()
  })

  it('Should reset function throws a error without vue-router instance', () => {
    expect(() => {
      reset(undefined as any)
    }).toThrowError()
  })

  it('Should init function throws a error before installing plugin', () => {
    expect(() => {
      init({
        vm: router,
        abilities: [],
        redirect: '/forbidden'
      })
    }).toThrowError()
  })

  it('Should Vue installs plugin', () => {
    plugin.install(Vue)

    expect(Vue.prototype.$$auth).toBeDefined()
    expect(Vue.prototype.$$auth.has).toBeInstanceOf(Function)
    expect(Vue.prototype.$$auth.verifyAll).toBeInstanceOf(Function)
    expect(Vue.prototype.$$auth.verifySome).toBeInstanceOf(Function)
    const vm: any = new Vue({})
    expect(() => {
      vm.$$auth = {}
    }).toThrowError()
  })

  it('Should reset function throws a error without correct fullPath', () => {
    expect(() => {
      init({
        vm: router,
        abilities: [],
        redirect: 'forbidden'
      })
    }).toThrowError()
  })

  it('Should init function works with vue-router', () => {
    init({
      vm: router,
      abilities: ['github.repo.read', 'npm.org.read'],
      redirect: '/forbidden'
    })
    expect(routerPrototype.addRoutes).toHaveBeenCalledTimes(1)
    expect(routerPrototype.beforeEach).toHaveBeenCalledTimes(1)
    expect(routerPrototype.beforeEach.mock.calls[0][0]).toBeInstanceOf(Function)
  })

  it('Should prototype functions work', () => {
    const vm: any = new Vue({})
    expect(vm.$$auth.has('github.repo.read')).toBeTruthy()
    expect(vm.$$auth.has('github.repo.add')).toBeFalsy()
    expect(
      vm.$$auth.verifySome(['github.repo.read', 'github.repo.add'])
    ).toBeTruthy()
    expect(
      vm.$$auth.verifySome(['github.repo.add', 'npm.org.write'])
    ).toBeFalsy()
    expect(
      vm.$$auth.verifyAll(['github.repo.read', 'npm.org.read'])
    ).toBeTruthy()
    expect(
      vm.$$auth.verifyAll(['github.repo.read', 'npm.org.write'])
    ).toBeFalsy()
  })

  it('Should reset function works', () => {
    reset(router)
    expect(routerPrototype.constructor).toBeCalledTimes(1)
    expect(router.matcher).toBeUndefined()
  })

  it('Should init function works with vue instance', () => {
    const rootVue: any = {
      $options: {
        router
      },
      _isVue: true
    }
    rootVue.$root = rootVue
    const childVue: any = {
      $root: rootVue,
      _isVue: true
    }
    init({
      vm: childVue,
      abilities: [],
      redirect: '/forbidden'
    })

    expect(routerPrototype.addRoutes).toHaveBeenCalledTimes(1)
    expect(routerPrototype.beforeEach).toHaveBeenCalledTimes(1)
    expect(routerPrototype.beforeEach.mock.calls[0][0]).toBeInstanceOf(Function)
  })
})
