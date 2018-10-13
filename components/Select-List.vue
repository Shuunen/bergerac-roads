<template>
  <div class="select-list-container" :style="{ height: `${height}px` }" v-loading="loading">

    <div class="col start parent-height">
      <div class="line help-text" :class="[canCreate ? 'valid' : 'todo']">{{ canCreate ? $t('search.helpCreateAfter') : $t('search.helpCreateBefore') }}</div>

      <div class="line" :class="[startingPoint.length ? 'valid' : 'todo']">1) {{ $t('search.helpStart') }}</div>
      <div class="line">
        <el-input ref="autocomplete" :placeholder="$t('search.start')" v-model="startingPoint" clearable @clear="setStartingPoint('')">
          <el-button slot="append" @click="getNavigatorPosition">{{ $t('search.findMe') }} <i class="el-icon-location-outline el-icon-right" /></el-button>
        </el-input>
      </div>

      <div class="line" :class="[checkedItems.length ? 'valid' : 'todo']">
        2) {{ $tc('search.' + (!checkedItems.length ? 'introduction' : 'domainsSelected'), checkedItems.length, {nb:checkedItems.length}) + (checkedItems.length > 1 ? 's' : '') + (checkedItems.length > 0 ? '' : ' :') }}
      </div>
      <div class="line">
        <el-button :disabled="!canCreate" @click="launchItineraryProcessing">{{ $t('search.itinerary') }}</el-button>
      </div>
      <div class="line">
        <el-input class="filter-domain" v-model="filterDomain" @change="doFilterDomains" prefix-icon="el-icon-search" />
        <el-button :disabled="!filterDomain.length" @click="doFilterDomains">{{ $t('search.filterDomains') }}</el-button>
      </div>
      <div class="line list" v-show="itemsSorted.length">
        <el-checkbox-group v-model="checkedItems" @change="emitCheckedItems" v-loading="filteringDomains">
          <el-checkbox-button v-for="domain in itemsSorted" :key="domain.id" :label="domain.title">
            <Domain :data="domain" :size="'inline'" />
          </el-checkbox-button>
        </el-checkbox-group>
      </div>

      <div class="line help-text valid" v-show="!loading && !itemsSorted.length">{{ $t('search.noEntries') }}</div>

    </div>
  </div>

</template>

<script>
import Domain from './Domain.vue'
import { gmapApi } from 'vue2-google-maps'
import { eventBus } from '../store/index'
import orderBy from 'lodash/orderBy'
import debounce from 'lodash/debounce'

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
  data() {
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
    canCreate: function() {
      return this.checkedItems.length && this.startingPoint.length
    },
  },
  watch: {
    items: function() {
      // Reinitialize the checked items list when the items list changes.
      console.log('cleared checked items')
      this.checkedItems = []
      this.sortItems(true)
    },
  },
  mounted() {
    // Selects or not by clicking on the button in infowindow.
    eventBus.$on('select-marker', selectedMarker => {
      console.log('on select-marker')
      let index = this.checkedItems.findIndex(
        item => item === selectedMarker.title,
      )
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

    eventBus.$on(
      'domains-search-complete',
      () => (this.filteringDomains = false),
    )

    eventBus.$on('set-starting-point', async position => {
      if (typeof position === 'object') {
        console.log(
          'set-starting-point (list) : converting object to string...',
        )
        this.getCityByCoordinates(position.coords)
      } else {
        this.startingPoint = position
        this.loading = false
        console.log(
          'set-starting-point (list) : now set to "' + this.startingPoint + '"',
        )
      }
    })

    this.initAutoComplete()

    this.sortItemsDebounced = debounce(this.sortItems, 1500)
    this.sortItemsDebounced(true)

    this.emitFilterDomainDebounced = debounce(this.emitFilterDomain, 500)

    // this.listenFilterDomain(true)
  },
  methods: {
    initAutoComplete() {
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
      let autocomplete = new this.google.maps.places.Autocomplete(
        this.$refs.autocomplete.$refs.input,
        {
          // Restrict autocomplete to results in France.
          componentRestrictions: {
            country: 'fr',
          },
        },
      )
      autocomplete.addListener('place_changed', () => {
        this.setStartingPoint(autocomplete.getPlace().formatted_address)
      })
    },
    /*
    listenFilterDomain(activate) {
      const el = document.querySelector('.filter-domain input:not(.handled)')
      if (!el) {
        console.log(
          'cannot find filter domain to add or remove listener, aborting.',
        )
        return
      }
      console.log(
        (activate ? 'adding' : 'removing') +
          ' event listener on filter domain...',
      )
      if (activate) {
        el.addEventListener('keyup', this.emitFilterDomain)
        el.classList.add('handled')
      } else {
        el.removeEventListener('keyup', this.emitFilterDomain)
        el.classList.remove('handled')
      }
    },
    scrollToNoEntries() {
      document.querySelector('.no-entries').scrollIntoView({
        behavior: 'smooth',
      })
    },
    */
    preselectItems(itemIds) {
      console.log('preselecting domains...')
      this.checkedItems = []
      itemIds.forEach(itemId => {
        this.checkedItems.push(
          this.items.find(item => item.id === itemId).title,
        )
      })
      this.emitCheckedItems(this.checkedItems)
    },
    sortItems(noTimeout) {
      const timeout = noTimeout ? 0 : 300
      if (timeout) {
        this.loading = true
      }
      if (this.iteneraryDisplayed) {
        this.launchItineraryProcessing()
      }
      setTimeout(() => {
        console.log('sorting items in list with ' + timeout + 'ms timeout')
        this.itemsSorted = orderBy(
          this.items,
          ['selected', 'title'],
          ['desc', 'asc'],
        )
        // if (timeout) {
        this.loading = false
        // }
        this.emitItemIdsForUrl()
      }, timeout)
    },
    emitItemIdsForUrl() {
      const ids = this.items.filter(item => item.selected).map(item => item.id)
      // console.log('will set theses domains ids in url', ids)
      eventBus.$emit('set-domains-url', ids)
    },
    getCityByCoordinates(coords) {
      /* console.log(
        'getCityByCoordinates : looking for city at coords "' +
          JSON.stringify(coords) +
          '"',
      ) */
      const geocoder = new this.google.maps.Geocoder()
      const location = { lat: coords.latitude, lng: coords.longitude }
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK') {
          if (results[0] && results[0].address_components) {
            this.getCityFromAddressComponents(results[0].address_components)
          } else {
            console.error('getCityByCoordinates :  no results found')
          }
        } else {
          console.error(
            'getCityByCoordinates : geocoder failed due to "' + status + '"',
          )
        }
      })
    },
    getCityFromAddressComponents(components) {
      let city = ''
      components.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.short_name
        }
      })
      if (city.length) {
        console.log('getCityFromAddressComponents : city found "' + city + '"')
      } else {
        console.error('getCityFromAddressComponents : city not found :(')
      }
      this.setStartingPoint(city)
    },
    getNavigatorPosition() {
      console.log('getNavigatorPosition...')
      this.loading = true
      if (!this.showMap) {
        eventBus.$emit('show-map')
        setTimeout(() => eventBus.$emit('get-navigator-position'), 1000)
      } else {
        eventBus.$emit('get-navigator-position')
      }
    },
    doFilterDomains() {
      this.emitFilterDomainDebounced()
    },
    emitFilterDomain() {
      this.filteringDomains = true
      eventBus.$emit('filter-domain', this.filterDomain)
    },
    setStartingPoint(value) {
      if (!this.showMap) {
        eventBus.$emit('show-map')
      }
      eventBus.$emit('set-starting-point', value)
    },
    launchItineraryProcessing() {
      if (!this.showMap) {
        eventBus.$emit('show-map')
      }
      // Necessary to emit the checked items with their coordinates.
      let formattedCheckedItems = []
      for (let checkedItem of this.checkedItems) {
        let originalCheckedItem = this.items.find(
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
    emitCheckedItems(value) {
      // console.log('emitCheckedItems', value)
      if (!this.showMap) {
        eventBus.$emit('show-map')
        setTimeout(() => eventBus.$emit('checked-items', value), 1000)
      } else {
        // console.log('checked-items', value)
        eventBus.$emit('checked-items', value)
      }
    },
  },
}
</script>

<style lang="scss">
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
  .el-checkbox-group {
    max-width: 100%;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .el-checkbox-button {
      &,
      .el-checkbox-button__inner {
        display: block;
      }
      .el-checkbox-button__inner {
        padding: 0;
        border-radius: 6px;
        border: 2px solid lightgray;
        overflow: hidden;
        margin: 0 4px 8px 0;
        &:hover {
          border: 2px solid $green-l1;
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
  .el-button {
    flex: none;
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
