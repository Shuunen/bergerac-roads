<template>
  <nuxt-link :to="$i18n.path('')" class="logo" title="Retour à l'accueil">
    <img src="/logos/logo-2016-bergerac-duras.svg" alt="logo">
  </nuxt-link>
</template>

<style lang="scss" scoped>
.logo {
  display: block;
  padding: 0 10px;
  background-color: $white;
  img {
    width: 100%;
  }
}
</style>
