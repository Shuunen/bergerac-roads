<template>
  <GmapMap
    :center="center"
    :zoom="6"
    map-type-id="terrain"
    ref="mapRef"
    style="width: 700px; height: 600px"
  >
    <GmapMarker
      :key="index"
      v-for="(marker, index) in markers"
      :position="marker.position"
      :clickable="true"
      :draggable="true"
      @click="center=marker.position"
    />
  </GmapMap>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'

export default {
  props: {
    markers: {
      type: Array,
      required: true,
    },
    selectedMarkers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      center: {
        lat: 46.9276,
        lng: 2.2137,
      },
    }
  },
  computed: {
    google: gmapApi,
    // Necessary in order to have only one directions renderer and
    // avoid multiple displayed itineraries.
    directionsDisplay: function() {
      return new this.google.maps.DirectionsRenderer()
    },
  },
  watch: {
    selectedMarkers(newSelectedMarkers) {
      let promises = []
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.')
        return
      }
      navigator.geolocation.getCurrentPosition(
        position => {
          for (let marker of newSelectedMarkers) {
            promises.push(this.createDistanceRequest(position, marker))
          }
          // When all the promises are resolved, we can compare the distances.
          Promise.all(promises).then(responses => {
            let furthestPlace = this.getFurthestPlace(responses)
            // Delete the distance property to match the waipoint prototype.
            responses.forEach(response => delete response.distance)
            // Construct the request as follows : the furthest as arrival and the others
            // as waypoints (optimizeWaypoints equals to true to optimize the order).
            let request = {
              origin: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              destination: furthestPlace.location,
              travelMode: this.google.maps.DirectionsTravelMode.DRIVING,
              waypoints: responses,
              optimizeWaypoints: true,
            }
            this.displayItinerary(request)
          })
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation must be allowed for this feature to work.')
          }
        }
      )
    },
  },
  methods: {
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
        origin: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
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
    // Get the furthest place between all selected places in order to set it as arrival point.
    getFurthestPlace(places) {
      let maxDistance = Math.max(...places.map(place => place.distance))
      let furthestPlaceIndex = places.findIndex(place => {
        return (place.distance = maxDistance)
      })
      return places.splice(furthestPlaceIndex, 1)[0]
    },
  },
}
</script>

<style>
</style>
