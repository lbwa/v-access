<template>
  <div class="not-found">
    <h3 class="not-found__title">404</h3>
    <p class="not-found__description">
      (It probably means that this route is not satisfied because of user access
      list, so private routes set dosen't include current route.)
    </p>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style lang="sass" scoped>
.not-found
  &__description
    font-size: 12px
    font-style: italic
</style>
