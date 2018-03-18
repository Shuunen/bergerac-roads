<template>
  <el-container class="header">
    <Logo />
    <Lang />
  </el-container>
</template>

<script>
import Lang from "./Header-Lang.vue";
import Logo from "./Header-Logo.vue";

export default {
  components: {
    Lang,
    Logo
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  width: 100%;
  padding: 0 10px;
}
</style>
