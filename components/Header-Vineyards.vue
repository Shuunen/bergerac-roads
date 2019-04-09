<template>
  <el-dropdown class="vineyards" v-loading="loading">
    <span class="el-dropdown-link">{{ $t('vineyards.titles.ours') }}<i class="el-icon-arrow-down el-icon--right" /></span>
    <el-dropdown-menu slot="dropdown">
      <nuxt-link v-for="vineyard in vineyards" :key="vineyard.id" :to="$i18n.path('vignoble/' + vineyard.name)">
        <el-dropdown-item>{{ $t('vineyards.' + vineyard.name + '.title') }}</el-dropdown-item>
      </nuxt-link>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
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
      this.$db.getVineyards().then((vineyards) => {
        console.log('Header Vineyards : got ', vineyards)
        this.vineyards = vineyards
        this.loading = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ressources/variables.scss";

.el-dropdown {
  height: 20px;
  color: $white;
  cursor: pointer;
  margin-top: 16px;
  margin-right: 10px;
}
</style>
