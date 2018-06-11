<template>
  <el-container direction="vertical" class="index">
    <Header />
    <HomeTop />
    <Search />
    <LastDomains />
    <Footer />
  </el-container>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import HomeTop from '~/components/Home-Top.vue'
import LastDomains from '~/components/Last-Domains.vue'
import Search from '~/components/Search.vue'

export default {
  components: {
    LastDomains,
    Search,
    HomeTop,
    Header,
    Footer,
  },
}
</script>
