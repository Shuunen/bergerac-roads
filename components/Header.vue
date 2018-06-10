<template>
  <el-container class="header" :class="[ floating ? 'floating': 'fixed' ]">
    <div class="logo-wrapper">
      <Logo />
    </div>
    <!-- Next div is temporary and will eventually have to be moved -->
    <div class="menu">
      <nuxt-link :to="$i18n.path('vignoble/bergerac')">
        <el-button type="text">Bergerac</el-button>
      </nuxt-link>
      <nuxt-link :to="$i18n.path('vignoble/duras')">
        <el-button type="text">Duras</el-button>
      </nuxt-link>
      <nuxt-link :to="$i18n.path('vignoble/monbazillac')">
        <el-button type="text">Monbazillac</el-button>
      </nuxt-link>
      <nuxt-link :to="$i18n.path('vignoble/montravel')">
        <el-button type="text">Montravel</el-button>
      </nuxt-link>
      <nuxt-link :to="$i18n.path('vignoble/pecharmant')">
        <el-button type="text">Pécharmant</el-button>
      </nuxt-link>
      <nuxt-link :to="$i18n.path('vignoble/rosette')">
        <el-button type="text">Rosette</el-button>
      </nuxt-link>
      <nuxt-link :to="$i18n.path('vignoble/saussignac')">
        <el-button type="text">Saussignac</el-button>
      </nuxt-link>
    </div>
    <div class="lang-wrapper">
      <Lang />
    </div>
  </el-container>
</template>

<script>
import Lang from './Header-Lang.vue'
import Logo from './Header-Logo.vue'

export default {
  components: {
    Lang,
    Logo,
  },
  props: {
    floating: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  padding: 0 20px;
  flex-grow: 0;
  &.floating {
    position: absolute;
    z-index: 10;
  }
}
// Next selector is temporary
.menu {
  flex: 1;
  display: flex;
  justify-content: space-around;
  .el-button {
    margin-top: 0.4rem;
  }
}
.line {
  flex-grow: 1;
}
.logo-wrapper,
.lang-wrapper {
  width: 220px;
  flex-shrink: 0;
}
.lang-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
}
</style>
