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

> 一个基于 `Vue` v2.x 版本的权限解决方案，其中包含 **元素** 控制和 **路由** 控制。

<p align="center">
  <a href="./README.md">English guide</a>
</p>

|                   Peer dependencies                    |                      Required                      |
| :----------------------------------------------------: | :------------------------------------------------: |
|        [vue](https://www.npmjs.com/package/vue)        |                         ✔️                         |
| [vue-router](https://www.npmjs.com/package/vue-router) | 仅在调用 `Vue.use(VAccess, { router })` 时是必须的 |

## Features

- **易用性**: 开发者只需要提供一个当前用户的 **权限列表**，且不含任意的复杂初始化流程。之后，`v-access` 将提供完整的 **元素** 级或 **路由** 级别的前端权限认证功能。

- **拓展性**: 支持任意具有 `id` 属性的权限数据结构。

- **动态性**: 支持任意的基于 `权限列表` 的动态路由添加。

- **平滑性**: 支持在 **没有任意的页面重载（刷新）** 的情况下，清除动态添加的私有路由（常用于用户注销登陆）。

- **多样性**: 同时支持任意的静态和私有（动态）路由认证功能。

## 安装

```bash
npm i v-access --save
```

## 先决条件

`v-access` 所有认证功能都是基于从服务端提供的一个当前用户的 **权限列表** 来实现的（受启发于 [GCP Cloud IAM](https://cloud.google.com/storage/docs/access-control/iam)）。该权限列表中的每一项元素都表明了一个服务端的权限。并且一个或多个权限可组成为一个用户角色。

存在一个最佳实践，使用形如 `[scope].[module].[ability]` 的单个权限格式来表示一个功能的访问权限，并且 `[scope]` 在没有其他外部系统（作用域）的情况下是可选的。

例如，任意包含 `account.read` 的用户权限列表，都表明当前用户可访问服务端的 `account` 服务。当存在一个由 `order.read` 和 `product.read` 组成的名为 `seller` 的用户角色时，任意包含该 `seller` 用户角色的用户都可以访问 `order` 服务和 `product` 服务。此处的用户角色本质上就是用户的能力集合。系统管理员可分配指定的用户角色给任意低级别用户。任意单个 `access` 都不应直接分配给低级别用户。

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

值得注意的是，任意的权限名称取决于你自己，`v-access` 并不限制单个权限名称的格式。无论你如何命名服务端的各项服务名称，你都应该首先在获取到当前用于的权限列表后，立即调用 [init](#initialization) 函数，并传入当前权限列表来完成 `v-access` 的认证模块的初始化。

## 数据结构

- **任意一个** 权限列表中的单个服务权限都应遵顼以下结构：

  ```ts
  interface Access {
    // 'id' 字段是唯一，且必须的
    id: string
    [key: string]: any
  }

  type AccessList = Access[]
  ```

- **一个** 具有权限认证的路由应该遵顼 [此数据结构](#公有静态路由权限认证)。

## 初始化

在使用所有 `v-access` 提供的功能之前，你必须首先调用一个 `vue` 原型方法 `$$auth.init`，并传入当前用户的权限列表来完成功能初始化。

1.  当你仅仅只需要使用 **除开** 路由验证的基本的权限功能时：

    ```ts
    import Vue from 'vue'
    import VAccess from 'v-access'

    Vue.use(VAccess.Basic) // 注意此处的大写属性
    ```

2.  当你需要使用包含元素和路由权限验证的完成权限验证功能时：

    ```ts
    import Vue from 'vue'
    import router from './router'
    import VAccess from 'v-access'

    // 当调用 Vue.use 传入 VAccess 时，vue-router 实例是必须的。
    Vue.use(VAccess, { router })
    ```

以下代码描述了当你在任意模块中获取到当前用户的权限列表后，如何传入到初始化函数中。

```ts
// 在任意 vue 组件中
fetchUserAccessList().then(({ list: userAccessList }: { list: Access[] }) =>
  this.$$auth.init(userAccessList)
)
```

## 元素级权限控制

`v-access` 提供了 **2** 种元素控制的方式：

1. 一个名为 `v-access` 的 `vue` 全局组件。

1. 一些用于认证的 `vue` 原型方法 `$$auth`。

**注意：** 全局组件 `<v-access>` 同时支持 **多个** 子元素。

### 单一验证

当前用户是否有 **某一** 权限。

- 函数

```ts
this.$$auth.has('accessNameA')
```

- 全局组件

```html
<v-access access="accessNameA">
  <main>Some content</main>
</v-access>
```

### 弱验证

当前用户是否 **至少包含一项** 给定列表中的项。

- 函数

```ts
this.$$auth.weak(['accessNameA', 'accessNameB'])
// 别名
this.$$auth.weakList(['accessNameA', 'accessNameB'])
```

- 全局组件

```html
<v-access :access="['accessNameA', 'accessNameA']">
  <main>Some content</main>
</v-access>
```

### 强验证

当前用户是否具有 **所有** 给定的权限列表的项。

- 函数

```ts
this.$$auth.strict(['accessNameA', 'accessNameB'])
// 别名
this.$$auth.strictList(['accessNameA', 'accessNameB'])
```

- 全局组件

```html
<!-- 不要忘了设置 'strict' -->
<v-access strict :access="['accessNameA', 'accessNameB']">
  <main>Some content</main>
</v-access>
```

### 权限重置

`v-access` 实例提供了一个 `reset` 方法，当开发者需要重置当前的权限容器时，调用 `this.$$auth.reset()` 即可将容器清空。

## 路由权限认证

当你想要实现基于 `vue-router` 的路由权限认证时，你应提供一个 `vue-router` 实例和一个预设的私有路由集合。剩余的其他选项都是可选的。

|  Option  |           Required           |      Data type      |                                               Description                                                |
| :------: | :--------------------------: | :-----------------: | :------------------------------------------------------------------------------------------------------: |
|  router  |              ✔️              |     `VueRouter`     |                                          一个 `vue-router` 实例                                          |
|  routes  |        (默认值：`[]`)        | `RouteWithAccess[]` |                                        用于权限控制的预设路由集合                                        |
| redirect | (默认值: `/@v-access-error`) |      `string`       |                                     Occurred by unauthorized access                                      |
| exclude  |        (默认值: `[]`)        | `string[] | RegExp` | **所有** 匹配 `exclude` 选项的项，都会跳过路由认证，即使该路由的 `access` 或 `weakAccess` 字段未被满足。 |

[route-config]: https://router.vuejs.org/api/#routes

```ts
import Vue from 'vue'
import router, { routes } from './router'

Vue.use(VAccess, { router, routes })
```

### 公有静态路由权限认证

> 公有静态路由是指开发者在实例化 `vue-router` 时传入的 `routes` 列表中的项。

如果你需要对所有公有路由实现实时地权限认证，那么你仅仅需要将对应的 `routes` 加入以下 `access` 或 `weakAccess` 字段：

1. 所有 `access` 列表中的权限都应被满足，否则将导致路由认证失败，并发生重定向。

   > `RouteConfig` 引用自 `vue-router` 的官方[文档][route-config]。

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

1. 仅仅只需要满足 `weakAccess` 中的某一项权限，即可通过当次路由权限验证。

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

**注意：** 任意未添加 `access` 或 `weakAccess` 字段的公有路由，都 **默认会** 通过 `v-access` 的路由权限认证。

### 私有动态路由权限认证

> 私有动态路由是指开发者在调用 `Vue.use(VAccess, { router, routes })` 传入的 `routes` 列表中的项。

如前文所述，开发者在 `Vue.use` 中传递一个预设的私有路由列表。`v-access` 会根据当前用户的 **权限列表** 并结合之前传入的预设私有路由表生成最终的私有路由表，并添加到当前 `vue-router` 实例中。

开发者提供的私有动态路由的格式如同公有静态路由一样，支持 `access` 和 `weakAccess` 字段。

1. 路由强认证

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

1. 路由弱认证

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

### 路由重置

如 [权限重置](#权限重置) 一样，当开发者在 `Vue.use(VAccess, options)` 模式下调用 `this.$$auth.reset()` 时，不仅可以重置当前权限容器，而且可在 **不发生页面重载** 的情况下实现将之前添加的私有动态路由删除。

## 与其他全局导航守卫

[关注点分离](https://en.wikipedia.org/wiki/Separation_of_concerns) 是一个用于分离差异化的系统组成部分，并在各个独立的模块之间形成 “高内聚，低耦合”。[router.beforeEach] 导航守卫接受 **多个** 钩子函数来实现一个 `导航管道`。这正是 `v-access` 的理论基础。`v-access` 提供了一个分离 `授权者` 的解决方案。开发者可不再过多关心 `authorizer` 是如何生效的了。

至此，结合 [router.beforeEach] 的文档描述，当你需要额外的钩子函数时：

```js
/* src/router/index.js */
const router = new VueRouter({
  // Omit options
})

/**
 * 该部分是开发者传入的额外的导航 hooks 函数
 * v-access 并不关心开发者是否传入了导航 hooks 函数，它仅关心自身的 “授权者” 工作
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

如果你还不清楚多个全局前置导航守卫是如何工作的，那么我推荐你首先仔细阅读 [router.beforeEach] 的官方文档。

[router.beforeeach]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

## Changelog

此项目所有显著的修改都会记录于 [CHANGELOG](./CHANGELOG.md) 文件内.

## License

MIT © [Bowen Liu](https://github.com/lbwa)
