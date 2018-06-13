<template>
  <el-container direction="vertical" class="search-container">
    <el-main>
      <h2>{{ $t('search.header') }}</h2>
      <div class="search-input">
        <multiselect
          v-model="searchValue"
          label="name"
          track-by="id"
          :multiple="true"
          :options="options"
          :placeholder="$t('search.placeholder')"
          :searchable="false"
          :select-label="$t('search.select')"
          :deselect-label="$t('search.deselect')"
          :selected-label="$t('search.selected')"
        />
        <el-button
          icon="el-icon-search"
          :disabled="searchValue.length === 0"
          @click="search"
          circle
        />
      </div>
      <p class="no-result" v-if="searchExecuted && sites.length === 0">
        {{ $t('search.noResult') }}
      </p>
      <el-row class="map-container" v-else-if="searchExecuted">
        <el-col :span="8" :xs="24">
          <SelectList :items="sites" :height="mapContainerHeight" />
        </el-col>
        <el-col :span="16" :xs="24">
          <GoogleMap :markers="sites" :height="mapContainerHeight" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Multiselect from 'vue-multiselect'
import GoogleMap from '~/components/Google-Map.vue'
import SelectList from '~/components/Select-List.vue'
import { getDomainsByTags } from '~/utils/db'
import { getTags } from '~/utils/db'

export default {
  components: {
    GoogleMap,
    Multiselect,
    SelectList,
  },
  data() {
    return {
      mapContainerHeight: 600,
      options: [],
      sites: [],
      searchExecuted: false,
      searchValue: [],
    }
  },
  mounted() {
    getTags().then(tags => this.options = tags)
  },
  methods: {
    search() {
      getDomainsByTags(this.searchValue.map(tag => tag.code)).then(domains => {
        this.sites = domains
        this.searchExecuted = true
      })
    },
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
  .search-input {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    .el-button {
      margin-left: 2rem;
    }
  }
  .no-result {
    color: $white;
  }
  .map-container {
    padding: 2rem 0;
  }
}
</style>
