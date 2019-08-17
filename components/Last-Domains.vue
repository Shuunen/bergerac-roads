<template>
  <el-container direction="vertical" class="last-domains">
    <el-main>
      <div class="encart--simple" v-loading="loading">
        <el-row>
          <h2>{{ $t('last-domains.header') }}</h2>
        </el-row>
        <div class="grid">
          <Domain v-for="(domain, i) in domains" :key="domain.id" :data="domain" :size="(i % 2 === 0) ? 'medium': 'large'" :class="{'hidden-medium-screen-and-down': (i % 2 !== 0)}" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import sampleSize from 'lodash/sampleSize'
import Domain from './Domain.vue'

const domainsToShow = 6

export default {
  components: {
    Domain,
  },
  data () {
    return {
      loading: true,
      domains: [],
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      console.log('Home Mid : init')
      this.$db.getDomains().then((domains) => {
        // filter domains with photos & description
        domains = domains.filter(domain => (domain.photos && domain.photos.length && domain.description && domain.description.length))
        // Limit
        domains = sampleSize(domains, domainsToShow)
        console.log('Home Mid : got domains', domains)
        this.domains = domains
        this.loading = false
        this.detectItinerary()
      })
    },
    detectItinerary () {
      if (document.location.hash) {
        return this.scrollToSearch()
      }
    },
    isInViewport (el) {
      const bounding = el.getBoundingClientRect()
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    },
    scrollToSearch () {
      const el = document.querySelector('.search-container')
      if (this.isInViewport(el)) {
        return console.log('avoid scrolling to map because already in the viewport')
      }
      console.log('scrolling to map')
      el.scrollIntoView({ behavior: 'smooth' })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ressources/variables.scss";

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
  display: grid;
  padding: 0 30px 30px 0;
  &.size-1,
  &.size-3 {
    flex-grow: 1;
  }
  &.size-2 {
    flex-grow: 3;
  }
}
</style>
