<template>
  <el-container direction="vertical" class="itinerary-container">
    <el-main>
      <SelectList :items="sites" @get-checked-items="selectedSites = $event" />
      <GoogleMap :markers="sites" :selected-markers="selectedSites" />
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios'
import GoogleMap from '~/components/Google-Map.vue'
import SelectList from '~/components/Select-List.vue'

export default {
  components: {
    GoogleMap,
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
.itinerary-container {
  background: $green-d4;
  .el-main {
    display: flex;
    justify-content: center;
    margin: 3rem 0;
  }
}
</style>
