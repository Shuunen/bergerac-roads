<template>
  <el-container direction="vertical" class="last-domains">
    <el-main>
      <el-row >
        <h2>{{ $t('last-domains.header2') }}</h2>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" :xs="24" :key="domain.id" v-for="domain in domains">
          <Domain :data="domain" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { getDomains } from '~/utils/db'
import Domain from './Domain.vue'

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
        // Limit to 3
        lastDomains.splice(3)
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
  padding-bottom: 20px;
}
h2 {
  text-align: center;
  margin: 20px 0 40px;
}
</style>
