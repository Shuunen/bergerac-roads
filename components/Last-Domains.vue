<template>
  <el-container direction="vertical" class="last-domains">
    <el-main>
      <el-row >
        <h2>{{ $t('last-domains.header') }}</h2>
      </el-row>
      <div class="grid">
        <Domain v-for="(domain, index) in domains" :key="domain.id" :data="domain" :class="{'hidden-xs-and-down': index >= domainsToShowOnMobile}" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getDomains } from '~/utils/db'
import Domain from './Domain.vue'

const domainsToShow = 6

export default {
  components: {
    Domain,
  },
  data() {
    return {
      loading: true,
      domains: [],
      domainsToShowOnMobile: 3,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      console.log('Home Mid : init')
      getDomains().then(domains => {
        // Allows to not change the original list of domains that can be used in other components
        let lastDomains = [...domains].filter(domain => domain.photos)
        // Limit
        lastDomains.splice(domainsToShow)
        console.log('Home Mid : got domains', lastDomains)
        this.domains = lastDomains
        this.loading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.last-domains {
  background-color: $red-d3;
  padding-bottom: 40px;
}
h2 {
  text-align: center;
  margin: 20px 0 40px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 20px;
  grid-auto-rows: minmax(320px, auto);
  grid-auto-flow: dense;
  padding: 0;
}
@media only screen and (min-width: 700px) {
  .grid {
    & > .domain:nth-child(2n) {
      grid-column-end: span 2;
      grid-row-end: span 2;
    }
    & > .domain:last-of-type {
      grid-column-end: span 1;
      grid-row-end: span 1;
    }
  }
}
</style>
