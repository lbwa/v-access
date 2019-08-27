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

> 一个基于 `Vue` v2.x 版本的权限解决方案，其中包含 **元素** 控制和 **路由** 控制。

|                   Peer dependencies                    |                      Required                      |
| :----------------------------------------------------: | :------------------------------------------------: |
|        [vue](https://www.npmjs.com/package/vue)        |                         ✔️                         |
| [vue-router](https://www.npmjs.com/package/vue-router) | 仅在调用 `Vue.use(VAccess, { router })` 时是必须的 |

## 安装

```bash
npm i v-access --save
```

## 数据结构

`v-access` 所有认证功能都是基于从服务端提供的一个当前用户的 **权限列表** 来实现的。该权限列表中的每一项元素都表明了一个服务端的权限，如任意包含 `account.read` 的用户权限列表，都表明当前用户可访问服务端的 `account` 服务。值得注意的是，任意的权限名称取决于你自己，`v-access` 并不限制单个权限名称的格式。无论你如何命名服务端的各项服务名称，你都应该首先在获取到当前用于的权限列表后，立即调用 [init](#initialization) 函数，并传入当前权限列表来完成 `v-access` 的认证模块的初始化。

**任意一个** 权限列表中的单个服务权限都应遵顼以下结构：

```ts
interface Access {
  // 'id' 字段是唯一，且必须的
  id: string
  [key: string]: any
}

type AccessList = Access[]
```

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

**注意：** 全局组件 `<v-access>` 仅支持 **一个** 子元素。

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

## 路由权限认证

当你想要实现基于 `vue-router` 的路由权限认证时，你应提供一个 `vue-router` 实例和一个预设的私有路由集合。剩余的其他选项都是可选的。

|   Option   | Required |              Data type              |               Description                |
| :--------: | :------: | :---------------------------------: | :--------------------------------------: |
|   router   |    ✔️    |              VueRouter              |          一个 `vue-router` 实例          |
|   routes   |    ✔️    | Array<[RouteConfig][route-config]>  |        用于权限控制的预设路由集合        |
|  redirect  |    -     |               string                | 当用户进入未授权路由时，将重定向至此地址 |
| beforeEach |    -     | [NavigationGuard][navigation-guard] |   同 `vue-router` beforeEach 路由守卫    |
| afterEach  |    -     |      [After hook][after-hook]       |    同 `vue-router` afterEach 路由守卫    |

[route-config]: https://router.vuejs.org/api/#routes
[navigation-guard]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
[after-hook]: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-after-hooks

```ts
import Vue from 'vue'
import router, { routes, beforeEach, afterEach } from './router'

Vue.use(VAccess, { router, routes, beforeEach, afterEach })
```

## Changelog

此项目所有显著的修改都会记录于 [CHANGELOG](./CHANGELOG.md) 文件内.

## License

MIT © [Bowen Liu](https://github.com/lbwa)
