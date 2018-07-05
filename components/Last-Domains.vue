<template>
  <el-container direction="vertical" class="last-domains">
    <el-main>
      <div class="encart--simple" v-loading="loading">
        <el-row >
          <h2>{{ $t('last-domains.header') }}</h2>
        </el-row>
        <div class="grid">
          <Domain v-for="(domain, i) in domains" :key="domain.id" :data="domain" :size="(i % 2 === 0) ? 'medium': 'large'"
                  :class="{'hidden-xs-and-down': (i % 2 !== 0)}" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getDomains } from '~/utils/db'
import { sampleSize } from 'lodash'
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
        // filter domains with photos & description
        lastDomains = lastDomains.filter(domain => (domain.photos && domain.photos.length && domain.description && domain.description.length))
        // Limit
        lastDomains = sampleSize(lastDomains, domainsToShow)
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
  background-color: $blanc;
  padding-bottom: 30px;
}
h2 {
  text-align: center;
  margin: 30px 0;
  color: $black;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin-right: -30px;
}
.encart--simple {
  padding-bottom: 40px;
}
.domain {
  /* min-height: 360px; */
  display: grid;
  padding: 0 30px 30px 0;
  &.size-1,
  &.size-3 {
    flex-grow: 1;
  }
  &.size-2 {
    flex-grow: 3;
  }

  /*
  &.size-3 {
    grid-column-end: span 2;
    grid-row-end: span 3;
  }
  */
}

/*
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
*/
</style>
