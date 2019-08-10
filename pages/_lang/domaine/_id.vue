<template>
  <el-container direction="vertical" class="page-encart page-domaine">
    <Header />
    <div class="color-line" />
    <div class="background" :style="backgroundStyle" />

    <el-main>
      <div class="encart" v-loading="loading">
        <DomainDetails v-if="domain && domain.id" :domain="domain" theme="page" />
      </div>
    </el-main>

    <Footer />
  </el-container>
</template>

<script>
import DomainDetails from '~/components/Domain-Details.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    DomainDetails,
    Header,
    Footer,
  },
  data () {
    return {
      loading: true,
      backgroundStyle: {},
      domain: null,
    }
  },
  computed: {
    image () {
      let path = process.env.cdn + '/images/pixabay/bouchon-01.jpg'
      if (!this.domain) {
        console.warn('data not available, using default image...')
        return path
      }
      if (this.domain.photos && this.domain.photos.length) {
        path = process.env.cdnBase + this.domain.photos[0]
      } else {
        console.warn('image not available, using default one...')
      }
      path = path.replace('cdn/none', 'height/' + 400)
      return path
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      // get ressource id
      const matches = document.location.pathname.match(/\/([\w]+)-/)
      if (matches && matches.length === 2) {
        const id = matches[1]
        this.$db.getDomain(id).then(this.setDomain)
      } else {
        this.setDomain()
      }
    },
    setDomain (domain) {
      this.domain = domain || { title: this.$t('domain.unknownTitle'), message: this.$t('domain.unknownMessage') }
      console.log('displaying domain', this.domain)
      this.loading = false
      this.backgroundStyle = { backgroundImage: 'url(' + this.image + ')' }
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/styles/ressources/icons.scss";

.icon.glass {
  &.vin-rouge {
    @include sprite($glass-rouge);
  }
  &.vin-blanc-sec {
    @include sprite($glass-blanc);
  }
  &.vin-blanc-moelleux {
    @include sprite($glass-moelleux);
  }
  &.vin-blanc-liquoreux {
    @include sprite($glass-liquoreux);
  }
  &.vin-rose {
    @include sprite($glass-rose);
  }
}

.aside {
  width: 27%;
  margin: 18px;
  background-color: #f1a029b0;
  padding: 10px 20px;
  border-radius: 7px;
}

.aside ul {
  list-style: none;
  padding: 0;
}

.aside > h1 {
  color: white;
  font-size: 201%;
  text-align: center;
}
.quick-actions {
  padding-bottom: 20px;
}
.separator {
  padding: 10px;
  font-size: 200%;
}
.description {
  line-height: 2;
  & > p::first-letter {
    font-size: 200%;
    margin-right: 5px;
    color: $red-d2;
    line-height: 1;
  }
}
</style>
