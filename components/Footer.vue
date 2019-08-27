<template>
  <div class="footer">
    <small>{{ $t('footer.alcoolWarning') }}</small>
    <div class="grappe" />
    <small>{{ $t('footer.copyright') }}</small>
    <small class="line">
      <a :href="'/vignoble/'+vineyard.name" v-for="vineyard in vineyards" :key="vineyard" class="footer-link">
        {{ vineyard.name }}
      </a>
    </small>
    <small class="line">
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

a.footer-link{
  font-size: 1.15rem;
  margin: 2rem 1rem;
  &:hover{
    color: #f0ec88;
    font-weight: bold;
  }
}

@media only screen and (max-width: 480px){
   a.footer-link{
    font-size: 0.75rem;
    margin: 0.3rem 0.9rem;
  }
}
</style>
