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
        <el-container direction="vertical" v-if="!data.message">
          <p>Ut {{ data.id }} enim quisque sibi plurimum confidit et ut quisque maxime virtute et sapientia sic munitus est, ut nullo egeat suaque omnia in se ipso posita iudicet, ita in amicitiis expetendis colendisque maxime excellit. Quid enim? Africanus indigens mei? Minime hercule! ac ne ego quidem illius; sed ego admiratione quadam virtutis eius, ille vicissim opinione fortasse non nulla, quam de meis moribus habebat, me dilexit; auxit benevolentiam consuetudo. Sed quamquam utilitates multae et magnae consecutae sunt, non sunt tamen ab earum spe causae diligendi profectae.</p>
          <p>Iamque non umbratis fallaciis res agebatur, sed qua palatium est extra muros, armatis omne circumdedit. ingressusque obscuro iam die, ablatis regiis indumentis Caesarem tunica texit et paludamento communi, eum post haec nihil passurum velut mandato principis iurandi crebritate confirmans et statim inquit exsurge et inopinum carpento privato inpositum ad Histriam duxit prope oppidum Polam, ubi quondam peremptum Constantini filium accepimus Crispum.</p>
          <p>Superatis Tauri montis verticibus qui ad solis ortum sublimius attolluntur, Cilicia spatiis porrigitur late distentis dives bonis omnibus terra, eiusque lateri dextro adnexa Isauria, pari sorte uberi palmite viget et frugibus minutis, quam mediam navigabile flumen Calycadnus interscindit.</p>
          <p>Hac ex causa conlaticia stipe Valerius humatur ille Publicola et subsidiis amicorum mariti inops cum liberis uxor alitur Reguli et dotatur ex aerario filia Scipionis, cum nobilitas florem adultae virginis diuturnum absentia pauperis erubesceret patris.</p>
          <p>Siquis enim militarium vel honoratorum aut nobilis inter suos rumore tenus esset insimulatus fovisse partes hostiles, iniecto onere catenarum in modum beluae trahebatur et inimico urgente vel nullo, quasi sufficiente hoc solo, quod nominatus esset aut delatus aut postulatus, capite vel multatione bonorum aut insulari solitudine damnabatur.</p>
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
