<template>
  <el-container direction="vertical" class="page-domaine">
    <Header />
    <div class="color-line"></div>
    <div class="background" :style="{ backgroundImage: 'url(' + image + ')' }"></div>
    <el-main v-loading="loading">
      <div class="line">
        <h1 class="title">{{ data.title }}</h1>
      </div>
      <el-container direction="vertical" class="encart" v-if="!data.message">
        <p>Ut {{ data.id }} enim quisque sibi plurimum confidit et ut quisque maxime virtute et sapientia sic munitus est, ut nullo egeat suaque omnia in se ipso posita iudicet, ita in amicitiis expetendis colendisque maxime excellit. Quid enim? Africanus indigens mei? Minime hercule! ac ne ego quidem illius; sed ego admiratione quadam virtutis eius, ille vicissim opinione fortasse non nulla, quam de meis moribus habebat, me dilexit; auxit benevolentiam consuetudo. Sed quamquam utilitates multae et magnae consecutae sunt, non sunt tamen ab earum spe causae diligendi profectae.</p>
        <p>Iamque non umbratis fallaciis res agebatur, sed qua palatium est extra muros, armatis omne circumdedit. ingressusque obscuro iam die, ablatis regiis indumentis Caesarem tunica texit et paludamento communi, eum post haec nihil passurum velut mandato principis iurandi crebritate confirmans et statim inquit exsurge et inopinum carpento privato inpositum ad Histriam duxit prope oppidum Polam, ubi quondam peremptum Constantini filium accepimus Crispum.</p>
        <p>Superatis Tauri montis verticibus qui ad solis ortum sublimius attolluntur, Cilicia spatiis porrigitur late distentis dives bonis omnibus terra, eiusque lateri dextro adnexa Isauria, pari sorte uberi palmite viget et frugibus minutis, quam mediam navigabile flumen Calycadnus interscindit.</p>
        <p>Hac ex causa conlaticia stipe Valerius humatur ille Publicola et subsidiis amicorum mariti inops cum liberis uxor alitur Reguli et dotatur ex aerario filia Scipionis, cum nobilitas florem adultae virginis diuturnum absentia pauperis erubesceret patris.</p>
        <p>Siquis enim militarium vel honoratorum aut nobilis inter suos rumore tenus esset insimulatus fovisse partes hostiles, iniecto onere catenarum in modum beluae trahebatur et inimico urgente vel nullo, quasi sufficiente hoc solo, quod nominatus esset aut delatus aut postulatus, capite vel multatione bonorum aut insulari solitudine damnabatur.</p>
      </el-container>
      <el-alert v-if="data.message" :title="data.message" center :closable="false" type="warning" show-icon></el-alert>
      <div class="col">
        <nuxt-link to="/">
          <el-button class="back">Retour à l'accueil</el-button>
        </nuxt-link>
        <div class="grappe"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Header from "~/components/Header.vue";
import { getDomain } from "~/utils/db";

export default {
  data() {
    return {
      loading: true,
      data: {}
    };
  },
  computed: {
    link: function() {
      return "/domaine/" + this.data.id + "/" + getSlug(this.data.title);
    },
    image: function() {
      return this.data.image || "/images/pixabay/bouchon-01.jpg";
    },
    added: function() {
      if (!this.data.updated) {
        return null;
      }
      const options = {
        month: "long",
        day: "numeric"
      };
      /*
        year: "numeric",
        hour: "numeric",
        minute: "numeric"
      */
      // see : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/DateTimeFormat
      const added = new Intl.DateTimeFormat("fr-FR", options).format(
        new Date(this.data.updated)
      );
      return added;
    }
  },
  methods: {
    init() {
      // get ressource id
      const matches = document.location.pathname.match(/\/(\d)-/);
      if (matches && matches.length === 2) {
        const id = matches[1];
        this.loading = true;
        getDomain(id).then(domain => {
          console.log("Domain page : got domain", domain);
          this.loading = false;
          this.data = domain;
        });
      } else {
        this.loading = false;
        this.data = {
          title: "Domaine inconnu",
          message: "Désolé mais ce domaine n'a pas été trouvé."
        };
      }
    }
  },
  components: {
    Header
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.color-line {
  background-color: $red-d2;
}
.page-domaine {
  background: $red-d4;
  min-height: 100vh;
  padding-bottom: 10px;
}
.title {
  margin: 30px 0 20px;
  color: $red-d4;
}
.background {
  background-position: center;
  background-size: cover;
  height: 400px;
}
.el-main {
  background: $white;
  padding: 0 40px;
  margin: -100px 20px 20px;
}
.back {
  margin-top: 10px;
}
.grappe {
  margin: 20px;
}
</style>
