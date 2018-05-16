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

const markers = [
  {
    name: 'Bergerac',
    position: { lat: 44.853806, lng: 0.4833919999999807 },
  },
  {
    name: 'Bourdeilles',
    position: { lat: 45.323881, lng: 0.5855199999999741 },
  },
  {
    name: 'Monbazillac',
    position: { lat: 44.793529, lng: 0.49216100000001006 },
  },
  {
    name: 'Montignac',
    position: { lat: 45.064332, lng: 1.1613800000000083 },
  },
  {
    name: 'Périgueux',
    position: { lat: 45.184029, lng: 0.721114899999975 },
  },
]

export default {
  data() {
    return {
      markers,
    }
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then(map => {
      let google = gmapApi()
      let directionsService = new google.maps.DirectionsService()
      let directionsDisplay = new google.maps.DirectionsRenderer()
      let request = {
        origin: markers[0].position,
        destination: markers[4].position,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
      }
      directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setMap(map)
          directionsDisplay.setDirections(response)
        }
      })
    })
  },
}
</script>

<style>
</style>
