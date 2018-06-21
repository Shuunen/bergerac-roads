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
        marker.selected = (checkedItems.findIndex(item => item === marker.title) !== -1)
      }
      this.$forceUpdate()
    })
    eventBus.$on('set-starting-point', position => {
      this.startingPoint = position
    })
    eventBus.$on('process-itinerary', checkedItems => {
      let promises = []
      this.getStartingPoint().then(position => {
        for (let item of checkedItems) {
          promises.push(this.createDistanceRequest(position, item))
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
      return new Promise(resolve => {
        if (this.startingPoint !== '') {
          resolve(this.startingPoint)
        } else {
          if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.')
            return
          }
          navigator.geolocation.getCurrentPosition(
            position => {
              resolve(position)
            },
            error => {
              if (error.code === error.PERMISSION_DENIED) {
                alert('Geolocation must be allowed for this feature to work.')
              }
            },
          )
        }
      })
    },
    // Apply the itinerary to the map with its reference.
    displayItinerary(request) {
      this.$refs.mapRef.$mapPromise.then(map => {
        let directionsService = new this.google.maps.DirectionsService()
        directionsService.route(request, (response, status) => {
          if (status === this.google.maps.DirectionsStatus.OK) {
            this.directionsDisplay.setMap(map)
            this.directionsDisplay.setDirections(response)
          } else {
            alert('Directions request failed due to : ' + status)
          }
        })
      })
    },
    // Create a promise for each selected place in order to get the distance
    // between the user and each one of them.
    createDistanceRequest(position, marker) {
      let directionsService = new this.google.maps.DirectionsService()
      let request = {
        origin: this.getFormattedPosition(position),
        destination: marker,
        travelMode: this.google.maps.DirectionsTravelMode.DRIVING,
      }
      return new Promise(resolve => {
        directionsService.route(request, (response, status) => {
          if (status === this.google.maps.DirectionsStatus.OK) {
            resolve({
              location: response.request.destination.query,
              distance: response.routes[0].legs[0].distance.value,
            })
          }
        })
      })
    },
    // Get the formatted position depending on the type of it.
    getFormattedPosition(position) {
      return typeof position === 'string'
        ? position
        : {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
    },
    // Get the furthest place between all selected places in order to set it as arrival point.
    getFurthestPlace(places) {
      let maxDistance = Math.max(...places.map(place => place.distance))
      let furthestPlaceIndex = places.findIndex(place => {
        return place.distance === maxDistance
      })
      return places.splice(furthestPlaceIndex, 1)[0]
    },
    openInfoWindow(marker) {
      this.markers.map(marker => marker.infoWindowOpen = false)
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
