<template>
  <el-container class="search-container" direction="vertical">
    <el-main>

      <h2>{{ $t('search.header') }}</h2>
      <h3>{{ $t('search.subheader') }}</h3>
      <el-row class="search-pictos" :gutter="20">
        <el-col :xs="12" :span="8" :lg="4" v-for="filter in filters" :key="filter.code">
          <el-checkbox class="search-picto col" :checked="filter.checked" :label="filter.shortName" @change="updateFilter(filter)" border>
            <div :class="['icon', 'icon-' + filter.code]" />
            <div class="label">{{ filter.shortName }}</div>
          </el-checkbox>
        </el-col>
      </el-row>

      <lazy-component @show="doShowMap">
        <el-row class="map-container" v-loading="loading">
          <el-col :span="8" :sm="10" :xs="24">
            <SelectList :items="domains" :height="mapContainerHeight" />
          </el-col>
          <el-col :span="16" :sm="14" :xs="24">
            <div class="map-placeholder" v-show="!showMap" :style="'height: ' + mapContainerHeight + 'px' " />
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
      mapContainerHeight: 900,
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
  $picto-height: 175px;

  background: $green-d4;
  min-height: 100vh;
  h2 {
    text-align: center;
    margin: 1rem 0;
    min-height: 55px;
  }
  h3 {
  text-align:center
  }
  .search-pictos {
    min-height: $picto-height + 20;
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
    border-width: 5px;
    font-weight: bold;
    &::after {
      @include sprite($check);

      transition: opacity 0.4s;
      display: block;
      opacity: 0;
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
    }
    &.is-bordered {
      margin-left: 0;
    }
    &.is-checked {
      filter: grayscale(0);
    }
    &.is-checked::after {
      opacity: 1;
    }
    .el-checkbox {
      display: block;
    }
    .el-checkbox__input {
      display: none;
    }
    .el-checkbox__label {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
    .label {
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
.map-placeholder {
  @include sprite($map-placeholder);
}
.icon-agriculture-biodynamique {
  @include sprite($earth);
}
.icon-agriculture-bio {
  @include sprite($tree);
}
.icon-acces-handicape {
  @include sprite($wheelchair);
}
.icon-agriculture-raisonnee {
  @include sprite($recycling);
}
.icon-accepte-animaux {
  @include sprite($paw);
}
.icon-vente-propriete {
  @include sprite($shopping);
}
</style>
