<template>
  <div class="select-list-container col" :style="{ height: `${height}px` }">
    <div class="line" :class="[checkedItems.length ? 'valid' : 'todo']">{{ $t('search.introduction') }}</div>
    <div class="line list">
      <el-checkbox-group v-model="checkedItems" @change="emitCheckedItems">
        <el-checkbox v-for="item in items" :key="item.id" :label="item.title" />
      </el-checkbox-group>
    </div>
    <div class="line" :class="[startingPoint.length ? 'valid' : 'todo']">{{ $t('search.helpStart') }}</div>
    <div class="line">
      <el-input ref="autocomplete" :placeholder="$t('search.start')" v-model="startingPoint" clearable @clear="setStartingPoint('')">
        <el-button slot="append" @click="getNavigatorPosition">{{ $t('search.findMe') }} <i class="el-icon-location-outline el-icon-right" /></el-button>
      </el-input>
    </div>
    <div class="line help-text" :class="[canCreate ? 'valid' : 'todo']">{{ canCreate ? $t('search.helpCreateAfter') : $t('search.helpCreateBefore') }}</div>
    <el-button :disabled="!canCreate" @click="launchItineraryProcessing">{{ $t('search.itinerary') }}</el-button>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import { eventBus } from '../store/index'

export default {
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
      startingPoint: '',
      retry: 3,
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
      // Reinitialize the checked items' list when the items' list changes.
      this.checkedItems = []
    },
  },
  mounted() {
    // Selects or not by clicking on the button in infowindow.
    eventBus.$on('select-marker', selectedMarker => {
      let index = this.checkedItems.findIndex(item => item === selectedMarker.title)
      if (index === -1) {
        this.checkedItems.push(selectedMarker.title)
      } else {
        this.checkedItems.splice(index, 1)
      }
    })
    eventBus.$on('set-starting-point', async position => {
      if (typeof position === 'object') {
        await this.getCityByCoordinates(position.coords).then(positionStr => (this.startingPoint = positionStr))
      } else {
        this.startingPoint = position
      }
      console.log('starting point now set to', this.startingPoint)
    })
    this.initAutoComplete()
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
      let autocomplete = new this.google.maps.places.Autocomplete(this.$refs.autocomplete.$refs.input, {
        // Restrict autocomplete to results in France.
        componentRestrictions: {
          country: 'fr',
        },
      })
      autocomplete.addListener('place_changed', () => {
        this.setStartingPoint(autocomplete.getPlace().formatted_address)
      })
    },
    getCityByCoordinates(coords) {
      console.log('looking for city at coords', coords)
      return new Promise((resolve, reject) => {
        const geocoder = new this.google.maps.Geocoder()
        const location = { lat: coords.latitude, lng: coords.longitude }
        geocoder.geocode({ location }, (results, status) => {
          if (status === 'OK') {
            if (results[0] && results[0].address_components) {
              resolve(this.getCityFromAddressComponents(results[0].address_components))
            } else {
              console.error('No results found')
              reject('error, NO_RESULTS')
            }
          } else {
            console.error('Geocoder failed due to: ' + status)
            reject('error, ' + status)
          }
        })
      })
    },
    getCityFromAddressComponents(components) {
      let city = null
      components.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.short_name
        }
      })
      return city
    },
    getNavigatorPosition() {
      console.log('getNavigatorPosition...')
      eventBus.$emit('show-map')
      eventBus.$emit('get-navigator-position')
    },
    setStartingPoint(value) {
      eventBus.$emit('set-starting-point', value)
    },
    launchItineraryProcessing() {
      // Necessary to emit the checked items with their coordinates.
      let formattedCheckedItems = []
      for (let checkedItem of this.checkedItems) {
        let originalCheckedItem = this.items.find(item => item.title === checkedItem)
        formattedCheckedItems.push({
          name: checkedItem,
          position: {
            lat: +originalCheckedItem.latitude,
            lng: +originalCheckedItem.longitude,
          },
        })
      }
      eventBus.$emit('process-itinerary', formattedCheckedItems)
    },
    emitCheckedItems(value) {
      eventBus.$emit('checked-items', value)
    },
  },
}
</script>

<style lang="scss">
.select-list-container {
  padding: 1.5rem;
  background-color: $white;
  & > .line {
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
    .el-checkbox {
      display: block;
      .el-checkbox__label {
        max-width: 95%;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
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
}
</style>
