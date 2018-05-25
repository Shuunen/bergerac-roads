<template>
  <el-container direction="vertical" class="page-map">
    <Header />
    <div class="color-line"/>
    <el-main>
      <div class="line">
        <h1 class="title">Itinéraire</h1>
      </div>
      <div class="map-container">
        <SelectList :items="sites" @get-checked-items="selectedSites = $event" />
        <GoogleMap :markers="sites" :selected-markers="selectedSites" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios'
import GoogleMap from '~/components/Google-Map.vue'
import Header from '~/components/Header.vue'
import SelectList from '~/components/Select-List.vue'

export default {
  components: {
    GoogleMap,
    Header,
    SelectList,
  },
  data() {
    return {
      sites: [],
      selectedSites: [],
    }
  },
  created() {
    axios.get('/mock/items.json').then(res => (this.sites = res.data))
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
