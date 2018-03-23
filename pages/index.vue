<template>
  <el-container direction="vertical" class="index">
    <Header />
    <HomeTop />
    <LastDomains />
    <Footer />
  </el-container>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import HomeTop from '~/components/Home-Top.vue'
import LastDomains from '~/components/Last-Domains.vue'

export default {
  components: {
    LastDomains,
    HomeTop,
    Header,
    Footer,
  },
  mounted() {
    if (
      !document.location.protocol.includes('https') &&
      document.location.hostname.includes('.com')
    ) {
      document.location.protocol = 'https'
    } else {
      console.info('protocol is https or should not be enforced to https')
    }
  },
}
</script>
