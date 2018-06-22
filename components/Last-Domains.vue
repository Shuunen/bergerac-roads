<template>
  <el-container direction="vertical" class="last-domains">
    <el-main>
      <el-row >
        <h2>{{ $t('last-domains.header') }}</h2>
      </el-row>
      <div class="grid">
        <Domain v-for="domain in domains" :key="domain.id" :data="domain" />
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
        let lastDomains = [...domains]
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
</style>
