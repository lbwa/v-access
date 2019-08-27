<h1 align="center">v-access</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/v-access">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/v-access?logo=webpack&style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/v-access">
    <img alt="npm" src="https://img.shields.io/npm/dt/v-access?logo=Vue.js&style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/v-access">
    <img alt="npm" src="https://img.shields.io/npm/v/v-access?logo=npm&style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/v-access">
    <img alt="npm type definitions" src="https://img.shields.io/npm/types/v-access?logo=typescript&style=flat-square">
  </a>
  <a href="https://circleci.com/gh/lbwa/v-access">
    <img alt="Circle CI" src="https://circleci.com/gh/lbwa/v-access.svg?style=svg">
  </a>
</p>

> An authorization solutions for Vue v2.x, including **elements** control and **routes** control.

<p align="center">
  <a href="./README.CN.md">中文指南</a>
</p>

|                   Peer dependencies                    |                     Required                     |
| :----------------------------------------------------: | :----------------------------------------------: |
|        [vue](https://www.npmjs.com/package/vue)        |                        ✔️                        |
| [vue-router](https://www.npmjs.com/package/vue-router) | Only required for `Vue.use(VAccess, { router })` |

## Install

```bash
npm i v-access --save
```

## Schema

All authorization functionalities are based on a access **list** which should be provided by your any back-end services. Every element in the list represents an access to a kind of back-end service functionalities. For example, any user access list including `account.read` represents current user has access to `account` service. Your access name is up to you. Whatever you name your services, your should invoke [init](#initialization) function to pass access list for `v-access` initialization.

**One access** of user access list should has following structure:

```ts
interface Access {
  // 'id' field is required
  id: string
  [key: string]: any
}

type AccessList = Access[]
```

## Initialization

You **MUST** invoke `init` function which is belong to `Vue` prototype property named `$$auth` to pass current user **access list** before using `v-access` functionality.

1.  If you only need basic functionality without routes access control:

    ```ts
    import Vue from 'vue'
    import VAccess from 'v-access'

    Vue.use(VAccess.Basic) // Be careful to handle capital letter
    ```

2.  If you need fully functionalities including element and routes access control:

    ```ts
    import Vue from 'vue'
    import router from './router'
    import VAccess from 'v-access'

    // Vue-router instance is required if you pass VAccess into Vue.use
    Vue.use(VAccess, { router })
    ```

Following code describe that passing access list when you have fetched access list at anywhere.

```ts
// In any vue instance
fetchUserAccessList().then(({ list: userAccessList }: { list: Access[] }) =>
  this.$$auth.init(userAccessList)
)
```

## Element access control

`v-access` has provided **2** way to implement element access control.

1. `Vue` global component named `v-access`.

1. Verification functions which is belong to `Vue` prototype property named `$$auth`

**NOTICE:** Global component `<v-access>` only support **ONE** child element.

### Single verification

Whether current user has **ONE** access.

- function

```ts
this.$$auth.has('accessNameA')
```

- global component

```html
<v-access access="accessNameA">
  <main>Some content</main>
</v-access>
```

### Weak verification

Whether current user has **AT LEAST ONE** access.

- function

```ts
this.$$auth.weak(['accessNameA', 'accessNameB'])
// or alias
this.$$auth.weakList(['accessNameA', 'accessNameB'])
```

- global component

```html
<v-access :access="['accessNameA', 'accessNameA']">
  <main>Some content</main>
</v-access>
```

### Strict verification

Whether current user has **ALL** access.

- function

```ts
this.$$auth.strict(['accessNameA', 'accessNameB'])
// or alias
this.$$auth.strictList(['accessNameA', 'accessNameB'])
```

- global component

```html
<!-- DO NOT forget to set 'strict' as props -->
<v-access strict :access="['accessNameA', 'accessNameB']">
  <main>Some content</main>
</v-access>
```

## Routes access control

If you want to implement routes access control based on `vue-router`, your should provide a `vue-router` instance and a preset routes first. Other options is optional.

|   Option   | Required |              Data type              |              Description              |
| :--------: | :------: | :---------------------------------: | :-----------------------------------: |
|   router   |    ✔️    |              VueRouter              |        A `vue-router` instance        |
|   routes   |    ✔️    | Array<[RouteConfig][route-config]>  | preset routes list for access control |
|  redirect  |    -     |               string                |    Occurred by unauthorized access    |
| beforeEach |    -     | [NavigationGuard][navigation-guard] | Same as `vue-router` beforeEach guard |
| afterEach  |    -     |      [After hook][after-hook]       | Same as `vue-router` afterEach guard  |

[route-config]: https://router.vuejs.org/api/#routes
[navigation-guard]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
[after-hook]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-after-hooks

```ts
import Vue from 'vue'
import router, { routes, beforeEach, afterEach } from './router'

Vue.use(VAccess, { router, routes, beforeEach, afterEach })
```

## Changelog

All notable changes to this project will be documented in [CHANGELOG](./CHANGELOG.md) file.

## License

MIT © [Bowen Liu](https://github.com/lbwa)
