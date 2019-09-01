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
  <a href="https://github.com/lbwa/v-access/actions">
    <img alt="Unit test workflow" src="https://github.com/lbwa/v-access/workflows/Unit%20test/badge.svg">
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

## Features

- **Portable**: You only need to provide a current user access list without any complex initialization process, then `v-access` will provide all fully **element** and (or) **routes** access authorization functionalities.

- **Flexible**: Support any access data type with `id` fleid.

- **Dynamic**: Support any private routes dynamic addition.

- **Smooth**: Support dynamic routes reset **without any page reloading**.

- **Various**: Support static and private(dynamic) routes authorization.

## Installation

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

**NOTICE:** Global component `<v-access>` supports **multiple** child components.

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

### Access reset

`v-access` has provided a reset function named `reset` which could be invoked to delete any access list when developer want to rest current access container.

## Routes access control

If you want to implement routes access control based on `vue-router`, your should provide a `vue-router` instance and a preset routes first. Other options is optional.

|  Option  | Required |             Data type              |              Description              |
| :------: | :------: | :--------------------------------: | :-----------------------------------: |
|  router  |    ✔️    |             VueRouter              |        A `vue-router` instance        |
|  routes  |    ✔️    | Array<[RouteConfig][route-config]> | Preset routes list for access control |
| redirect |    -     |               string               |    Occurred by unauthorized access    |

[route-config]: https://router.vuejs.org/api/#routes

```ts
import Vue from 'vue'
import router, { routes } from './router'

Vue.use(VAccess, { router, routes })
```

### Public routes authorization

> Public static routes is passed by developer when `vue-router` initialization.

You only need to set `access` or `weakAccess` field of any routes if you want to authorize any public static routes.

1. Any element of `access` field MUST be satisfied, otherwise url redirect will be occurred.

   ```ts
   interface PublicRoutesWithStrictAuth extends RouteConfig {
     meta: {
       access: string[]
     }
   }
   ```

   ```ts
   {
     path: '/private-routes',
     component: () => import('@/views/Private'),
     meta: {
       access: [
         'admin',
         'mongo.read'
       ]
     }
   }
   ```

1. Current authorization will pass if at least one has be satisfied.

   ```ts
   interface PublicRouesWithWeakAuth extends RouteConfig {
     meta: {
       weakAccess: string[]
     }
   }
   ```

   ```ts
   {
     path: '/private-routes',
     component: () => import('@/views/Private'),
     meta: {
       weakAccess: [
         'admin',
         'mongo.read',
         'sql.read'
       ]
     }
   }
   ```

**NOTICE：** Any routes without `access` or `weakAccess` fields will pass routes authorization by default.

### Private routes authorization

> Private dynamic routes are come from `Vue.use(VAccess, { router, routes }`.

As mentioned above, The developer passes a preset private route list in `Vue.use`. The `v-access` will generate the final private routes based on the current user's **access list** and added to the current `vue-router` instance.

The data type of private routes provided by developer also supports `access` and `weakAccess` fields, same as public routes.

1. Strict authorization, same as public routes

   ```ts
   interface PrivateRoutesWithStrictAuth extends RouteConfig {
     meta: {
       access: string[]
     }
   }
   ```

   ```ts
   {
     path: '/private-routes',
     component: () => import('@/views/Private'),
     meta: {
       // This routes will be added when all elements has been satisfied
       access: [
         'admin',
         'mongo.read'
       ]
     }
   }
   ```

1. Weak authorization, same as public routes

   ```ts
   interface PrivateRoutesWithWeakAuth extends RouteConfig {
     meta: {
       weakAccess: string[]
     }
   }
   ```

   ```ts
   {
     path: '/private-routes',
     component: () => import('@/views/Private'),
     // This routes will be added when at least one elements has been satisfied
     meta: {
       weakAccess: [
         'admin',
         'mongo.read',
         'sql.read'
       ]
     }
   }
   ```

### Routes reset

As with [access resets](#access-reset), the current access container will be reset without page reloading when developer calls `this.$$auth.reset()` with `Vue.use(VAccess, options)`.

## Changelog

All notable changes to this project will be documented in [CHANGELOG](./CHANGELOG.md) file.

## License

MIT © [Bowen Liu](https://github.com/lbwa)
