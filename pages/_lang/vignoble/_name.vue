<template>
  <el-container direction="vertical" class="page-encart page-domaine">
    <Header />
    <div class="color-line" />
    <div class="background" :style="backgroundStyle" />
    <el-main>
      <div class="encart" v-loading="loading">
        <template v-if="loading || !loading && !vineyardExists">
          <div class="line">
            <h1 class="title">
              {{ $t(`vineyards.loading.title`) }}
            </h1>
          </div>
          <p>{{ $t(`vineyards.loading.message`) }}</p>
        </template>
        <template v-else-if="vineyardExists">
          <!-- TODO: make a component of this : -->
          <div class="line">
            <h1 class="title">
              {{ $t(`vineyards.${name}.title`) }}
            </h1>
          </div>
          <div>
            <p>{{ $t(`vineyards.${name}.information`) }}</p>
            <h2 class="subtitle">
              {{ $t(`vineyards.${name}.introduction`) }}
            </h2>
            <p>{{ $t(`vineyards.${name}.presentation`) }}</p>
            <h2 class="subtitle">
              {{ $t('vineyards.titles.summary') }}
            </h2>
            <p>{{ $t(`vineyards.${name}.summary`) }}</p>
            <h2 class="subtitle">
              {{ $t('vineyards.titles.numbers') }}
            </h2>
            <ul>
              <li v-for="(element, index) in $t(`vineyards.${name}.numbers`)" :key="index">
                {{ element }}
              </li>
            </ul>
            <h2 class="subtitle">
              {{ $t('vineyards.titles.varieties') }}
            </h2>
            <ul>
              <li v-for="(element, index) in $t(`vineyards.${name}.varieties`)" :key="index">
                {{ element }}
              </li>
            </ul>
            <h2 class="subtitle">
              {{ $t('vineyards.titles.typicity') }}
            </h2>
            <ul>
              <li v-for="(element, index) in $t(`vineyards.${name}.typicity`)" :key="index">
                {{ element }}
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div class="line">
            <h1 class="title">
              {{ $t(`vineyards.error.title`) }}
            </h1>
          </div>
          <div>
            <h2 class="subtitle">
              {{ $t(`vineyards.error.available`) }}
            </h2>
            <ul>
              <li v-for="(vineyard, index) in vineyards" :key="index">
                <nuxt-link :to="$i18n.path(`vignoble/${vineyard.name}`)">
                  {{ $t(`vineyards.${vineyard.name}.title`) }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </template>
        <div class="col">
          <nuxt-link :to="$i18n.path('')">
            <el-button icon="el-icon-arrow-left" class="back">
              {{ $t('common.back-home') }}
            </el-button>
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
  asyncData({ params }) {
    return {
      loading: false,
      backgroundStyle: {
        backgroundImage: `url(${process.env.cdn}/images/vignobles/${params.name}.jpg)`,
      },
      name: params.name,
      vineyards: [],
      vineyardExists: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.$db.getVineyards().then(vineyards => {
        this.vineyards = vineyards
        const exists = vineyards.some(vineyard => this.name === vineyard.name)
        let image = `${process.env.cdn}/images/`
        if (exists) {
          image += `vignobles/${this.name}.jpg)`
        } else {
          // default image
          image += 'pixabay/bouchon-01.jpg'
        }
        this.backgroundStyle.backgroundImage = `url(${image})`
        this.vineyardExists = exists
        this.loading = false
      })
    },
  },
}
</script>
