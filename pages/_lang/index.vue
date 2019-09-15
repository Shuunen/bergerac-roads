<template>
  <el-container direction="vertical" class="index">
    <Header />
    <HomeTop />
    <Search />
    <Domain-Lookup />
    <Footer />
  </el-container>
</template>

<script>
import DomainLookup from '~/components/Domain-Lookup.vue'
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import HomeTop from '~/components/Home-Top.vue'
import Search from '~/components/Search.vue'

export default {
  components: {
    DomainLookup,
    Footer,
    Header,
    HomeTop,
    Search,
  },
}
</script>
