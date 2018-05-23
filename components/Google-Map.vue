<template>
  <GmapMap
    :center="{lat:46.9276, lng:2.2137}"
    :zoom="6"
    map-type-id="terrain"
    ref="mapRef"
    style="width: 700px; height: 600px"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
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
      required: false,
      default: () => [],
    },
  },
  watch: {
    selectedMarkers: newSelectedMarkers => {
      let google = gmapApi()
      let directionsService = new google.maps.DirectionsService()
      let directionsDisplay = new google.maps.DirectionsRenderer()
      let promises = []
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          for (let marker of newSelectedMarkers) {
            let request = {
              origin: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              destination: marker,
              travelMode: google.maps.DirectionsTravelMode.DRIVING,
            }
            let promise = new Promise(resolve => {
              directionsService.route(request, (response, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  console.log(response.routes[0].legs[0].distance.value)
                  // Get the biggest result and set it as arrival point and others as waypoints
                  resolve({
                    query: response.request.destination.query,
                    distance: response.routes[0].legs[0].distance.value,
                  })
                }
              })
            })
            promises.push(promise)
          }
          Promise.all(promises).then(responses => {
            let maxDistance = Math.max(
              ...responses.map(response => response.distance)
            )
            let furthestPlaceIndex = responses.findIndex(response => {
              return (response.distance = maxDistance)
            })
            let furthestPlace = responses.splice(furthestPlaceIndex, 1)[0].query
            console.log(responses, furthestPlace)
            let request = {
              origin: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              destination: furthestPlace,
              travelMode: google.maps.DirectionsTravelMode.DRIVING,
              waypoints: responses.map(response => response.query),
              optimizeWaypoints: true,
            }
            // $refs is not reactive so it won't work in a watch
            // Another way must be found
            this.$refs.mapRef.$mapPromise.then(map => {
              directionsService.route(request, (response, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setMap(map)
                  directionsDisplay.setDirections(response)
                }
              })
            })
          })
        })
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
  },
}
</script>

<style>
</style>
