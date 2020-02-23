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
</p>

> An authentication solution based on Vue.js v2.x, including **elements-based** control and **route-based** control.

> 一个基于 Vue.js v2.x 的前端权限控制方案。包含基于元素和基于路由的权限控制。

<p align="center">
  中文指南 | <a href="./README.md">English</a>
</p>

|                          依赖                          | 是否必须 |
| :----------------------------------------------------: | :------: |
|        [vue](https://www.npmjs.com/package/vue)        |    ✔️    |
| [vue-router](https://www.npmjs.com/package/vue-router) |    ✔️    |

## 特性

- **简约设计**: 只需要提供一个当前用户的能力（或称权限）列表即可拥有 **基于元素** 和 **基于路由** 的能力/权限验证。

- **平滑过渡**: 支持 **在不刷新页面的情况下** 新增和删除任意的动态私有路由。

## 安装

```bash
# using npm
npm i v-access

# using yarn
yarn add v-access
```

## 前提条件

- 能力类型

  ```ts
  type Ability = string
  ```

- 路由类型

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

  更多细节可见于 [此](#Initialization).

### 最佳实践

> 注意: 本章节只是一个最佳实践的 **推荐, 而不是必须**.

整个鉴权模块是基于由任意后端服务提供的 **一个能力/权限列表**. 每一个列表中的元素都表示一种用于访问相关联数据的能力。一个 _用户角色_ 可以由多个能力组成，并表示一个能力集合。一个真实的用户可以拥有多个用户角色。

存在一个最佳实践是使用形如 `[scope].[module].[ability]` (例如，[IAM](https://cloud.google.com/storage/docs/access-control/iam)) 的形式来表示一个能力。当然，如果你的能力值非常简单且不包含其他外部系统（作用域），那么 `[scope]` 是可以省略的。

这样设计的好处在于，多个用户或多个角色的能力值可以存在交集，多个能力值可以任意搭配形成一个 **灵活的能力值集合**。

接下来的图表表示了一个实际用户的能力集合：

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

无论你如何命名能力，你应该始终首先通过调用 [init](#Initialization) 函数，并传入一个完整的能力列表来完成初始化。

## 初始化

```ts
import Vue from 'vue'
import VAccess from 'v-access'

Vue.use(VAccess)
```

在初始化 `vue` 的根实例之前应该首先完成插件安装。以上语句会在 `Vue` 的全局环境中注册一个名为 `VAccess` 的全局组件，并注入一个 `Vue` 的原型属性，名为 `$$auth`。

```ts
import { init } from 'v-access'

export default {
  name: 'AnyComponent',

  // ... 省略无关属性

  created() {
    // 一个 vuex action 或 http 请求
    fetchAbilities(payload)
      .then(list => list.map(abilityInfo => ability.name)) // 序列化能力集合
      .then(abilities =>
        init(this, abilities, '/forbidden', [
          /* 任意全局预设私有路由集合。该集合首先会根据当前能力集合过滤，再添加到全局路由中 */
        ])
      )
      .catch(console.error)
  }
}
```

无论原始的能力值结构如何，你应该始终向 `init` 函数传递一个能力值的唯一标识列表（一个 `string[]` 类型）来完成全局的鉴权功能初始化。

```ts
export declare function init(
  vue: Vue,
  abilities: Ability[],
  redirect: string,
  routes?: RouteWithAbility[]
): void
```

注意：`redirect` 仅仅支持一个 [fullPath](https://router.vuejs.org/api/#route-object-properties) 字符串，并不支持路由定义对象。

你可能已经注意到了，你可以在最后一个参数传入一个预设的全局私有路由集合。该集合中的所有路由都会根据当前的能力集合生成最终的私有路由集合。最终将仅有通过能力集合测试的私有路由才会被添加到 `vue-router` 中。

### 场景

以上描述场景适用于首先具有一个预设全局私有路由集合，而你想根据当前能力集合来完成私有路由的过滤添加，只有符合当前能力集合的私有路由才会被添加到当前 `vue-router` 实例中。

## 如何验证能力

1. 使用基于元素的鉴权

   1. `VAccess` 组件

      ```html
      <v-access :ability="['github.repo.read', 'github.repo.pull']">
        <!-- 任意子组件或 HTML 元素 -->
      </v-access>

      <!-- 或 -->
      <v-access strict :ability="['github.repo.read', 'github.repo.pull']">
        <!-- 任意子组件或 HTML 元素 -->
      </v-access>

      <!-- 或 -->
      <v-access :ability="github.repo.read">
        <!-- 任意子组件或 HTML 元素 -->
      </v-access>
      ```

      |  属性   |           类型           |               描述               |
      | :-----: | :----------------------: | :------------------------------: |
      | ability | `Ability` 或 `Ability[]` |  需要被验证的单个能力或能力集合  |
      | strict  |        `boolean`         | 是否验证给定能力集合中的所有能力 |

   1. `$$auth` 对象

      `$$auth` 对象本质上是 `Set` 子类的实例，故支持所有 `Set` 的[原型方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Methods)。以下表格描述了额外的功能函数。

      |  Function  |                类型                 |            描述            |
      | :--------: | :---------------------------------: | :------------------------: |
      | verifyAll  | `(abilities: Ability[]) => boolean` | 验证是否满足所有给定的能力 |
      | verifySome | `(abilities: Ability[]) => boolean` |  验证是否满足至少一项能力  |

1) 使用基于路由的鉴权

   ```ts
   const routes = [
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
         // 或者
         // weak: ['github.repo.read', 'github.repo.pull'],
         // 或者
         // ability: 'github.repo.read'
       }
     }
   ]
   ```

   | Meta 属性 |            目标            |
   | :-------: | :------------------------: |
   | `strict`  | 验证是否满足所有给定的能力 |
   |  `weak`   |  验证是否满足至少一项能力  |
   | `ability` |   验证是否满足单个能力值   |

## 重置

```ts
export declare function reset(router: VueRouter): void
```

你应该始终使用 `reset(theCurrentRouterInstance)` 来保证在不重载页面的情况下，删除所有通过 `init` 函数添加的私有路由集合。

```ts
import { reset } from 'v-access'

reset(this.$router)
```

## 和其他 `hooks` 一起使用

[关注点分离](https://en.wikipedia.org/wiki/Separation_of_concerns) 是一个用于分离差异化模块并实现了 “高内聚，低耦合” 的设计原则。[Vue router 导航守卫][doc-router-beforeeach] 基于此实现了一个导航管道，并接受 **多个** 守卫函数。这是 `v-access` 实现基于路由鉴权的关键性原理。`v-access` 注入了一个扮演 `authorizer` 的角色的 `beforeEach` 全局前置导航守卫。

如果你对多个全局 `beforeEach` 导航守卫是如何工作的还不熟悉，强烈推荐阅读关于 `router.beforeEach` 的 [官方文档][doc-router-beforeeach]。

[doc-router-beforeeach]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

## Changelog

所有显著修改都会记录在 [CHANGELOG](./CHANGELOG.md) 文件中。

## License

MIT © [Bowen Liu](https://github.com/lbwa)
