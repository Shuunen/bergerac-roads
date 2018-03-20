<template>
  <el-container direction="vertical" class="index">
    <Header />
    <HomeTop />
    <LastDomains />
    <Footer />
  </el-container>
</template>

<script>
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import HomeTop from "~/components/Home-Top.vue";
import LastDomains from "~/components/Last-Domains.vue";

export default {
  components: {
    LastDomains,
    HomeTop,
    Header,
    Footer
  }
};
</script>
