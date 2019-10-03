<template>
  <el-container direction="vertical" class="page-encart page-legal">
    <Header />
    <div class="color-line" />
    <div class="background" :style="backgroundStyle" />
    <el-main>
      <div class="encart" v-loading="loading">
        <div class="line">
          <h1 class="title">{{ $t('legal.title') }}</h1>
        </div>
        <el-container direction="vertical">
          <div>
            <h3>Raison sociale</h3>
            <p>
              <strong>Interprofession des Vins de Bergerac et de Duras</strong><br>1 rue des récollets<br>24100 Bergerac<br>Tél.&nbsp;: (33) 05 53 63 57 57<br>Fax&nbsp;: (33) 05 53 63 01 30<br>E-mail&nbsp;:&nbsp;<a href="mailto:contact@vins-bergeracduras.fr">contact@vins-bergeracduras.fr</a><br>Site Internet&nbsp;:&nbsp;<a title="http://www.vins-bergeracduras.fr/" href="http://www.vins-bergeracduras.fr/">http://www.vins-bergeracduras.fr/</a><br>
              RCS&nbsp;: 78&nbsp;164&nbsp;132&nbsp;900 011<br>
              Numéro de TVA&nbsp;: FR 21&nbsp;781&nbsp;641 329<br>
              Code NAF&nbsp;: 911A<br>
              Directeur de la publication&nbsp;: Vincent Bergeon – Directeur de l’IVBD
            </p>
            <h3>Conseil de modération</h3>
            <p>
              Nous vous rappelons que l’abus d’alcool est dangereux pour la santé et que les Vins de Bergerac sont à consommer avec modération.<br><i>Pour plus d’informations sur une consommation modérée, consultez le site&nbsp;<a title="http://www.vinetsociete.fr" href="http://www.vinetsociete.fr/">http://www.vinetsociete.fr</a>&nbsp;de vin et société</i>
            </p>
            <h3>Traitement des données à caractère personnel</h3>
            <p>
              Conformément aux dispositions de la loi n°&nbsp;78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, vous disposez d’un droit d’accès, de modification, de rectification et de suppression des données qui vous concernent. Pour demander une modification, rectification ou suppression des données vous concernant, il vous suffit d’envoyer un courrier par voie électronique ou postale à l’IVBD en justifiant de votre identité.
            </p>
            <p>Envoyer un message électronique à&nbsp; <a href="mailto:contact@vins-bergeracduras.fr">contact@vins-bergeracduras.fr</a></p>
            <p>Envoyer un courrier postal à : <em><br>Interprofession des Vins de Bergerac et de Duras<br>1 rue des récollets<br>24100 Bergerac</em></p>
            <p>Si vous êtes abonné à des services d’information par courrier électronique, vous pouvez demander à ne plus recevoir ces courriers soit comme indiqué ci-dessus, soit en suivant les instructions figurant sur ces courriers.
            </p>
            <h3>Liens Hypertextes&nbsp;: responsabilité</h3>
            <p>
              <a title="www.vins-bergeracduras.fr" href="http://www.vins-bergeracduras.fr/">www.vins-bergeracduras.fr</a>&nbsp;propose de nombreux liens vers d’autres sites. Nous indiquons systématiquement vers quel site nous vous proposons d’aller. Cependant, ces pages web dont les adresses sont régulièrement vérifiées ne font pas partie du portail&nbsp;: elles n’engagent pas la responsabilité de la rédaction du site.
            </p>
            <h3>Établir un lien</h3>
            <p>
              Tout site public ou privé est autorisé à établir, sans autorisation préalable, un lien vers les informations diffusées sur&nbsp;<a title="www.vins-bergeracduras.fr" href="http://www.vins-bergeracduras.fr/">www.vins-bergeracduras.fr</a>.
            </p>
            <p>En revanche, les pages du portail ne doivent pas être imbriquées à l’intérieur des pages d’un autre site.</p>

            <h3>Propriété Intellectuelle</h3>
            <p>
              Toutes les données et informations contenues sur ce site font l’objet d’une protection au titre du droit d’auteur et des droits de propriété intellectuelle. L’accès à notre site vous confère un droit d’usage privé et non exclusif de ce site.<br>Toute reproduction ou distribution non autorisée de tout ou partie des éléments et informations de ce site est interdite. Pour toute demande de reproduction ou d’utilisation d’éléments contenus sur&nbsp;<a title="www.vins-bergeracduras.fr" href="http://www.vins-bergeracduras.fr/">www.vins-bergeracduras.fr</a>, envoyez un courrier à IVBD– 1 rue des récollets – 24100 Bergerac ou envoyer un e-mail à&nbsp;<a href="mailto:contact@vins-bergeracduras.fr">contact@vins-bergeracduras.fr</a>
            </p>
            <h3>Caractère des informations contenues dans le site</h3>
            <p>
              L’IVBD met tout en œuvre pour assurer la mise à jour des informations du site. Toutefois, l’IVBD décline toute responsabilité concernant les erreurs ou omissions portant sur les informations diffusées sur ce site. L’IVBD ne peut être tenu responsable de l’interprétation des informations contenues dans ce site, ni des conséquences de leur utilisation.
            </p>
            <h3>Utilisation à des fins statistiques d’informations relatives à la navigation</h3>
            <p>L’éditeur du site établit des données statistiques sur le nombre de visiteurs, la durée de visite, l’origine des visiteurs ou encore les pages les plus vues.</p>
            <h3>Dysfonctionnement et virus</h3>
            <p>
              L’IVBD ne pourra être tenue pour responsable de dommages directs ou indirects résultant de l’utilisation de ce site web, ou de l’impossibilité pour un tiers de l’utiliser, ou d’un mauvais fonctionnement, d’une interruption, d’un virus, ou encore d’un problème de ligne ou de système.
            </p>
          </div>
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

<style lang="scss">

.page-legal{
  h3 {
    color: #040404;
    text-align: center;
    margin-top: 3em;
    font-size: 27px;
}
}
</style>
