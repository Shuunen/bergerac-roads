<template>
  <el-container direction="vertical" class="search-container">
    <el-main>
      <h2>{{ $t('search.header') }}</h2>
      <multiselect
        v-model="value"
        :options="options"
        :multiple="true"
      />
      <el-row class="map-container">
        <el-col :span="8" :xs="24">
          <SelectList :items="sites" />
        </el-col>
        <el-col :span="16" :xs="24">
          <GoogleMap :markers="sites" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import GoogleMap from '~/components/Google-Map.vue'
import SelectList from '~/components/Select-List.vue'

export default {
  components: {
    GoogleMap,
    Multiselect,
    SelectList,
  },
  data() {
    return {
      options: [
        "acces-handicape",
        "agriculture-bio",
        "agriculture-biodynamique",
        "agriculture-raisonnee",
        "accepte-animaux",
        "vente-propriete",
      ],
      sites: [],
      value: null,
    }
  },
  created() {
    axios.get('/mock/items.json').then(res => (this.sites = res.data))
  },
}
</script>

<style lang="scss" scoped>
.search-container {
  background: $green-d4;
  h2 {
    text-align: center;
    margin: 1rem 0 2rem;
  }
  .map-container {
    padding: 2rem 0;
  }
}
</style>
