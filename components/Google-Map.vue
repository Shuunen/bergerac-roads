<template>
  <GmapMap
    :center="{lat:46.9276, lng:2.2137}"
    :zoom="6"
    map-type-id="terrain"
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
</script>

<style>
</style>
