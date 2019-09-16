<template>
  <div class="domain-details">
    <div class="line">
      <h1 class="title">{{ domain.title }}</h1>
    </div>

    <div class="line mb20">
      <el-button v-if="domain.mail" @click="sendMail(domain.mail)" icon="el-icon-message">{{ domain.mail }}</el-button>
      <el-button v-show="domain.phones && domain.phones.length" v-for="phone in domain.phones" :key="phone" icon="el-icon-phone-outline">{{ phone }}</el-button>
    </div>

    <p class="websites" v-if="domain.websites && domain.websites.length">
      <strong>{{ $t('domain.websites') }}&nbsp;:</strong>
      <a :href="url" v-for="url in domain.websites" :key="url">
        {{ url }}
        <span class="comma">,&nbsp;</span>
      </a>
    </p>

    <!--
    <p>{{ domain.address }}<br><i class="el-icon-location-outline"/>{{ domain.town }}</p>

    <a v-if="domain.socialFacebook" :href="domain.socialFacebook">
      <img alt="facebook" src="http://www.vins-bergeracduras.fr/wp-content/themes/vins-de-bergerac/images/icone_facebook.png">
    </a>

    <el-row :gutter="20">
      <el-tag v-for="tag in domain.tags" :key="tag" type="info" size="medium">
        {{ tag }}
      </el-tag>
    </el-row>
    -->

    <div class="glasses line start mb20">
      <strong class>{{ $t('domain.varieties') }}&nbsp;:</strong>
      <div class="wine" v-for="(wine, index) in wines" :key="index">
        <div class="text" :class="wine">{{ readable(wine) }}</div>
        <div class="icon glass" :class="wine" />
      </div>
    </div>

    <div class="separator line">
      <i class="el-icon-more-outline" />
    </div>

    <el-container direction="vertical" v-if="!domain.message" class="description mb10">
      <p v-if="$i18n.locale === 'fr'">{{ domain.description }}</p>
      <p v-if="$i18n.locale === 'en'">{{ domain.descriptionEn }}</p>
    </el-container>

    <el-carousel >
      <el-carousel-item v-for="item in domain.photos" :key="item">
        <img :src="item" />
      </el-carousel-item>
    </el-carousel>
    <el-alert v-if="domain.message" :title="domain.message" center :closable="false" type="warning" show-icon />
  </div>
</template>

<script>
const winesDisplayOrder = ['blanc-sec', 'blanc-moelleux', 'blanc-liquoreux', 'rose', 'rouge']

export default {
  props: {
    domain: {
      type: Object,
      default: null,
      required: true,
    },
    theme: {
      type: String,
      default: 'modal',
    },
  },
  data () {
    return {
      wines: [],
    }
  },
  mounted () {
    this.setWines()
  },
  methods: {
    setWines () {
      if (!this.domain.tags || !this.domain.tags.length) {
        return console.error('this domain has no wines tags', this.domain)
      }
      winesDisplayOrder.forEach((wine) => {
        const tag = 'vin-' + wine
        if (this.domain.tags.includes(tag)) {
          this.wines.push(tag)
        }
      })
    },
    readable (wineTag) {
      switch (wineTag) {
        case 'vin-blanc-sec':
          return 'Blanc sec'
        case 'vin-blanc-moelleux':
          return 'Blanc moelleux'
        case 'vin-blanc-liquoreux':
          return 'Blanc liquoreux'
        case 'vin-rose':
          return 'Rosé'
        case 'vin-rouge':
          return 'Rouge'
        default:
          return wineTag
      }
    },
    sendMail (to) {
      const subject = this.$t('domain.sendMailSubject')
      const body = this.$t('domain.sendMailBody')
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/styles/ressources/icons.scss";
@import "@/assets/styles/ressources/mixins.scss";
@import "@/assets/styles/ressources/variables.scss";

.domain-details {
  .title {
    color: $red-d2;
    text-align: center;
    word-break: break-word;
    font-size: 250%;
    margin-top: 10px;
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
  .websites a:last-child .comma {
    display: none;
  }
  .wine {
    display: flex;
    margin: 5px;
    .text {
      border-bottom: 2px dotted;
      white-space: nowrap;
      &.vin-blanc-sec {
        border-color: $blanc;
      }
      &.vin-blanc-moelleux {
        border-color: $moelleux;
      }
      &.vin-blanc-liquoreux {
        border-color: $liquoreux;
      }
      &.vin-rose {
        border-color: $rose;
      }
      &.vin-rouge {
        border-color: $rouge;
      }
    }
  }
}
.el-dialog {
  width: 70%;
}

.el-carousel__container{
  height: 500px;
  text-align: center;
}

@include medium-screen-and-down {
  .el-dialog {
    width: 100%;
    height: 100%;
    margin: 0 !important;
  }

  .el-carousel__container{
    height: 200px;
  }

  .el-carousel__indicators--horizontal{
    display: none
  }
  .el-carousel__item{
    img{
       max-width:100%;
    height:auto;
    }
  }
}
</style>
