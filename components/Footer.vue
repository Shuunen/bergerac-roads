<template>
  <div class="footer">
    <small>{{ $t('footer.alcoolWarning') }}</small>
    <div class="grappe" />
    <small>{{ $t('footer.copyright') }}</small>
    <small>
      <nuxt-link v-for="vineyard in vineyards" :key="vineyard.id" :to="$i18n.path('vignoble/' + vineyard.name)">
        {{ $t(`vineyards.${vineyard.name}.title`) }}
      </nuxt-link>
    </small>
    <small class="line">
      <nuxt-link :to="$i18n.path('legal')">{{ $t('legal.title') }}</nuxt-link>
      <div class="separator">-</div>
      <a href="http://www.vins-bergeracduras.fr/" target="_blank">{{ $t('links.more') }}</a>
    </small>
  </div>
</template>
<script>
export default {
  data () {
    return {
      vineyards: [],
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$db.getVineyards().then((vineyards) => {
        this.vineyards = vineyards
      })
    },
  },
}
</script>
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
