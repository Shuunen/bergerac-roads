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
      let requests = []
      // let results = []
      // let directionsDisplay = new google.maps.DirectionsRenderer()
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          console.log(position)
          for (let marker of newSelectedMarkers) {
            requests.push({
              origin: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              destination: marker,
              travelMode: google.maps.DirectionsTravelMode.DRIVING,
            })
          }
          for (let request of requests) {
            directionsService.route(request, (response, status) => {
              console.log(response)
              if (status == google.maps.DirectionsStatus.OK) {
                console.log(response.routes[0].legs[0].distance.value)
                // Get the biggest result and set it as arrival point and others as waypoints
              }
            })
          }
        })
      } else {
        alert('Geolocation is not supported by this browser.')
      }
      // this.$refs.mapRef.$mapPromise.then(map => {})
    },
  },
}
</script>

<style>
</style>
