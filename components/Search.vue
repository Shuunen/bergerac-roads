<template>
  <el-container class="search-container" direction="vertical">
    <el-main>

      <h2>{{ $t('search.header') }}</h2>

      <el-row class="search-pictos" :gutter="20">
        <el-col :xs="12" :span="8" :lg="4" v-for="filter in filters" :key="filter.code">
          <el-checkbox class="search-picto col" :class="['icon-' + filter.code]" :checked="filter.checked" :label="filter.shortName" @change="updateFilter(filter)" border />
        </el-col>
      </el-row>

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

<style lang="scss">
.search-container {
  $picto-height: 187px;

  background: $green-d4;
  min-height: 100vh;
  h2 {
    text-align: center;
    margin: 1rem 0;
  }
  .search-pictos {
    /* display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); */
    min-height: $picto-height;
  }
  .search-picto {
    margin-top: 20px;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 15px;
    height: $picto-height;
    background-color: $white;
    filter: grayscale(0.8);
    transition: filter 0.4s;
    text-align: center;
    background-position: center 25%;
    background-repeat: no-repeat;
    border-width: 5px;
    font-weight: bold;
    &.is-bordered {
      margin-left: 0;
    }
    &.is-checked {
      filter: grayscale(0);
    }
    .el-checkbox,
    .el-checkbox__input {
      display: block;
    }
    .el-checkbox__input {
      opacity: 0;
      margin-top: 105px;
    }
    .el-checkbox__label {
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
      margin-top: 10px;
      padding-left: 0;
    }
  }
  .no-result {
    color: $white;
  }
  .map-container {
    margin: 2rem 0;
  }
}
.icon-agriculture-biodynamique {
  background-image: url('https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/138/earth-globe-americas_1f30e.png');
}
.icon-agriculture-bio {
  background-image: url('https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/138/evergreen-tree_1f332.png');
}
.icon-acces-handicape {
  background-image: url('https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/138/wheelchair-symbol_267f.png');
}
.icon-agriculture-raisonnee {
  background-image: url('https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/138/black-universal-recycling-symbol_267b.png');
}
.icon-accepte-animaux {
  background-image: url('https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/138/paw-prints_1f43e.png');
}
.icon-vente-propriete {
  background-image: url('https://emojipedia-us.s3.amazonaws.com/thumbs/120/facebook/138/shopping-trolley_1f6d2.png');
}
</style>
