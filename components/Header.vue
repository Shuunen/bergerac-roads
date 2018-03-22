<template>
  <el-container class="header" :class="[ floating ? 'floating': 'fixed' ]">
    <div class="logo-wrapper">
      <Logo />
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
.line {
  flex-grow: 1;
}
.logo-wrapper,
.lang-wrapper {
  width: 220px;
}
.lang-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
