<template>
  <el-container direction="vertical" class="index">
    <Header />
    <HomeTop />
    <HomeMid />
  </el-container>
</template>

<script>
import Header from "~/components/Header.vue";
import HomeTop from "~/components/Home-Top.vue";
import HomeMid from "~/components/Home-Mid.vue";

export default {
  components: {
    HomeMid,
    HomeTop,
    Header
  }
};
</script>

<style>

</style>
