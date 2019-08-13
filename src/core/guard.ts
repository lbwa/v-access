import { NavigationGuard, Route } from 'vue-router'

export const beforeEach: NavigationGuard = function(to, _, next) {}

export const afterEach: (to: Route, from: Route) => any = function(to, _) {}
