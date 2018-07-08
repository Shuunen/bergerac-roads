<template>
  <GmapMap
    :center="center"
    :zoom="10"
    map-type-id="terrain"
    ref="mapRef"
    :style="{ height: `${height}px` }"
  >
    <GmapMarker
      v-for="marker in formattedMarkers"
      :key="marker.id"
      :position="marker.position"
      :clickable="true"
      :draggable="true"
      @click="openInfoWindow(marker)"
    >
      <GmapInfoWindow
        :opened="marker.infoWindowOpen"
        @closeclick="marker.infoWindowOpen = false"
      >
        <p class="infowindow-title">{{ marker.title }}</p>
        <div class="button-container">
          <el-button @click="selectMarker(marker)">
            {{ marker.selected ? $t('search.unselectButton') : $t('search.selectButton') }}
          </el-button>
        </div>
      </GmapInfoWindow>
    </GmapMarker>
  </GmapMap>
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
    markers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      center: {
        lat: 44.85,
        lng: 0.35,
      },
      startingPoint: '',
      resolvedNavigatorPosition: null,
    }
  },
  computed: {
    google: gmapApi,
    // Necessary in order to have only one directions renderer and
    // avoid multiple displayed itineraries.
    directionsDisplay: function() {
      return new this.google.maps.DirectionsRenderer()
    },
    formattedMarkers: function() {
      return this.markers.map(marker => {
        marker.position = {
          lat: +marker.latitude,
          lng: +marker.longitude,
        }
        marker.selected = false
        return marker
      })
    },
  },
  created() {
    eventBus.$on('checked-items', checkedItems => {
      for (let marker of this.markers) {
        marker.selected = checkedItems.findIndex(item => item === marker.title) !== -1
      }
      this.$forceUpdate()
    })
    eventBus.$on('set-starting-point', position => {
      if (typeof position === 'string') {
        console.log('set-starting-point (map) : setting starting point to "' + position + '"')
        this.startingPoint = position
        if (typeof this.resolvedNavigatorPosition === 'object') {
          console.log('set-starting-point (map) : detected that starting point was NavigatorPosition "' + position + '"')
          this.resolvedNavigatorPosition = position
        }
      } else {
        console.log('set-starting-point (map) : object detected, skip saving')
      }
    })
    eventBus.$on('get-navigator-position', () => {
      console.log('requesting navigator position...')
      this.getStartingPoint()
    })
    eventBus.$on('process-itinerary', checkedItems => {
      console.log('in process-itinerary')
      let promises = []
      this.getStartingPoint().then(position => {
        for (let item of checkedItems) {
          promises.push(this.createDistanceRequest(position, item.position))
        }
        // When all the promises are resolved, we can compare the distances.
        Promise.all(promises).then(responses => {
          let furthestPlace = this.getFurthestPlace(responses)
          // Delete the distance property to match the waypoint prototype.
          responses.forEach(response => delete response.distance)
          // Construct the request as follows : the furthest as arrival and the others
          // as waypoints (optimizeWaypoints equals to true to optimize the order).
          let request = {
            origin: this.getFormattedPosition(position),
            destination: furthestPlace.location,
            travelMode: this.google.maps.DirectionsTravelMode.DRIVING,
            waypoints: responses,
            optimizeWaypoints: true,
          }
          this.displayItinerary(request)
        })
      })
    })
  },
  methods: {
    // If starting point is set, take this one as starting point.
    // If not, take the user's current location.
    getStartingPoint() {
      console.log('in getStartingPoint')
      return new Promise((resolve, reject) => {
        if (this.startingPoint !== '') {
          console.log('getStartingPoint : starting position is already defined to "' + this.startingPoint + '"')
          this.setStartingPoint(this.startingPoint)
          resolve(this.startingPoint)
        } else if (this.resolvedNavigatorPosition) {
          console.log('getStartingPoint : resolved navigator position is "' + this.resolvedNavigatorPosition + '"')
          this.setStartingPoint(this.resolvedNavigatorPosition)
          resolve(this.resolvedNavigatorPosition)
        } else if (!navigator.geolocation) {
          console.error('getStartingPoint : geolocation not supported or failed')
          alert(this.$t('search.findMeFailed'))
          this.setStartingPoint('')
          reject('error, NOT_SUPPORTED')
        } else {
          console.log('getStartingPoint : fetching geolocation...')
          navigator.geolocation.getCurrentPosition(
            position => {
              console.log('getStartingPoint : got geolocation :)')
              this.resolvedNavigatorPosition = position
              this.setStartingPoint(position)
              resolve(position)
            },
            error => {
              if (error.code === error.PERMISSION_DENIED) {
                console.error('getStartingPoint : geolocation denied or failed')
                alert(this.$t('search.findMeDisallowed'))
                this.setStartingPoint('')
                reject('error, PERMISSION_DENIED')
              }
            },
          )
        }
      })
    },
    setStartingPoint(value) {
      console.log('in setStartingPoint')
      eventBus.$emit('set-starting-point', value)
    },
    // Apply the itinerary to the map with its reference.
    displayItinerary(request) {
      if (!this.$refs || !this.$refs.mapRef || !this.$refs.mapRef.$mapPromise) {
        console.error('cannot access mapPromise')
        return
      }
      console.log('in displayItinerary')
      this.$refs.mapRef.$mapPromise.then(map => {
        let directionsService = new this.google.maps.DirectionsService()
        directionsService.route(request, (response, status) => {
          if (status === this.google.maps.DirectionsStatus.OK) {
            this.directionsDisplay.setMap(map)
            this.directionsDisplay.setDirections(response)
            setTimeout(() => this.scrollToMap(), 300)
          } else {
            alert('Directions request failed due to : ' + status)
          }
        })
      })
    },
    scrollToMap() {
      document.querySelector('.vue-map-container').scrollIntoView({
        behavior: 'smooth',
      })
    },
    // Create a promise for each selected place in order to get the distance
    // between the user and each one of them.
    createDistanceRequest(position, markerPosition) {
      console.log('in createDistanceRequest')
      let directionsService = new this.google.maps.DirectionsService()
      let request = {
        origin: this.getFormattedPosition(position),
        destination: markerPosition,
        travelMode: this.google.maps.DirectionsTravelMode.DRIVING,
      }
      return new Promise(resolve => {
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
    getFormattedPosition(position) {
      console.log('in getFormattedPosition')
      if (typeof position === 'string') {
        return position
      } else {
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      }
    },
    // Get the furthest place between all selected places in order to set it as arrival point.
    getFurthestPlace(places) {
      console.log('in getFurthestPlace')
      let maxDistance = Math.max(...places.map(place => place.distance))
      let furthestPlaceIndex = places.findIndex(place => {
        return place.distance === maxDistance
      })
      return places.splice(furthestPlaceIndex, 1)[0]
    },
    openInfoWindow(marker) {
      console.log('in openInfoWindow')
      this.markers.map(marker => (marker.infoWindowOpen = false))
      marker.infoWindowOpen = true
    },
    selectMarker(marker) {
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
