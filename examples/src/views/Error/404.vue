<template functional>
  <div class="not-found">
    <h2 class="not-found__title">404</h2>
    <p class="not-found__main">Seems nothing here.</p>
    <p class="not-found__description">
      (It probably means that this route is not satisfied due to user access
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
    font-size: 10px
    font-style: italic
</style>
