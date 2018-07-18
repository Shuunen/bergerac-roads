<template>
  <nuxt-link :to="$i18n.path('')" class="header-logo" title="Retour à l'accueil">
    <img :src="image" alt="logo">
  </nuxt-link>
</template>

<script>
export default {
  computed: {
    image: function() {
      return process.env.cdn + '/images/bergerac-duras.png'
    },
  },
}
</script>


<style lang="scss">
.header-logo {
  display: block;
  padding: 0 10px;
  background-color: $white;
  img {
    width: 100%;
  }
}
</style>
