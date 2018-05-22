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
// import { gmapApi } from 'vue2-google-maps'

export default {
  props: {
    markers: {
      type: Array,
      required: true,
    },
  },
  // mounted() {
  //   this.$refs.mapRef.$mapPromise.then(map => {
  //     let google = gmapApi()
  //     let directionsService = new google.maps.DirectionsService()
  //     let directionsDisplay = new google.maps.DirectionsRenderer()
  //     let request = {
  //       origin: markers[0].position,
  //       destination: markers[4].position,
  //       travelMode: google.maps.DirectionsTravelMode.DRIVING,
  //     }
  //     directionsService.route(request, (response, status) => {
  //       if (status == google.maps.DirectionsStatus.OK) {
  //         directionsDisplay.setMap(map)
  //         directionsDisplay.setDirections(response)
  //       }
  //     })
  //   })
  // },
}
</script>

<style>
</style>
