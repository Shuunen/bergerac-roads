<template>
  <el-container class="search-container" direction="vertical">
    <el-main>
      <h2>{{ $t('search.header') }}</h2>
      <h3>{{ $t('search.subheading') }}</h3>

      <!--      <el-row class="search-pictos" :gutter="20" type="flex" justify="center">-->
      <!--        <el-col :xs="12" :sm="6" :md="4" :lg="4" v-for="prebuilt in prebuilts" :key="prebuilt.code+prebuilt.checked">-->
      <!--          <el-checkbox class="search-picto col" :class="[prebuilt.checked ? '' : 'unchecked']" :checked="prebuilt.checked" :label="prebuilt.shortName" @change="loadPrebuilt(prebuilt)" border>-->
      <!--            <div :class="['icon', 'icon-' + prebuilt.code]" />-->
      <!--            <div class="label">-->
      <!--              {{ prebuilt.shortName }}-->
      <!--            </div>-->
      <!--          </el-checkbox>-->
      <!--        </el-col>-->
      <!--      </el-row>-->

      <el-row class="search-pictos" :gutter="20" type="flex" justify="center">
        <el-col :xs="12" :sm="6" :md="4" :lg="4" v-for="f in filters" :key="f.code">
          <el-checkbox class="search-picto col" :checked="f.checked" :label="f.shortName" @change="updateFilter(f)" border>
            <div :class="['icon', 'icon-' + f.code]" />
            <div class="label">{{ f.shortName }}</div>
          </el-checkbox>
        </el-col>
      </el-row>

      <el-row class="search-filters">
        <el-col>
          <el-switch v-model="showVineyardFilter" :active-text="$t('search.filterVineyards')" @change="onFiltersChange()" />
        </el-col>
        <transition name="fade">
          <el-col v-show="showVineyardFilter">
            <el-checkbox-group class="vineyards-checkboxes" v-model="checkedVineyards" size="large" @change="onFiltersChange()">
              <el-checkbox v-for="(vineyard, index) in vineyards" :key="index" :label="vineyard.name" checked>{{ $t(`vineyards.${vineyard.name}.title`) }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </transition>
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
import getSlug from 'speakingurl'
import orderBy from 'lodash/orderBy'
import trimStart from 'lodash/trimStart'
import debounce from 'lodash/debounce'
import { eventBus } from '../store/index'
import SelectList from '~/components/Select-List.vue'
import GoogleMap from '~/components/Google-Map.vue'

const baseId = 'DEGAQU0'
const hashSeparator = '_'

export default {
  components: {
    GoogleMap,
    SelectList,
  },
  data () {
    return {
      mapContainerHeight: 900,
      filters: [],
      checkedFilters: {},
      domains: [],
      filterDomain: '',
      vineyards: [],
      loading: false,
      showMap: false,
      showVineyardFilter: false,
      checkedVineyards: [],
      searchDebounced: null,
      prebuilts: [],
      prebuiltHandled: false,
      handledHashes: [
        {
          regex: /(raire|rary)=(([0-9A-Z]+,?)+)/i,
          nbMatches: 4,
          takeIndex: 2,
          callback: this.onItineraryHash,
        },
        {
          regex: /(raire|rary)=([\w-]+)/i,
          nbMatches: 3,
          takeIndex: 2,
          callback: this.onPrebuiltHash,
        },
        {
          regex: /(part|from)=(.+)/i,
          nbMatches: 3,
          takeIndex: 2,
          callback: this.onStartingPointHash,
        },
      ],
    }
  },
  watch: {
    showMap () {
      console.log('showMap is', this.showMap)
      if (this.showMap && !this.prebuiltHandled) {
        this.prebuiltHandled = true
      }
    },
  },
  mounted () {
    this.$db.getVineyards().then(this.setVineyards)
    this.$db.getDomains().then(this.setDomains)
    this.$db.getTags().then(this.setFilters)
    this.$db.getPrebuilts().then(this.setPrebuilts)

    eventBus.$on('show-map', this.doShowMap)
    eventBus.$on('filter-domain', this.setFilterDomain)
    eventBus.$on('check-hash', this.checkHash)
    eventBus.$on('set-domains-url', this.setDomainsInUrl)
    eventBus.$on('set-starting-point', this.setStartingPointInUrl)

    this.searchDebounced = debounce(this.search, 500)
  },
  destroyed () {
    eventBus.$off('show-map', this.doShowMap)
    eventBus.$off('filter-domain', this.setFilterDomain)
    eventBus.$off('check-hash', this.checkHash)
    eventBus.$off('set-domains-url', this.setDomainsInUrl)
    eventBus.$off('set-starting-point', this.setStartingPointInUrl)
  },
  methods: {
    augment (domains) {
      domains = domains.map((domain) => {
        domain.infoWindowOpen = false
        domain.title = trimStart(domain.title, 'Les ')
        domain.titleWithNumber = domain.title + ' (' + domain.number + ')'
        return domain
      })
      return domains
    },
    sort (domains) {
      return orderBy(domains, ['title'], ['asc'])
    },
    filter (domains) {
      if (this.filterDomain.length) {
        const str = getSlug(this.filterDomain)
        console.log('filtering with str :', str)
        domains = domains.filter(domain => getSlug(domain.title).includes(str))
      }
      if (this.showVineyardFilter) {
        console.log('filtering with checked vineyards :', this.checkedVineyards)
        domains = domains.filter((domain) => {
          let keep = false
          this.checkedVineyards.forEach((vineyard) => {
            if (!keep) {
              keep = domain.vineyards.includes(vineyard)
            }
          })
          return keep
        })
      }
      return domains
    },
    setPrebuilts (prebuilts) {
      this.prebuilts = prebuilts
    },
    checkHash () {
      decodeURI(document.location.hash).split(hashSeparator).forEach(segment => this.parseHashSegment(segment))
    },
    parseHashSegment (segment) {
      console.log('parseHashSegment')
      for (const handledHash of this.handledHashes) {
        const matches = segment.match(handledHash.regex)
        if (matches && matches.length === handledHash.nbMatches) {
          return handledHash.callback(matches[handledHash.takeIndex])
        }
      }
    },
    onItineraryHash (itineraries) {
      console.log('onItineraryHash', itineraries)
      const ids = itineraries.split(',').map(id => baseId + id)
      const matchingIds = []
      this.domains.forEach((domain) => {
        if (ids.includes(domain.id) && !matchingIds.includes(domain.id)) {
          matchingIds.push(domain.id)
        }
      })
      console.log('found these domains ids in url', ids)
      if (matchingIds.length) {
        console.log('and these are matching real ids', matchingIds)
        this.loading = true
        eventBus.$emit('preselect-items', matchingIds)
      } else {
        console.log('but none of them match real ids')
        console.warn('hack detected, calling the police...')
      }
    },
    onPrebuiltHash (prebuiltCode) {
      console.log('onPrebuiltHash', prebuiltCode)
      const prebuilt = this.prebuilts.find(
        p => getSlug(p.code) === getSlug(prebuiltCode),
      )
      if (prebuilt) {
        console.log('and this matching prebuilt', prebuilt.code)
        this.loading = true
        this.loadPrebuilt(prebuilt)
      } else {
        console.log('but does not match any real code')
        console.warn('hack happening, calling the police !!!')
      }
    },
    onStartingPointHash (startingPoint) {
      console.log('onStartingPointHash', startingPoint)
      eventBus.$emit('set-starting-point', startingPoint)
    },
    loadPrebuilt (prebuilt) {
      this.loading = true
      // allow only one loaded prebuilt
      this.prebuilts.map(
        p => (p.checked = p.code === prebuilt.code ? !p.checked : false),
      )
      // these two lines will force Vue to update DOM
      this.prebuilts.push('')
      this.prebuilts.pop()

      if (prebuilt.checked) {
        console.log('user load prebuilt itinerary', prebuilt.shortName)
        this.setDomainsInUrl(prebuilt.ids)
        eventBus.$emit('preselect-items', prebuilt.ids.map(id => baseId + id))
      } else {
        console.log('user un-load prebuilt itinerary', prebuilt.shortName)
        this.setDomainsInUrl([])
        eventBus.$emit('preselect-items', [])
      }
    },
    setStartingPointInUrl (startingPoint) {
      this.startingPoint = startingPoint
      this.setHash()
    },
    setDomainsInUrl (ids) {
      this.loading = false
      if (!ids.length) {
        console.log('no domains to setup in document location')
        return
      }
      let selected = ids.map(id => id.replace(baseId, '')).join(',')
      const prebuilt = this.prebuilts.find(p => p.ids.join(',') === selected)
      if (prebuilt) {
        selected = prebuilt.code
        console.log('here is the selected prebuilt code', selected)
      } else {
        console.log('here is the selected domains ids', selected)
      }
      this.domainsSelected = selected
      this.setHash()
    },
    setHash () {
      console.log('setHash')
      const hashes = []
      if (this.startingPoint && this.startingPoint.length) {
        hashes.push(window.$nuxt.$t('search.from') + '=' + this.startingPoint)
      }
      if (this.domainsSelected && this.domainsSelected.length) {
        hashes.push(window.$nuxt.$t('search.itinerary') + '=' + this.domainsSelected)
      }
      document.location.hash = hashes.join(hashSeparator)
    },
    onFiltersChange () {
      console.log('filters are', this.checkedFilters)
      this.loading = true
      this.searchDebounced()
    },
    updateFilter (filter) {
      filter.checked = !filter.checked
      this.checkedFilters[filter.code] = filter.checked
      this.onFiltersChange()
    },
    setVineyards (vineyards) {
      this.vineyards = vineyards
    },
    setDomains (domains) {
      this.domains = this.sort(this.augment(this.filter(domains)))
      this.loading = false
      eventBus.$emit('domains-search-complete')
    },
    setFilters (tags) {
      this.filters = tags.map((tag) => {
        tag.checked = false
        return tag
      })
      console.log('filters init with', this.filters)
    },
    setFilterDomain (value) {
      console.log('user want to filter domains with', value)
      this.filterDomain = value
      this.searchDebounced()
    },
    doShowMap () {
      if (!this.showMap) {
        console.log('in doShowMap')
        setTimeout(() => (this.showMap = true), 500)
      }
    },
    search () {
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
@import "@/assets/styles/ressources/icons.scss";
@import "@/assets/styles/ressources/variables.scss";

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
    text-align: center;
  }
  .search-pictos {
    min-height: $picto-height + 20;
    flex-wrap: wrap;
    & > .el-col {
      min-width: 150px;
    }
  }
  .search-picto {
    margin-top: 20px;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 15px;
    height: $picto-height;
    background-color: $white;
    filter: grayscale(.8);
    transition: filter .4s;
    text-align: center;
    border-width: 5px;
    font-weight: bold;
    &::after {
      @include sprite($check);
      transition: opacity .4s;
      display: block;
      opacity: 0;
      content: "";
      position: absolute;
      top: 8px;
      right: 8px;
    }
    &.is-bordered {
      margin-left: 0;
    }
    &.is-checked:not(.unchecked) {
      filter: grayscale(0);
    }
    &.is-checked:not(.unchecked)::after {
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
    &.el-checkbox.is-bordered.is-checked:not(.unchecked) {
      border-color: $green;
    }
    .el-checkbox__input.is-checked:not(.unchecked) + .el-checkbox__label {
      color: $green-d2;
    }
  }
  .search-filters {
    margin-top: 25px;
  }
  .vineyards-checkboxes {
    margin-top: 15px;
    .el-checkbox {
      color: $white;
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
.icon-agriculture-raisonnee {
  @include sprite($recycling);
}
.icon-accepte-animaux {
  @include sprite($paw);
}
.icon-vente-propriete {
  @include sprite($shopping);
}

.icon {
  width: 70%;
  height: 70%;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-acces-handicape {
  background-image: url("#{$cdn}/images/pictos/Z1_Accessibilitee_web.png");
}
.icon-hebergement {
  background-image: url("#{$cdn}/images/pictos/Z1_Hebergement_web.png");
}
.icon-camping {
  background-image: url("#{$cdn}/images/pictos/Z1_Camping-car_web.png");
}
.icon-restauration {
  background-image: url("#{$cdn}/images/pictos/Z1_Restaurant_web.png");
}
.icon-env-humain {
  background-image: url("#{$cdn}/images/pictos/Z1_Env_Humain_web.png");
}
.icon-monument {
  background-image: url("#{$cdn}/images/pictos/Z1_Monument_web.png");
}
.icon-famille {
  background-image: url("#{$cdn}/images/pictos/Z1_Famille_web.png");
}
.icon-top-10 {
  @include sprite($recycling);
  background-size: 792px;
}
.icon-les-petillants {
  @include sprite($shopping);
  background-size: 792px;
}
.icon-spot-photo {
  @include sprite($tree);
  background-size: 792px;
}
.icon-en-groupe {
  @include sprite($earth);
  background-size: 792px;
}
.icon-route-equestre {
  @include sprite($paw);
  background-size: 792px;
}
</style>
