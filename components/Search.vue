<template>
  <el-container direction="vertical" class="search-container">
    <el-main>

      <h2>{{ $t('search.header') }}</h2>

      <div class="line search-pictos">
        <el-checkbox class="search-picto col" :class="['icon-' + filter.code]" v-for="filter in filters" :key="filter.code" :checked="filter.checked" :label="filter.name" @change="updateFilter(filter)" border />
      </div>

      <lazy-component @show="doShowMap">
        <el-row class="map-container" v-loading="loading">
          <el-col :span="8" :sm="10" :xs="24">
            <SelectList :items="domains" :height="mapContainerHeight" />
          </el-col>
          <el-col :span="16" :sm="14" :xs="24">
            <div v-show="!showMap" v-lazy:background-image="'/icons/map-placeholder.jpg'" :style="'height: ' + mapContainerHeight + 'px' " />
            <GoogleMap v-if="showMap" :markers="domains" :height="mapContainerHeight" />
          </el-col>
        </el-row>
      </lazy-component>

    </el-main>
  </el-container>
</template>

<script>
import GoogleMap from '~/components/Google-Map.vue'
import SelectList from '~/components/Select-List.vue'
import orderBy from 'lodash/orderBy'
import trimStart from 'lodash/trimStart'
import debounce from 'lodash/debounce'
import { eventBus } from '../store/index'

export default {
  components: {
    GoogleMap,
    SelectList,
  },
  data() {
    return {
      mapContainerHeight: 600,
      filters: [],
      checkedFilters: {},
      domains: [],
      searchValue: [],
      loading: false,
      showMap: false,
    }
  },
  mounted() {
    this.$db.getDomains().then(this.setDomains)

    this.$db.getTags().then(this.setFilters)

    eventBus.$on('show-map', this.doShowMap)

    this.searchDebounced = debounce(this.search, 1500)
  },
  methods: {
    addInfoWindowState(domains) {
      domains = domains.map(domain => {
        domain.infoWindowOpen = false
        if (domain.number) {
          domain.title += ' (' + domain.number + ')'
        }
        domain.title = trimStart(domain.title, 'Les ')
        return domain
      })
      return orderBy(domains, ['title'], ['asc'])
    },
    onFiltersChange() {
      console.log('filters are', this.checkedFilters)
      this.loading = true
      this.searchDebounced()
    },
    updateFilter(filter) {
      filter.checked = !filter.checked
      this.checkedFilters[filter.code] = filter.checked
      this.onFiltersChange()
    },
    setDomains(domains) {
      this.domains = this.addInfoWindowState(domains)
      this.loading = false
    },
    setFilters(tags) {
      this.filters = tags.map(tag => {
        tag.checked = false
        return tag
      })
      console.log('filters init with', this.filters)
    },
    doShowMap() {
      if (!this.showMap) {
        console.log('in doShowMap')
        setTimeout(() => (this.showMap = true), 500)
      }
    },
    search() {
      console.log('in search')
      this.doShowMap()
      const filters = this.checkedFilters
      const tags = Object.keys(filters).filter(f => filters[f])
      this.$db.getDomainsByTags(tags).then(this.setDomains)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-container {
  background: $green-d4;
  min-height: 100vh;
  h2 {
    text-align: center;
    margin: 1rem 0 2rem;
  }
  .search-picto {
    align-items: center;
    justify-content: center;
    height: 140px;
    line-height: 200px;
    margin-bottom: 20px;
    background-color: $white;
    flex: 1;
    &.is-bordered {
      margin-left: 20px;
      padding-left: 15px;
    }
  }
  .no-result {
    color: $white;
  }
  .map-container {
    margin: 2rem 0;
  }
}
</style>
