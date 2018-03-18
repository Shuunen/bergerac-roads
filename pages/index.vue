<template>
  <el-container direction="vertical" class="index">
    <Header />
    <HomeTop />
  </el-container>
</template>

<script>
import Header from '~/components/Header.vue'
import HomeTop from '~/components/Home-Top.vue'

export default {
  components: {
    HomeTop,
    Header
  }
}
</script>

<style>

</style>
