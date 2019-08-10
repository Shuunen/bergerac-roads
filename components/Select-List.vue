<template>
  <div class="select-list-container" :style="{ height: `${height}px` }" v-loading="loading">
    <div class="col start parent-height">
      <div class="line help-text" :class="[canCreate ? 'valid' : 'todo']">{{ canCreate ? $t('search.helpCreateAfter') : $t('search.helpCreateBefore') }}</div>

      <div class="line" :class="[startingPoint && startingPoint.length ? 'valid' : 'todo']">1) {{ $t('search.helpStart') }}</div>

      <div class="line">
        <el-input ref="autocomplete" :placeholder="$t('search.start')" v-model="startingPoint" clearable @clear="setStartingPoint(null)">
          <el-button slot="append" @click="getNavigatorPosition">
            {{ $t('search.findMe') }}
            <i class="el-icon-location-outline el-icon-right" />
          </el-button>
        </el-input>
      </div>

      <div
        class="line"
        :class="[checkedItems.length ? 'valid' : 'todo']"
      >
        2) {{ $tc('search.' + (!checkedItems.length ? 'introduction' : 'domainsSelected'), checkedItems.length, {nb:checkedItems.length}) + (checkedItems.length > 1 ? 's' : '') + (checkedItems.length > 0 ? '' : ' :') }}
      </div>

      <div class="line">
        <el-button :disabled="!canCreate" @click="startItineraryProcess">{{ $t('search.calcItinerary') }}</el-button>

        <el-button :disabled="!canCreate" @click="sendItineraryByMail">{{ $t('search.sendItinerary') }}</el-button>
      </div>

      <div class="line">
        <el-input class="filter-domain" v-model="filterDomain" @change="doFilterDomains" prefix-icon="el-icon-search" />
        <el-button :disabled="!filterDomain.length" @click="doFilterDomains">{{ $t('search.filterDomains') }}</el-button>
      </div>
      <div class="line list" v-show="itemsSorted.length">
        <el-checkbox-group v-model="checkedItems" @change="emitCheckedItems" v-loading="filteringDomains">
          <el-checkbox-button v-for="domain in itemsSorted" :key="domain.id" :label="domain.title">
            <Domain :data="domain" :size="'inline'" />
            <el-button class="view-domain" :title="$t('domain.view')" @click="viewDomain(domain)">
              <i class="el-icon-view" />
            </el-button>
          </el-checkbox-button>
        </el-checkbox-group>
      </div>

      <div class="line help-text valid" v-show="!loading && !itemsSorted.length">{{ $t('search.noEntries') }}</div>
    </div>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import orderBy from 'lodash/orderBy'
import debounce from 'lodash/debounce'
import { eventBus } from '../store'
import Domain from './Domain.vue'

export default {
  components: {
    Domain,
  },
  props: {
    height: {
      type: Number,
      default: 300,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      checkedItems: [],
      itemsSorted: [],
      startingPoint: '',
      retry: 3,
      loading: true,
      showMap: false,
      filterDomain: '',
      filteringDomains: false,
      iteneraryDisplayed: false,
    }
  },
  computed: {
    google: gmapApi,
    canCreate () {
      return this.checkedItems && this.checkedItems.length && this.startingPoint && this.startingPoint.length
    },
  },
  watch: {
    items () {
      // Reinitialize the checked items list when the items list changes.
      console.log('cleared checked items')
      this.checkedItems = []
      this.sortItems(true)
    },
  },
  mounted () {
    // Selects or not by clicking on the button in infowindow.
    eventBus.$on('select-marker', (selectedMarker) => {
      console.log('on select-marker')
      const index = this.checkedItems.findIndex(item => item === selectedMarker.title)
      if (index === -1) {
        this.checkedItems.push(selectedMarker.title)
      } else {
        this.checkedItems.splice(index, 1)
      }
      this.sortItemsDebounced()
    })

    eventBus.$on('show-map', () => (this.showMap = true))
    eventBus.$on('checked-items', () => this.sortItemsDebounced())
    eventBus.$on('preselect-items', this.preselectItems)
    eventBus.$on('start-itinerary-process', this.startItineraryProcess)
    eventBus.$on('set-starting-point', this.onStartingPointUpdate)
    eventBus.$on('domains-search-complete', () => (this.filteringDomains = false))

    this.initAutoComplete()

    this.sortItemsDebounced = debounce(this.sortItems, 1500)
    this.sortItemsDebounced(true)

    this.emitFilterDomainDebounced = debounce(this.emitFilterDomain, 500)

    // this.listenFilterDomain(true)
  },
  destroyed () {
    eventBus.$off('preselect-items', this.preselectItems)
    eventBus.$off('start-itinerary-process', this.startItineraryProcess)
  },
  methods: {
    initAutoComplete () {
      if ((!this.google || !this.google.maps) && this.retry > 0) {
        this.retry--
        setTimeout(() => this.initAutoComplete(), 500)
        console.log('this.google not yet available, retry later...')
        if (this.retry === 0) {
          console.log('this is the last retry')
        }
        return
      }
      console.log('in initAutoComplete')
      // Restrict autocomplete to results in France.
      const autocomplete = new this.google.maps.places.Autocomplete(this.$refs.autocomplete.$refs.input, { componentRestrictions: { country: 'fr' } })
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        const position = { coords: { latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() } }
        this.setStartingPosition(position)
        this.setStartingPoint(place.formatted_address)
      })
      eventBus.$emit('check-hash')
    },
    sendItineraryByMail () {
      const mail = ''
      const subject = this.$t('search.sendItinerarySubject')
      const body = this.$t('search.sendItineraryBody')
      const url = encodeURI(document.location.href)
      // url = encodeURI(`<a href="${url}">${url}</a>`) // cannot put html body in a mailto
      window.location.href = `mailto:${mail}?subject=${subject}&body=${body}${url}`
    },
    preselectItems (itemIds) {
      console.log('preselecting domains...')
      this.checkedItems = []
      itemIds.forEach((itemId) => {
        const item = this.items.find(i => i.id === itemId)
        if (item && item.title) {
          this.checkedItems.push(item.title)
        }
      })
      this.emitCheckedItems(this.checkedItems)
    },
    sortItems (noTimeout) {
      const timeout = noTimeout ? 0 : 300
      if (timeout) {
        this.loading = true
      }
      if (this.iteneraryDisplayed) {
        this.startItineraryProcess()
      }
      setTimeout(() => {
        console.log('sorting items in list with ' + timeout + 'ms timeout')
        this.itemsSorted = orderBy(
          this.items,
          ['selected', 'title'],
          ['desc', 'asc'],
        )
        this.loading = false
        this.emitItemIdsForUrl()
      }, timeout)
    },
    emitItemIdsForUrl () {
      const ids = this.items.filter(item => item.selected).map(item => item.id)
      // console.log('will set theses domains ids in url', ids)
      eventBus.$emit('set-domains-url', ids)
    },
    getCityByCoordinates (coords) {
      const geocoder = new this.google.maps.Geocoder()
      const location = { lat: coords.latitude, lng: coords.longitude }
      return new Promise((resolve) => {
        geocoder.geocode({ location }, (results, status) => {
          if (status !== 'OK') {
            console.error('getCityByCoordinates : geocoder failed due to "' + status + '"')
            resolve(null)
          }
          const components = results[0] && results[0].address_components
          if (!components) {
            console.error('getCityByCoordinates :  no results found')
            resolve(null)
          }
          resolve(this.getCityFromAddressComponents(components))
        })
      })
    },
    getCityFromAddressComponents (components) {
      if (!components) {
        return null
      }
      const component = components.find(component => component.types.includes('locality'))
      const city = component.short_name
      if (!city.length) {
        console.error('getCityFromAddressComponents : city not found :(')
        return null
      }
      console.log('getCityFromAddressComponents : city found "' + city + '"')
      return city
    },
    doFilterDomains () {
      this.emitFilterDomainDebounced()
    },
    emitFilterDomain () {
      this.filteringDomains = true
      eventBus.$emit('filter-domain', this.filterDomain)
    },
    getNavigatorPosition () {
      this.loading = true
      console.log('getNavigatorPosition : fetching geolocation...')
      try {
        window.navigator.geolocation.getCurrentPosition(position => this.setStartingPosition(position, true))
      } catch (err) {
        console.error('getNavigatorPosition : geolocation denied or failed')
        alert(this.$t('search.findMeFailed'))
        this.setStartingPoint(null)
      }
    },
    onStartingPointUpdate (startingPoint) {
      console.log('onStartingPointUpdate (list) : now "' + startingPoint + '"')
      this.startingPoint = startingPoint
    },
    async setStartingPosition (position, implyPoint) {
      console.log('setStartingPosition (list)', position)
      if (!position.coords || !position.coords.latitude || !position.coords.longitude) {
        return console.error('setStartingPosition (list) : position format not supported')
      }
      eventBus.$emit('set-starting-position', position)
      if (!implyPoint) { return }
      const startingPoint = await this.getCityByCoordinates(position.coords)
      this.setStartingPoint(startingPoint)
    },
    setStartingPoint (startingPoint) {
      console.log('setStartingPoint (list)', startingPoint)
      if (!this.showMap) {
        eventBus.$emit('show-map')
      }
      eventBus.$emit('set-starting-point', startingPoint)
      this.loading = false
    },
    startItineraryProcess () {
      if (!this.showMap) {
        eventBus.$emit('show-map')
      }
      // Necessary to emit the checked items with their coordinates.
      const formattedCheckedItems = []
      for (const checkedItem of this.checkedItems) {
        const originalCheckedItem = this.items.find(
          item => item.title === checkedItem,
        )
        formattedCheckedItems.push({
          name: checkedItem,
          position: {
            lat: +originalCheckedItem.latitude,
            lng: +originalCheckedItem.longitude,
          },
        })
      }
      this.iteneraryDisplayed = true
      eventBus.$emit('process-itinerary', formattedCheckedItems)
    },
    emitCheckedItems (value) {
      // console.log('emitCheckedItems', value)
      if (!this.showMap) {
        eventBus.$emit('show-map')
        setTimeout(() => eventBus.$emit('checked-items', value), 1000)
      } else {
        // console.log('checked-items', value)
        eventBus.$emit('checked-items', value)
      }
    },
    viewDomain (domain) {
      eventBus.$emit('goto-domain', domain)
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/styles/ressources/variables.scss";

.select-list-container {
  padding: 1.5rem;
  background-color: $white;
  & > .col > .line {
    margin-bottom: 1.5rem;
    width: 100%;
    font-weight: 600;
    justify-content: flex-start;
    &.list {
      flex: 1;
    }
    &.valid {
      color: $green-d2;
    }
  }
  .el-button {
    flex: none;
  }
  .el-button + .el-button {
    margin-left: 12px;
  }
  .el-checkbox-group {
    max-width: 100%;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .el-checkbox-button {
      display: block;

      .el-checkbox-button__inner {
        display: flex;
        padding: 0;
        border-radius: 6px;
        border: 2px solid lightgray;
        overflow: hidden;
        margin: 0 4px 8px 0;
        &:hover {
          border: 2px solid $green-l1;
        }
        .el-card {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          width: 100%;
        }
        .el-button.view-domain {
          border: 0;
          border-radius: 0;
        }
      }
      &.is-checked {
        .el-checkbox-button__inner {
          border: 2px solid $green-d2;
        }
        .number {
          background-color: $green-d2;
        }
      }
    }
    .el-checkbox {
      display: block;
      .el-checkbox__label {
        max-width: 95%;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: $green-d2;
      }
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
      margin-top: 0.5rem;
    }
  }
  .el-icon-location-outline {
    transform: scaleX(1.7) scaleY(1.8) translateY(-1px) translateX(2px);
  }
  .el-input-group__append {
    flex-shrink: 0;
  }
  .filter-domain {
    flex: 1;
    margin-right: 10px;
  }
}
</style>
