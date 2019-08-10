<template>
  <el-container direction="vertical" class="page-encart page-domaine">
    <Header />
    <div class="color-line" />
    <div class="background" :style="backgroundStyle" />

    <el-main>
      <div class="encart" v-loading="loading">
        <div class="line">
          <h1 class="title">{{ data.title }}</h1>
        </div>

        <div class="line quick-actions">
          <el-button v-if="data.mail" @click="sendMail" icon="el-icon-message">{{ data.mail }}</el-button>
          <el-button v-show="data.phones && data.phones.length" v-for="phone in data.phones" :key="phone" icon="el-icon-phone-outline">{{ phone }}</el-button>
        </div>

        <p v-if="data.websites && data.websites.length">
          <strong>Site web</strong>
          &nbsp;: {{ data.websites.join(', ') }}
        </p>
        <!--
          <p>{{ data.address }}<br><i class="el-icon-location-outline"/>{{ data.town }}</p>

          <a v-if="data.socialFacebook" :href="data.socialFacebook">
            <img alt="facebook" src="http://www.vins-bergeracduras.fr/wp-content/themes/vins-de-bergerac/images/icone_facebook.png">
          </a>

          <el-row :gutter="20">
            <el-tag v-for="tag in data.tags" :key="tag" type="info" size="medium">
              {{ tag }}
            </el-tag>
          </el-row>
        -->

        <div class="glasses line start">
          <strong>Cépages</strong>&nbsp;:
          <div class="icon glass" v-for="(wine, index) in wines" :key="index" :class="wine" />
        </div>

        <div class="separator line">
          <i class="el-icon-more-outline" />
        </div>

        <el-container direction="vertical" v-if="!data.message" class="description">
          <p v-if="$i18n.locale === 'fr'">{{ data.description }}</p>
          <p v-if="$i18n.locale === 'en'">{{ data.descriptionEn }}</p>
        </el-container>

        <el-alert v-if="data.message" :title="data.message" center :closable="false" type="warning" show-icon />
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

const winesToDisplay = ['blanc-sec', 'blanc-moelleux', 'blanc-liquoreux', 'rose', 'rouge']

export default {
  components: {
    Header,
    Footer,
  },
  data () {
    return {
      loading: true,
      backgroundStyle: {},
      data: {},
    }
  },
  computed: {
    image () {
      let path = process.env.cdn + '/images/pixabay/bouchon-01.jpg'
      if (!this.data) {
        console.warn('data not available, using default image...')
        return path
      }
      if (this.data.photos && this.data.photos.length) {
        path = process.env.cdnBase + this.data.photos[0]
      } else {
        console.warn('image not available, using default one...')
      }
      path = path.replace('cdn/none', 'height/' + 400)
      return path
    },
    added () {
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
    wines () {
      const wines = []
      if (this.data.tags && this.data.tags.length) {
        winesToDisplay.forEach((wine) => {
          const tag = 'vin-' + wine
          if (this.data.tags.includes(tag)) {
            wines.push(tag)
          }
        })
      }
      return wines
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // get ressource id
      const matches = document.location.pathname.match(/\/([\w]+)-/)
      if (matches && matches.length === 2) {
        const id = matches[1]
        this.loading = true
        this.$db.getDomain(id).then((domain) => {
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
          title: this.$t('domain.unknownTitle'),
          message: this.$t('domain.unknownMessage'),
        }
        this.backgroundStyle = { backgroundImage: 'url(' + this.image + ')' }
      }
    },
    sendMail () {
      const mail = this.data.mail
      const subject = this.$t('domain.sendMailSubject')
      const body = this.$t('domain.sendMailBody')
      window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`
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
  padding-bottom: 10px;
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
