<template>
  <el-container class="header" :class="[ floating ? 'floating': 'fixed' ]">
    <Logo />
    <h1 :v-if="title">{{ title }}</h1>
    <Lang />
  </el-container>
</template>

<script>
import Lang from "./Header-Lang.vue";
import Logo from "./Header-Logo.vue";

export default {
  props: {
    title: {
      type: String
    },
    floating: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Lang,
    Logo
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  padding: 0 10px;
  flex-grow: 0;
  &.floating {
    position: absolute;
  }
}
h1 {
  color: $bright;
  align-self: center;
  flex-grow: 1;
  text-align: center;
  font-size: 5rem;
}
</style>
