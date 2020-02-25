# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0](https://github.com/lbwa/v-access/compare/v1.0.0...v2.0.0) (2020-02-25)


### Features

* **ability:** make AbilitySet reactive based on Vue instance ([b9cda02](https://github.com/lbwa/v-access/commit/b9cda025ccd56cd4c3e3ca7d7c66eabc13ddbc2e))
* **Ability:** Don't use Set subclass anymore ([7c89a30](https://github.com/lbwa/v-access/commit/7c89a3062233f9b5dccf421531947e025de35c7e))
* **init:** also support VueRouter directly ([10c836f](https://github.com/lbwa/v-access/commit/10c836f7987a2614e4b55c80310e0a0dfdd7ed6e))
* **init:** set default abilitiesRef ([74ebf29](https://github.com/lbwa/v-access/commit/74ebf29df66ec70752908904b7399d149095c65d))

## [1.0.0](https://github.com/lbwa/v-access/compare/v0.3.1...v1.0.0) (2020-02-23)

### Features

- ~~**core:** ensure any external `map` mutation is invalid ([a86c396](https://github.com/lbwa/v-access/commit/a86c396961b82462a0fef91befc60ec7b76c982c))~~
- ~~**defineReactive:** declare Vue.util.defineReactive ([a11cac6](https://github.com/lbwa/v-access/commit/a11cac69c855fbf09a324c20ca76f912834cdd06))~~
- **install:** prevent multiple init calling ([1a4ed6e](https://github.com/lbwa/v-access/commit/1a4ed6eddcc014d00bb169e3217a4038a857cbe4))
- ~~**map:** only make auth.map reactive ([7e25515](https://github.com/lbwa/v-access/commit/7e255155526ece21bb53bab8c29e2cbcd86ab12f))~~
- **redirect:** always should pass `redirect` string ([4dd91ec](https://github.com/lbwa/v-access/commit/4dd91ec5b07735d4dcc50ce8632e367a819cbb54))
- **reset:** impl reset routes ([b3d4fa2](https://github.com/lbwa/v-access/commit/b3d4fa2a0e53f0cd556da7ea8ef370975cb67303))
- **VAccess:** make VAccess component functional ([4d1d916](https://github.com/lbwa/v-access/commit/4d1d916c61e701642fa6cd19be8b73799a3d2e55))
- remove install export ([b8c4cbc](https://github.com/lbwa/v-access/commit/b8c4cbcce3b605a5d5ddd4a4ee4e549753b6240f))

### Bug Fixes

- **type:** extend route.meta.xx type ([97833d9](https://github.com/lbwa/v-access/commit/97833d9753133f32872c7639e76382d35036c59b))

### [0.3.1](https://github.com/lbwa/v-access/compare/v0.3.0...v0.3.1) (2019-09-26)

### Bug Fixes

- correct env variables replacement in the building process ([79ca0ba](https://github.com/lbwa/v-access/commit/79ca0ba))

## [0.3.0](https://github.com/lbwa/v-access/compare/v0.1.0...v0.3.0) (2019-09-03)

### Bug Fixes

- **install:** correct <v-access> component name in the global scope ([79f96cb](https://github.com/lbwa/v-access/commit/79f96cb))
- correct es module error when falsy 'esModuleInterop' ([152ab0d](https://github.com/lbwa/v-access/commit/152ab0d))
- meta field is optional and correct hook type ([808d5f7](https://github.com/lbwa/v-access/commit/808d5f7))

### Features

- implement router resetting logic ([40e8151](https://github.com/lbwa/v-access/commit/40e8151))
- **core:** add alias for weakList and strictList ([378265d](https://github.com/lbwa/v-access/commit/378265d))
- **core:** implement private routes generation ([ad357be](https://github.com/lbwa/v-access/commit/ad357be))
- **core:** prevent multiple `init` calling ([8a737bd](https://github.com/lbwa/v-access/commit/8a737bd))
- **core:** rebuild core to split basic & enhance functionality ([f36b768](https://github.com/lbwa/v-access/commit/f36b768))
- **core:** support route.meta.weakAccess ([815e4fc](https://github.com/lbwa/v-access/commit/815e4fc))
- **enhance:** support default unauthorized handler page resolve [#6](https://github.com/lbwa/v-access/issues/6) ([#7](https://github.com/lbwa/v-access/issues/7)) ([fc24e20](https://github.com/lbwa/v-access/commit/fc24e20))
- **guard:** implement 'exclude' in routes authorization ([#11](https://github.com/lbwa/v-access/issues/11)) ([5f1f406](https://github.com/lbwa/v-access/commit/5f1f406)), closes [#10](https://github.com/lbwa/v-access/issues/10)
- **install:** attach install function to VAccesCore ([6ea71e9](https://github.com/lbwa/v-access/commit/6ea71e9))
- **Route:** implement routes filter ([9b5c77e](https://github.com/lbwa/v-access/commit/9b5c77e))
- **VAccess:** change VAccess component implementation and remove vue redundant global properties ([56e5b9b](https://github.com/lbwa/v-access/commit/56e5b9b))
- implement router acccess control [#1](https://github.com/lbwa/v-access/issues/1) ([a6c9dcd](https://github.com/lbwa/v-access/commit/a6c9dcd))
- **VAccess:** support multiple child components ([#9](https://github.com/lbwa/v-access/issues/9)) ([8ad0073](https://github.com/lbwa/v-access/commit/8ad0073)), closes [#8](https://github.com/lbwa/v-access/issues/8)
- remove beforEach & afterEach API ([#5](https://github.com/lbwa/v-access/issues/5)) ([77ea3df](https://github.com/lbwa/v-access/commit/77ea3df))

## [0.2.0](https://github.com/lbwa/v-access/compare/v0.1.0...v0.2.0) (2019-08-26)

### Bug Fixes

- **install:** correct <v-access> component name in the global scope ([79f96cb](https://github.com/lbwa/v-access/commit/79f96cb))
- correct es module error when falsy 'esModuleInterop' ([152ab0d](https://github.com/lbwa/v-access/commit/152ab0d))
- meta field is optional and correct hook type ([808d5f7](https://github.com/lbwa/v-access/commit/808d5f7))

### Features

- **core:** add alias for weakList and strictList ([378265d](https://github.com/lbwa/v-access/commit/378265d))
- **core:** implement private routes generation ([ad357be](https://github.com/lbwa/v-access/commit/ad357be))
- **core:** prevent multiple `init` calling ([8a737bd](https://github.com/lbwa/v-access/commit/8a737bd))
- **core:** support route.meta.weakAccess ([815e4fc](https://github.com/lbwa/v-access/commit/815e4fc))
- **Route:** implement routes filter ([9b5c77e](https://github.com/lbwa/v-access/commit/9b5c77e))
- **VAccess:** change VAccess component implementation and remove vue redundant global properties ([56e5b9b](https://github.com/lbwa/v-access/commit/56e5b9b))
- implement router resetting logic ([40e8151](https://github.com/lbwa/v-access/commit/40e8151))

## 0.1.0 (2019-08-14)

### Bug Fixes

- **VAccess:** correct accessList verification ([b096742](https://github.com/lbwa/v-access/commit/b096742))

### Features

- create access map ([9e10738](https://github.com/lbwa/v-access/commit/9e10738))
- declare vue vue-router as peerDependencies ([1721591](https://github.com/lbwa/v-access/commit/1721591))
- initialize ([f7db827](https://github.com/lbwa/v-access/commit/f7db827))
- **\_utils:** remove redundant 'if 'expression ([1a968eb](https://github.com/lbwa/v-access/commit/1a968eb))
- **examples:** enforce use examples/.eslintrc.js ([a792aee](https://github.com/lbwa/v-access/commit/a792aee))
- **guard:** implement guard creator to support custom function calling ([21d1dc4](https://github.com/lbwa/v-access/commit/21d1dc4))
- **guard:** implement guard intallation ([49db5a6](https://github.com/lbwa/v-access/commit/49db5a6))
- **guard:** router guard strategy ([9d16567](https://github.com/lbwa/v-access/commit/9d16567))
- **v-access:** implement v-access component ([8e8d79a](https://github.com/lbwa/v-access/commit/8e8d79a))
- **VAccess:** confirm that prototype function name is ‘\$\$auth’ ([930591b](https://github.com/lbwa/v-access/commit/930591b))
