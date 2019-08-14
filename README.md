<h1 align="center">v-access</h1>

> An authorization solutions for Vue v2.x.

**NOTICE:** This project is under construction.

## Prerequisites

|                   Peer dependencies                    | Required |
| :----------------------------------------------------: | :------: |
|        [vue](https://www.npmjs.com/package/vue)        |    ✔️    |
| [vue-router](https://www.npmjs.com/package/vue-router) |    ✔️    |

## Install

```bash
npm i v-access --save
```

## Schema

Single user access which is provided by back-end service should following structure:

```ts
interface Access {
  // 'id' field is required
  id: string
  [key: string]: any
}
```

## Initialization

You **MUST** invoke `init` function which is belong to `Vue` prototype property named `$$auth` to pass current user **access list** before using `v-access` functionality.

```ts
import Vue from 'vue'
import router from './router'
import VAccess from 'v-access'

Vue.use(VAccess, { router })
```

```ts
fetchUserAccessList().then(({ list: userAccessList }: { list: Access[] }) =>
  this.$$auth.init(userAccessList)
)
```

## Verification functions

`v-access` has provided **2** way to implement access control functionalities.

1. `Vue` global component named `v-access`.

1. Verification functions which is belong to `Vue` prototype property named `$$auth`

**NOTICE:** All global components only support **ONE** children element.

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
this.$$auth.strictList(['accessNameA', 'accessNameB'])
```

- global component

```html
<v-access :access="['accessNameA', 'accessNameA']" strict>
  <main>Some content</main>
</v-access>
```
