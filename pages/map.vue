<template>
  <el-container direction="vertical" class="page-map">
    <Header />
    <div class="color-line"/>
    <el-main>
      <div class="line">
        <h1 class="title">Itinéraire</h1>
      </div>
      <div class="map-container">
        <GoogleMap />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import GoogleMap from '~/components/Google-Map.vue'
import Header from '~/components/Header.vue'

export default {
  components: {
    GoogleMap,
    Header,
  },
}
</script>

<style lang="scss" scoped>
.color-line {
  background-color: $green-d3;
}
.title {
  margin: 40px;
}
.page-map {
  background: $green-d4;
  min-height: 100vh;
}
.map-container {
  display: flex;
  justify-content: center;
}
</style>
