<template>
  <nuxt-link :to="$i18n.path('')" class="header-logo" :title="$t('common.back-home')">
    <img class="parent-width" :src="image" alt="logo" />
  </nuxt-link>
</template>

<script>
export default {
  computed: {
    image () {
      return process.env.cdn + '/images/bergerac-duras.png'
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/styles/ressources/variables.scss";

.header-logo {
  display: block;
  padding: 0 10px;
  background-color: $white;
}
</style>
