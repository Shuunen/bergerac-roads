<template>
  <div class="footer">
    <small>{{ $t('footer.alcoolWarning') }}</small>
    <div class="grappe" />
    <small>{{ $t('footer.copyright') }}</small>
    <small class="line">
      <nuxt-link :to="$i18n.path('legal')">{{ $t('legal.title') }}</nuxt-link>
      <div class="separator">-</div>
      <a href="http://www.vins-bergeracduras.fr/" target="_blank">{{ $t('links.more') }}</a>
    </small>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/ressources/variables.scss";

.footer {
  padding: 30px 0 20px;
  background-color: $rouge;
  display: grid;
  grid-gap: 20px;
  text-align: center;
  color: $white;

  .separator {
    margin: 0 10px;
  }
}
</style>
