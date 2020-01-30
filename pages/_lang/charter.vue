<template>
  <el-container direction="vertical" class="page-encart page-charter">
    <Header />
    <div class="color-line" />
    <div class="background" :style="backgroundStyle" />
    <el-main>
      <div class="encart" v-loading="loading">
        <div class="line">
          <h1 class="title">{{ $t('charter.title') }}</h1>
        </div>
        <el-container direction="vertical">
            <h2 class="title">{{ $t('charter.subtitle-1') }}</h2>
          <p>{{ $t('charter.body-1-1') }}</p>
          <p>{{ $t('charter.body-1-2') }}</p>
          <h2 class="title">{{ $t('charter.subtitle-2') }}</h2>
           <ul>
              <li v-for="(element, index) in $t(`charter.commitments`)" :key="index">{{ element }}</li>
            </ul>
            <h2 class="title">{{ $t('charter.subtitle-3') }}</h2>
            <p>{{ $t('charter.body-3-1') }}</p>
        </el-container>
        <div class="col">
          <nuxt-link :to="$i18n.path('')">
            <el-button icon="el-icon-arrow-left" class="back">{{ $t('common.back-home') }}</el-button>
          </nuxt-link>
        </div>
      </div>
    </el-main>
    <Footer />
  </el-container>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Header,
    Footer,
  },
  data () {
    return {
      loading: false,
      backgroundStyle: { backgroundImage: `url(${process.env.cdn}/images/pixabay/bouchon-01.jpg)` },
    }
  },
}
</script>
