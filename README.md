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

> An authentication solution based on Vue.js v2.x, including **elements-based** control and **route-based** control.

<p align="center">
  <a href="./README.zh-cn.md">中文指南</a> | English
</p>

|                      Dependencies                      | Required |
| :----------------------------------------------------: | :------: |
|        [vue](https://www.npmjs.com/package/vue)        |    ✔️    |
| [vue-router](https://www.npmjs.com/package/vue-router) |    ✔️    |

## Features

- **Minimal design**: Only one _ability/privilege_ list and give you all **element-based** and **route-based** authentications.

- **Smooth changes**: Support any dynamic private routes addition and deletion **without page reloading**.

## Installation

```bash
# using npm
npm i v-access

# using yarn
yarn add v-access
```

## Prerequisites

- Ability type

  ```ts
  type Ability = string
  ```

- Routes type

  ```ts
  interface RouteWithAbility extends RouteConfig {
    readonly children?: RouteWithAbility[]
    readonly meta?: {
      strict?: Ability[]
      weak?: Ability[]
      ability?: Ability
      [key: string]: any
    }
  }
  ```

  More details could be found from [here](#Initialization).

### Best practice

> NOTICE: This section is only the best practice **recommendation, not required**.

The entire authorization system is based on **an ability/privilege list** provided by any back-end services. Every element in the list represents an ability that is used to access the corresponding database. A _user role_ consists of multiple abilities, represents an _ability set_. One actual user could have multiple user roles.

There is a best practice that uses syntax like `[scope].[module].[ability]` (eg. [IAM](https://cloud.google.com/storage/docs/access-control/iam)) to represents one ability. In this case, `[scope]` is optional if you have no other external systems (scope).

The advantage of this design is that the role of multiple users or the ability of multiple roles can be intersected. Multiple abilities can be arbitrarily combined to form a **flexible abilities set**.

The following chart represents an actual user's ability set:

```
                      +--> github.repo.read
      +-> user role 1 |
      |               +--> npm.org.import
      |
      |               +--> github.pull.read
user -+-> user role 2 |
      |               +--> npm.downloads.read
      |
      |               +--> github.action.read
      +-> user role 3 |
                      +--> npm.packages.publish
```

No matter what your ability name is, you should always call [init](#Initialization) function with a full ability list first.

## Initialization

```ts
import Vue from 'vue'
import VAccess from 'v-access'

Vue.use(VAccess)
```

This package should be installed **before** the root Vue instance creation. This process will inject a global component named `VAccess` and a prototype property named `$$auth`.

```ts
import { init } from 'v-access'

export default {
  name: 'AnyComponent',

  // ... omit all unrelated properties

  created() {
    // a vuex action or http request
    fetchAbilities(payload)
      .then(list => list.map(abilityInfo => ability.name)) // ability serialization
      .then(abilities =>
        init(this, abilities, '/forbidden', [
          /* routes which need to add to vue-router would be filtered by abilities first */
        ])
      )
      .catch(console.error)
  }
}
```

No matter the original abilities structure is, you should always pass an `Ability identity` list (a `string[]` type) to `init` function for initializing global authentication functionality.

```ts
export declare function init(
  vue: Vue,
  abilities: Ability[],
  redirect: string,
  routes?: RouteWithAbility[]
): void
```

NOTE: `redirect` only support a [fullPath](https://router.vuejs.org/api/#route-object-properties) string, not object type.

As you may have noticed, you can pass a global preset private routes collection to `init` function for dynamic routes addition. All valid private routes generation could be handled by this package and will be filtered by `abilities` set.

### Scenario

This case would be useful when you want to create private routes that need to be filtered by the current user abilities.

## How to authenticate ability

1. Using `element-based` authentication

   1. `VAccess` component

      ```html
      <v-access :ability="['github.repo.read', 'github.repo.pull']">
        <!-- any child components or HTML nodes -->
      </v-access>

      <!-- or -->
      <v-access strict :ability="['github.repo.read', 'github.repo.pull']">
        <!-- any child components or HTML nodes -->
      </v-access>

      <!-- or -->
      <v-access :ability="github.repo.read">
        <!-- any child components or HTML nodes -->
      </v-access>
      ```

      |  Props  |           Type           |                        Description                         |
      | :-----: | :----------------------: | :--------------------------------------------------------: |
      | ability | `Ability` or `Ability[]` |  An ability or ability set that needs to be authenticated  |
      | strict  |        `boolean`         | Whether we should authenticate every abilities in the list |

   1. `$$auth` object

      `$$auth` objects are essentially an instance of `Set` subclass. It supports all [prototype functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Methods) of `Set`. The following table describes several extra authentication functions.

      |  Function  |                Type                 |                           Description                           |
      | :--------: | :---------------------------------: | :-------------------------------------------------------------: |
      | verifyAll  | `(abilities: Ability[]) => boolean` |    Whether we should authenticate every ability in the list     |
      | verifySome | `(abilities: Ability[]) => boolean` | Whether we should authenticate at least one ability in the list |

1. Using `route-based` authentication

   ```ts
   const routes = [
     // This route always pass authentication
     {
       name: 'PublicRoutes',
       path: '/public',
       component: () =>
         import(/* webpackChunkName: 'page-public' */ './views/Public.vue')
     },
     {
       name: 'PrivateRoutes',
       path: '/private',
       component: () =>
         import(/* webpackChunkName: 'page-private' */ './views/Private.vue'),
       meta: {
         strict: ['github.repo.read', 'github.repo.pull']
         // or
         // weak: ['github.repo.read', 'github.repo.pull'],
         // or
         // ability: 'github.repo.read'
       }
     }
   ]
   ```

   | Meta prop |                            Objective                            |
   | :-------: | :-------------------------------------------------------------: |
   | `strict`  |    Whether we should authenticate every ability in the list     |
   |  `weak`   | Whether we should authenticate at least one ability in the list |
   | `ability` |         A single ability that needs to be authenticated         |

## Reset

```ts
export declare function reset(router: VueRouter): void
```

You should always use `reset(theCurrentRouterInstance)` to delete all private routes added by `init` function without any page reloading.

```ts
import { reset } from 'v-access'

reset(this.$router)
```

## With other hooks

[Separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) is a design principle for separating distinct parts, and implement the high cohesion and low coupling between multiple independent parts. [Vue router navigation guard][doc-router-beforeeach] accepts **multiple** hooks to implement a navigation pipeline via this principle. This is the theoretical basis for `v-access` implementation. `v-access` has provided an `authorizer` as a `beforeEach` guard.

If you aren't familiar with how multiple global `beforeEach` hooks work, I strongly recommend you to read [the documentation][doc-router-beforeeach] about `router.beforeEach`.

[doc-router-beforeeach]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

## Changelog

All notable changes to this package will be documented in [CHANGELOG](./CHANGELOG.md) file.

## License

MIT © [Bowen Liu](https://github.com/lbwa)
