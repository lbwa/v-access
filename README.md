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

> An authorization solution for Vue v2.x, including **elements** control and **routes** control.

<p align="center">
  <a href="./README.CN.md">中文指南</a>
</p>

|                   Peer dependencies                    |                     Required                     |
| :----------------------------------------------------: | :----------------------------------------------: |
|        [vue](https://www.npmjs.com/package/vue)        |                        ✔️                        |
| [vue-router](https://www.npmjs.com/package/vue-router) | Only required for `Vue.use(VAccess, { router })` |

## Features

- **Portable**: You only need to provide a current user access list without any complex initialization process, then `v-access` will provide all fully **element** and (or) **routes** access authorization functionalities.

- **Flexible**: Support any access data type with `id` field.

- **Dynamic**: Support any private routes dynamic addition.

- **Smooth**: Support dynamic routes reset **without any page reloading**.

- **Various**: Support static and private(dynamic) routes authorization.

## Installation

```bash
npm i v-access --save
```

## Prerequisites

All authorization functionalities are based on an access **list** which should be provided by your back-end services (inspired by [GCP Cloud IAM](https://cloud.google.com/storage/docs/access-control/iam)). Every element in the list represents a permission (ability) which is used to access a kind of back-end service functionalities. One or multiple permissions can be contained by one user role.

There is a best practice that uses syntax like `[scope].[module].[ability]` to represents the access of functionality, and `[scope]` is optional if you have no other external systems (scope).

For example, any user access list including `account.read` represents current user has capability to access `account` service. There is a user role named `seller` would be made of `order.read` and `product.read`, which means any user includes `seller` role can access `order` service and `product` service. A user role is similar to the abilities set. System administrators would use user roles to distribute access abilities to low-level user. Any single access shouldn't be distributed directly.

```ascii
                          +--> access 1
      +-----> user role 1 |
      |                   +--> access 2
      |
      |                   +--> access 3
user -+-----> user role 2 |
      |                   +--> access 4
      |
      |                   +--> access 5
      +-----> user role 3 |
                          +--> access 6
```

The access name is up to you. Whatever you name your access elements, you should invoke [init](#initialization) function to pass the access list for `v-access` initialization.

## Schema

- **One access** of user access list should has following structure:

  ```ts
  interface Access {
    // 'id' field is required
    id: string
    [key: string]: any
  }

  type AccessList = Access[]
  ```

- **One route** with access or weak access has specific structure in [here](#public-routes-authorization).

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

The following code describes that passing access list when you have fetched access-list anywhere.

```ts
// In any vue instance
fetchUserAccessList().then(({ list: userAccessList }: { list: Access[] }) =>
  this.$$auth.init(userAccessList)
)
```

## Element access control

`v-access` has provided **2** way to implement element access control.

1. `Vue` global component named `v-access`.

1. Verification functions which belong to `Vue` prototype property named `$$auth`

**NOTICE:** Global component `<v-access>` supports **multiple** child components.

### Single verification

Whether the current user has **ONE** access.

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

Whether the current user has **AT LEAST ONE** access.

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

Whether the current user has **ALL** access.

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

`v-access` has provided a reset function named `reset` which could be invoked to delete any access-list when the developer wants to rest current access container.

## Routes access control

If you want to implement routes access control based on `vue-router`, you should provide a `vue-router` instance and a preset routes first. Other options are optional.

|  Option  |           Required            |       Data type        |                                                           Description                                                           |
| :------: | :---------------------------: | :--------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
|  router  |              ✔️               |      `VueRouter`       |                                                     A `vue-router` instance                                                     |
|  routes  |        (default: `[]`)        |  `RouteWithAccess[]`   |                                              Preset routes list for access control                                              |
| redirect | (default: `/@v-access-error`) |        `string`        |                                                 Occurred by unauthorized access                                                 |
| exclude  |        (default: `[]`)        | `string[]` or `RegExp` | All of the routes matched `exclude` will skip authorization, even if it doesn't satisfy `access` or `weakAccess` field of route |

[route-config]: https://router.vuejs.org/api/#routes

```ts
import Vue from 'vue'
import router, { routes } from './router'

Vue.use(VAccess, { router, routes })
```

### Public routes authorization

> Public static routes are passed by the developer when `vue-router` initialization.

You only need to set `access` or `weakAccess` field of any routes if you want to authorize any public static routes.

1. Any element of `access` field MUST be satisfied, otherwise URL redirect will occur.

   > RouteConfig is a reference from official `vue-router` [documentation][route-config].

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

1. Current authorization will pass if at least one has to be satisfied.

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

As mentioned above, The developer passes a preset private route list in `Vue.use`. The `v-access` will generate the final private routes based on the current user's **access-list** and added to the current `vue-router` instance.

The data type of private routes provided by developer also supports `access` and `weakAccess` fields, the same as public routes.

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
       // This routes will be added when all elements have been satisfied
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
     // This routes will be added when at least one element has been satisfied
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

## With other hooks

[Separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) is a design principle for separating distinct parts, and implement the high cohesion and low coupling between multiple independent parts. [router.beforeEach] navigation guard accepts **multiple** hooks to implement a navigation pipe. This is the theoretical basis for `v-access` implementation. `v-access` has provided a solution for separating `authorizer` part. Developers couldn't care about how `authorizer` works anymore.

According to the above description, you can just pass other hooks into [router.beforeEach] if you need to add extra logic for navigation control.

```js
/* src/router/index.js */
const router = new VueRouter({
  // Omit options
})

/**
 * This part is your other navigation hook.
 * v-access doesn't care about whether extra hooks has been passed by the
 * developer, and only care about its **authorizer** works.
 */
router.beforeEach((to, from, next) => {
  /* Anything you want to do */
})

export default router
```

```js
/* src/plugins/v-access.js */
import Vue from 'vue'
import VAccess from 'v-access'
import router from '../router'

const routes = [/* Omit routes */]

Vue.use(VAccess, { router, routes }))
```

If you aren't familiar with how multiple global before hooks work, I strongly recommend you to read the documentation about [router.beforeEach].

[router.beforeeach]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

## Changelog

All notable changes to this project will be documented in [CHANGELOG](./CHANGELOG.md) file.

## License

MIT © [Bowen Liu](https://github.com/lbwa)
