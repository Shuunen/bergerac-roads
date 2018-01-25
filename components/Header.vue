<template>
  <el-container class="header" :class="[ floating ? 'floating': 'fixed' ]">
    <div class="wrapper wrapper--logo"><Logo /></div>
    <div class="wrapper wrapper--charter hidden-xs-and-down"><nuxt-link :to="$i18n.path('charter')">{{ $t('charter.title') }}</nuxt-link></div>
    <div class="push-right hidden-sm-and-up" />
    <div class="wrapper wrapper--vineyards hidden-xxs-only"><Vineyards /></div>
    <div class="push-right hidden-xs-and-up" />
    <div class="wrapper wrapper--lang"><Lang /></div>
  </el-container>
</template>

<script>
import Lang from './Header-Lang.vue'
import Logo from './Header-Logo.vue'
import Vineyards from './Header-Vineyards.vue'

export default {
  components: {
    Lang,
    Logo,
    Vineyards,
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
.wrapper {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
}
.wrapper--logo {
  width: 220px;
}
.wrapper--charter {
  margin-left: auto;
  a {
    color: $white;
    line-height: 54px;
    margin-right: 20px;
  }
}
.wrapper--lang {
  padding-left: 20px;
}
</style>
