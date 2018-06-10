<template>
  <el-dropdown class="vineyards" v-loading="loading">

    <span class="el-dropdown-link">{{ $t('vineyards.titles.ours') }}<i class="el-icon-arrow-down el-icon--right"/></span>
    <el-dropdown-menu slot="dropdown">
      <nuxt-link v-for="vineyard in vineyards" :key="vineyard.id" :to="$i18n.path('vignoble/' + vineyard.name)">
        <el-dropdown-item>{{ $t('vineyards.' + vineyard.name + '.title') }}</el-dropdown-item>
      </nuxt-link>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getVineyards } from '~/utils/db'

export default {
  data() {
    return {
      loading: true,
      vineyards: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      console.log('Header Vineyards : init')
      getVineyards().then(vineyards => {
        console.log('Header Vineyards : got ', vineyards)
        this.vineyards = vineyards
        this.loading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-dropdown {
  height: 20px;
  color: $white;
  cursor: pointer;
  margin-top: 20px;
  margin-right: 10px;
}
.flag {
  /*$size: 32px;
  height: $size;
  width: $size;*/
  padding-left: 22px;
  background-position: center left;
  background-repeat: no-repeat;
  &.french {
    background-image: url('/icones/french-flag-small.png');
  }
  &.english {
    background-image: url('/icones/english-flag-small.png');
  }
  &.el-dropdown-menu__item {
    padding-left: 30px;
    background-position-x: 7px;
    padding-right: 20px;
  }
}
</style>
