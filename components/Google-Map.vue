<template>
  <GmapMap :center="center" :zoom="10" map-type-id="terrain" ref="mapRef" :style="{ height: `${height}px` }">
    <GmapMarker
      v-for="marker in formattedMarkers"
      :key="marker.id"
      :position="marker.position"
      :clickable="true"
      :draggable="true"
      :icon="'https://maps.google.com/mapfiles/ms/micons/'+ (marker.selected ? 'green-dot' : 'yellow')+'.png'"
      @click="openInfoWindow(marker)"
    >
      <GmapInfoWindow :opened="marker.infoWindowOpen" @closeclick="marker.infoWindowOpen = false">
        <p class="infowindow-title">{{ marker.titleWithNumber }}</p>
        <div class="button-container">
          <el-button @click="selectMarker(marker)">{{ marker.selected ? $t('search.unselectButton') : $t('search.selectButton') }}</el-button>
        </div>
      </GmapInfoWindow>
    </GmapMarker>
  </GmapMap>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import debounce from 'lodash/debounce'
import { eventBus } from '../store/index'

export default {
  props: {
    height: {
      type: Number,
      default: 300,
    },
    // domains actually but markers for 'vue2-google-maps'
    markers: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      center: {
        lat: 44.85,
        lng: 0.35,
      },
      checkedItems: [],
      startingPosition: null,
      startingPoint: null,
      iteneraryDisplayed: false,
    }
  },
  computed: {
    google: gmapApi,
    // Necessary in order to have only one directions renderer and
    // avoid multiple displayed itineraries.
    directionsDisplay () {
      return new this.google.maps.DirectionsRenderer()
    },
    formattedMarkers () {
      let markers = this.markers.map((marker) => {
        marker.position = {
          lat: +marker.latitude,
          lng: +marker.longitude,
        }
        marker.selected = false
        return marker
      })
      if (this.iteneraryDisplayed) {
        markers = markers.filter(marker => marker.selected)
      }
      return markers
    },
  },
  created () {
    this.updateItineraryDebounced = debounce(this.updateItinerary, 300)
    eventBus.$on('set-starting-point', this.setStartingPoint)
    eventBus.$on('set-starting-position', this.setStartingPosition)
    eventBus.$on('process-itinerary', this.processItinerary)
  },
  destroyed () {
    eventBus.$off('set-starting-point', this.setStartingPoint)
    eventBus.$off('set-starting-position', this.setStartingPosition)
    eventBus.$off('process-itinerary', this.processItinerary)
  },
  methods: {
    updateItinerary () {
      if (!this.iteneraryDisplayed) {
        return
      }
      console.log('updateItinerary (map)')
      this.processItinerary()
    },
    setStartingPoint (point) {
      console.log('setStartingPoint (map) : now', point)
      this.startingPoint = point
      this.updateItineraryDebounced()
    },
    setStartingPosition (position) {
      console.log('setStartingPosition (map) : now', position)
      this.startingPosition = position
      this.updateItineraryDebounced()
    },
    async processItinerary (checkedItems) {
      if (checkedItems && checkedItems.length) {
        console.log('got checkedItems from eventBus')
        this.checkedItems = checkedItems
      }
      if (this.checkedItems.length === 0) {
        return console.error('processItinerary : cannot process without items')
      }
      if (!this.startingPosition && !this.startingPoint) {
        return console.error('processItinerary : cannot process without startingPosition/startingPoint')
      }
      console.log('processItinerary : start')
      const origin = this.getFormattedPosition(this.startingPosition || this.startingPoint)
      const promises = []
      console.log('iterating over items :', this.checkedItems)
      for (const item of this.checkedItems) {
        if (item && item.position) {
          promises.push(this.createDistanceRequest(origin, item.position))
        } else {
          return console.error('item or item.position missing')
        }
      }
      // When all the promises are resolved, we can compare the distances.
      const responses = await Promise.all(promises)
      const furthestPlace = this.getFurthestPlace(responses)
      // Delete the distance property to match the waypoint prototype.
      responses.forEach(response => delete response.distance)
      // Construct the request as follows : the furthest as arrival and the others
      // as waypoints (optimizeWaypoints equals to true to optimize the order).
      const request = {
        origin,
        destination: furthestPlace.location,
        travelMode: this.google.maps.DirectionsTravelMode.DRIVING,
        waypoints: responses,
        optimizeWaypoints: true,
      }
      return this.displayItinerary(request)
    },
    // Apply the itinerary to the map with its reference.
    async displayItinerary (request) {
      if (!this.$refs || !this.$refs.mapRef || !this.$refs.mapRef.$mapPromise) {
        return console.error('displayItinerary : cannot access mapPromise')
      }
      console.log('displayItinerary : start')
      const map = await this.$refs.mapRef.$mapPromise
      const directionsService = new this.google.maps.DirectionsService()
      directionsService.route(request, (response, status) => {
        if (status !== this.google.maps.DirectionsStatus.OK) {
          return console.error('directions request failed due to : ' + status)
        }
        this.directionsDisplay.setMap(map)
        this.directionsDisplay.setDirections(response)
        eventBus.$emit('ordered-directions', response.geocoded_waypoints)
        this.iteneraryDisplayed = true
        // setTimeout(() => this.scrollToMap(), 300)
      })
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
    scrollToMap () {
      const el = document.querySelector('.vue-map-container')
      if (this.isInViewport(el)) {
        return console.log('avoid scrolling to map because already in the viewport')
      }
      console.log('scrolling to map')
      el.scrollIntoView({ behavior: 'smooth' })
    },
    // Create a promise for each selected place in order to get the distance
    // between the user and each one of them.
    createDistanceRequest (position, markerPosition) {
      // console.log('in createDistanceRequest', position, markerPosition)
      // console.log('in createDistanceRequest with position "' + position + '"')
      const directionsService = new this.google.maps.DirectionsService()
      const request = {
        origin: this.getFormattedPosition(position),
        destination: markerPosition,
        travelMode: this.google.maps.DirectionsTravelMode.DRIVING,
      }
      return new Promise((resolve) => {
        directionsService.route(request, (response, status) => {
          if (status === this.google.maps.DirectionsStatus.OK) {
            resolve({
              location: response.request.destination.location,
              distance: response.routes[0].legs[0].distance.value,
            })
          }
        })
      })
    },
    // Get the formatted position depending on the type of it.
    getFormattedPosition (position) {
      let f = null
      if (typeof position === 'string') {
        f = position
      } else if (position.coords) {
        f = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      } else if (position.lat && position.lng) {
        f = Object.assign({}, position)
      } else {
        console.error('position format not handled')
      }
      // console.log('getFormattedPosition return :', f)
      return f
    },
    // Get the furthest place between all selected places in order to set it as arrival point.
    getFurthestPlace (places) {
      // console.log('in getFurthestPlace')
      const maxDistance = Math.max(...places.map(place => place.distance))
      const furthestPlaceIndex = places.findIndex(place => place.distance === maxDistance)
      return places.splice(furthestPlaceIndex, 1)[0]
    },
    openInfoWindow (marker) {
      console.log('in openInfoWindow')
      this.markers.map(marker => (marker.infoWindowOpen = false))
      marker.infoWindowOpen = true
    },
    selectMarker (marker) {
      eventBus.$emit('select-marker', marker)
      marker.selected = !marker.selected
      this.$forceUpdate()
    },
  },
}
</script>

<style lang="scss" scoped>
.infowindow-title {
  text-align: center;
}
.button-container {
  display: flex;
  justify-content: center;
}
</style>
