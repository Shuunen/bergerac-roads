<template>
  <div class="select-list-container" :style="{ height: `${height}px` }" v-loading="loading">
    <div class="col start parent-height">
      <div class="line" :class="[canCreate ? 'valid' : 'todo']">{{ canCreate ? $t('search.helpCreateAfter') : $t('search.helpCreateBefore') }}</div>

      <div class="line" :class="[startingPoint && startingPoint.length ? 'valid' : 'todo']">
        <span>1)&nbsp;</span>
        {{ $t('search.helpStart') }}
      </div>

      <div class="line invalid" v-if="geolocationStatus.length">{{ geolocationStatus }}</div>

      <div class="line">
        <el-input ref="autocomplete" :placeholder="$t('search.start')" v-model="startingPoint" clearable @clear="setStartingPoint(null)">
          <el-button slot="append" @click="getNavigatorPosition">
            {{ $t('search.findMe') }}
            <i class="el-icon-location-outline el-icon-right" />
          </el-button>
        </el-input>
      </div>

      <div class="line" :class="[checkedItems.length ? 'valid' : 'todo']">
        <span>2)&nbsp;</span>
        <span>{{ $tc('search.' + (!checkedItems.length ? 'introduction' : 'domainsSelected'), checkedItems.length, {nb:checkedItems.length}) + (checkedItems.length > 1 ? 's' : '') + (checkedItems.length > 0 ? '' : ' :') }}</span>
      </div>

      <div class="line">
        <el-button class="full-width" :disabled="!canCreate" @click="onStartItineraryProcess">{{ $t('search.calcItinerary') }}</el-button>
      </div>
      <div class="line">
        <el-button class="full-width" :disabled="!(iteneraryDisplayed || canCreate || checkedItems.length)" @click="reset">{{ $t('search.reset') }}</el-button>
      </div>
      <div class="line">
        <el-button class="full-width" :disabled="!canCreate" @click="sendItineraryByMail">{{ $t('search.sendItinerary') }}</el-button>
      </div>
      <div class="line">
        <el-button class="link full-width" :disabled="!canCreate">
          <a class="full-width" :href="googleMapUrl" target="_blank">{{ $t('search.openInGoogleMap') }}</a>
        </el-button>
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

      <div class="line valid" v-show="!loading && !itemsSorted.length">{{ $t('search.noEntries') }}</div>
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
      filterDomain: '',
      filteringDomains: false,
      geolocationStatus: '',
      googleMapUrl: '',
      itemsSorted: [],
      iteneraryDisplayed: false,
      loading: true,
      mapDisplayed: false,
      orderedDirections: [],
      retry: 3,
      startingPoint: '',
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
      this.reset()
    },
  },
  mounted () {
    this.sortItemsDebounced = debounce(this.sortItems, 1500)
    this.sortItemsDebounced(true)
    eventBus.$on('checked-items', this.onCheckedItems)
    eventBus.$on('domains-search-complete', this.onDomainsSearchComplete)
    eventBus.$on('preselect-items', this.onPreselectItems)
    eventBus.$on('select-marker', this.onMarkerSelect)
    eventBus.$on('set-starting-point', this.onStartingPointUpdate)
    eventBus.$on('show-map', this.onShowMap)
    eventBus.$on('start-itinerary-process', this.onStartItineraryProcess)
    eventBus.$on('ordered-directions', this.onOrderedDirections)
    this.initAutoComplete()
    this.emitFilterDomainDebounced = debounce(this.emitFilterDomain, 500)
  },
  destroyed () {
    eventBus.$off('checked-items', this.onCheckedItems)
    eventBus.$off('domains-search-complete', this.onDomainsSearchComplete)
    eventBus.$off('preselect-items', this.onPreselectItems)
    eventBus.$off('select-marker', this.onMarkerSelect)
    eventBus.$off('set-starting-point', this.onStartingPointUpdate)
    eventBus.$off('show-map', this.onShowMap)
    eventBus.$off('start-itinerary-process', this.onStartItineraryProcess)
    eventBus.$off('ordered-directions', this.onOrderedDirections)
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
    onDomainsSearchComplete () {
      this.filteringDomains = false
    },
    onCheckedItems () {
      this.sortItemsDebounced()
    },
    onMarkerSelect (marker) {
      const index = this.checkedItems.findIndex(item => item === marker.title)
      if (index === -1) {
        this.checkedItems.push(marker.title)
      } else {
        this.checkedItems.splice(index, 1)
      }
      this.sortItemsDebounced()
    },
    onShowMap () {
      this.mapDisplayed = true
    },
    sendItineraryByMail () {
      const mail = ''
      const subject = this.$t('search.sendItinerarySubject')
      const body = this.$t('search.sendItineraryBody')
      const url = encodeURI(document.location.href)
      // url = encodeURI(`<a href="${url}">${url}</a>`) // cannot put html body in a mailto
      window.location.href = `mailto:${mail}?subject=${subject}&body=${body}${url}`
    },
    onPreselectItems (itemIds) {
      console.log('preselecting domains...', itemIds)
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
      setTimeout(() => {
        console.log('sorting items in list with ' + timeout + 'ms timeout')
        this.itemsSorted = orderBy(
          this.items,
          ['selected'],
          ['desc'],
        )
        this.loading = false
        this.emitItemIdsForUrl()
      }, timeout)
    },
    emitItemIdsForUrl () {
      // const ids = this.itemsSorted.filter(item => item.selected).map(item => item.id)
      const ids = (this.checkedItems || []).map(title => this.items.find(item => item.title === title).id)
      console.log('emitItemIdsForUrl', ids)
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
      this.geolocationStatus = ''
      try {
        window.navigator.geolocation.getCurrentPosition(
          position => this.setStartingPosition(position, true),
          err => this.onNavigatorPositionFail(err)
        )
      } catch (err) {
        this.onNavigatorPositionFail(err)
      }
    },
    onNavigatorPositionFail (err) {
      console.error('getNavigatorPosition : geolocation denied or failed')
      let status = this.$t('search.findMeFailed')
      if (err.message.includes('denied')) {
        status = this.$t('search.findMeDisallowed')
      } else {
        console.error(err.message)
      }
      this.geolocationStatus = status
      this.setStartingPoint(null)
    },
    onStartingPointUpdate (startingPoint) {
      console.log('onStartingPointUpdate (list) : now "' + startingPoint + '"')
      this.startingPoint = startingPoint
      this.updateGoogleMapUrl()
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
      if (!this.mapDisplayed) {
        eventBus.$emit('show-map')
      }
      eventBus.$emit('set-starting-point', startingPoint)
      this.loading = false
    },
    onOrderedDirections (directions) {
      console.log('ordered directions :', directions)
      this.orderedDirections = directions
      this.updateGoogleMapUrl()
    },
    letterInAlphabet (index) {
      return String.fromCharCode(65 + index)
    },
    updateGoogleMapUrl () {
      console.log('updating Google Map url ...')
      let url = 'https://www.google.com/maps/dir/?api=1'
      const directionsCount = this.orderedDirections.length
      const waypointLetters = []
      this.orderedDirections.forEach((direction, index) => {
        const id = direction.place_id
        const letter = this.letterInAlphabet(index)
        if (index === 0) {
          url += `&origin=${letter}&origin_place_id=${id}&waypoint_place_ids=`
        } else if (index === (directionsCount - 1)) {
          url += `&destination=${letter}&destination_place_id=${id}`
        } else {
          url += id + '|'
          waypointLetters.push(letter)
        }
      })
      url += '&waypoints=' + waypointLetters.join('|')
      // to go from A (111) to D (444) via B (222) & C (333)
      // you need this format : https://www.google.com/maps/dir/?api=1&origin=A&origin_place_id=111&waypoint_place_ids=222|333&destination=D&destination_place_id=444&waypoints=B|C
      // real example : https://www.google.com/maps/dir/?api=1&origin=A&origin_place_id=ChIJl4Sj7ErPqhIRzhf6zLLOEDc&waypoint_place_ids=ChIJV6rk54fQqhIRMloH2eZPD90|ChIJQ3IK1MDQqhIRMt7kxJNpR8E&destination=D&destination_place_id=ChIJa-zIourEqhIRAIDp1ZU_b2Y&waypoints=B|C
      this.googleMapUrl = url.replace('|&', '&')
    },
    reset () {
      console.log('reset')
      eventBus.$emit('reset-itinerary')
      this.checkedItems = []
      this.sortItems(true)
    },
    onStartItineraryProcess () {
      if (!this.mapDisplayed) {
        eventBus.$emit('show-map')
      }
      // Necessary to emit the checked items with their coordinates.
      const items = []
      for (const checkedItem of this.checkedItems) {
        const originalCheckedItem = this.items.find(
          item => item.title === checkedItem,
        )
        items.push({
          name: checkedItem,
          position: {
            lat: +originalCheckedItem.latitude,
            lng: +originalCheckedItem.longitude,
          },
        })
      }
      this.iteneraryDisplayed = true
      eventBus.$emit('process-itinerary', items)
    },
    emitCheckedItems (value) {
      // console.log('emitCheckedItems', value)
      if (!this.mapDisplayed) {
        eventBus.$emit('show-map')
        setTimeout(() => eventBus.$emit('checked-items', value), 1000)
      } else {
        // console.log('checked-items', value)
        eventBus.$emit('checked-items', value)
      }
    },
    viewDomain (domain) {
      console.log('eventBus emit domain-lookup')
      eventBus.$emit('domain-lookup', domain)
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
    flex-wrap: nowrap;
    span:first-child {
      align-self: flex-start;
    }
    &.list {
      flex: 1;
      overflow: hidden;
    }
    &.valid {
      color: $green-d2;
    }
    &.invalid {
      color: $red-d1;
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
