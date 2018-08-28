<template>
  <el-container direction="vertical" class="page-encart page-domaine">
    <Header />
    <div class="color-line"/>
    <div class="background" :style="backgroundStyle"/>
    <el-main>
      <div class="encart" v-loading="loading">
        <div class="line">
          <h1 class="title">{{ data.title }}</h1>
        </div>

        <el-row :gutter="20">
          <el-tag v-for="tag in data.tags" :key="tag" type="info" size="medium">
            {{ tag }}
          </el-tag>
        </el-row>

        <span class="glasses line">
          <div class="icon glass" v-for="(wine, index) in wines" :key="index" :class="wine" />
        </span>

        <el-container direction="vertical" v-if="!data.message">
          <p>{{ data.description }} </p>
        
        </el-container>
        <el-alert v-if="data.message" :title="data.message" center :closable="false" type="warning" show-icon/>
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

const winesToDisplay = ['blanc', 'moelleux', 'liquoreux', 'rose', 'rouge']

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      loading: true,
      backgroundStyle: {},
      data: {},
    }
  },
  computed: {
    image: function() {
      let path = process.env.cdn + '/images/pixabay/bouchon-01.jpg'
      if (!this.data) {
        console.warn('data not available, using default image...')
        return path
      }
      if (this.data.photos && this.data.photos.length) {
        path = this.data.photos[0]
      } else {
        console.warn('image not available, using default one...')
      }
      return path
    },
    added: function() {
      if (!this.data.updated) {
        return null
      }
      const options = {
        month: 'long',
        day: 'numeric',
      }
      /*
        year: "numeric",
        hour: "numeric",
        minute: "numeric"
      */
      // see : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/DateTimeFormat
      const date = new Date(this.data.updated)
      const added = new Intl.DateTimeFormat('fr-FR', options).format(date)
      return added
    },
    wines: function() {
  let wines = []
  if (this.data.tags && this.data.tags.length) {
    winesToDisplay.forEach(wine => {
      const tag = 'vin-' + wine
      if (this.data.tags.includes(tag)) {
        wines.push(tag)
      }
    })
  }
  return wines
},
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // get ressource id
      const matches = document.location.pathname.match(/\/([\w]+)-/)
      if (matches && matches.length === 2) {
        const id = matches[1]
        this.loading = true
        this.$db.getDomain(id).then(domain => {
          if (domain) {
            console.log('Domain page : got domain', domain)
            this.data = domain
          } else {
            console.error('failed at getting domain with id "' + id + '"')
          }
          this.loading = false
          this.backgroundStyle = { backgroundImage: 'url(' + this.image + ')' }
        })
      } else {
        this.loading = false
        this.data = {
          title: 'Domaine inconnu',
          message: 'Désolé mais ce domaine n\'a pas été trouvé.',
        }
        this.backgroundStyle = { backgroundImage: 'url(' + this.image + ')' }
      }
    },
  },
}
</script>


<style lang="scss">

.icon.glass {
  &.vin-rouge {
    @include sprite($glass-rouge);
  }
  &.vin-blanc {
    @include sprite($glass-blanc);
  }
  &.vin-moelleux {
    @include sprite($glass-moelleux);
  }
  &.vin-liquoreux {
    @include sprite($glass-liquoreux);
  }
  &.vin-rose {
    @include sprite($glass-rose);
  }
}
</style>