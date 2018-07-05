<template>
  <el-container direction="vertical" class="domain" :class="size">
    <nuxt-link :to="$i18n.path(link)">
      <el-card class="domain-card take-height">
        <el-container :direction="size === 'small' ? 'horizontal' : 'vertical'">
          <div class="image" v-lazy:background-image="image">
            <div class="label" v-if="label" :class="['label-' + label]" />
          </div>
          <div class="infos col">
            <div class="line">
              <span class="title">{{ data.title }}</span>
              <span class="glasses line">
                <svg class="icon glass" viewbox="0 0 24 24" v-for="(wine, index) in wines" :key="index" :class="wine">
                  <use xlink:href="./icons/icons.svg#glass" />
                </svg>
              </span>
            </div>
            <div class="description" v-if="description">{{ description }}</div>
          </div>
        </el-container>
      </el-card>
    </nuxt-link>
  </el-container>
</template>

<script>
import getSlug from 'speakingurl'
import { truncate } from 'lodash'

const winesToDisplay = ['blanc', 'moelleux', 'liquoreux', 'rose', 'rouge']

const descriptionSize = {
  small: 140,
  medium: 150,
  large: 230,
}

export default {
  props: {
    size: {
      type: String,
      default: 'medium',
      required: false,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    link: function() {
      return 'domaine/' + this.data.id + '-' + getSlug(this.data.title)
    },
    image: function() {
      let path = '/icons/no-image.png'
      if (this.data.thumbnail) {
        path = this.data.thumbnail
      } else if (this.data.photos && this.data.photos.length) {
        path = this.data.photos[0]
      }
      return path
    },
    description: function() {
      let description = ''
      if (this.data.description && this.data.description.length) {
        description = this.cleanDescription(this.data.description)
        const max = descriptionSize[this.size]
        let extract = truncate(description, {
          length: max,
          omission: '.',
          separator: '.',
        })
        // if the text extract is too far from the targeted max length
        // we stop cutting plain sentences and start cutting inside sentences
        if (extract.length < 0.7 * description.length) {
          extract = truncate(description, {
            length: max,
            omission: '...',
            separator: ' ',
          })
        }
        description = extract
      }
      return description
    },
    label: function() {
      let label = null
      if (this.data.labels && this.data.labels.length) {
        label = this.data.labels[0]
      }
      return label
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
      const added = new Intl.DateTimeFormat('fr-FR', options).format(new Date(this.data.updated))
      return added
    },
  },
  methods: {
    cleanDescription(str) {
      str = str.replace(/(\\n)+([\s]+)?/gim, '. ')
      str = str.replace(/[\\.\s]+(\.)/gim, '.')
      str = str.replace(/\\"/gim, '"')
      str = str.replace(/[\n]([a-z1-9])/gim, ' $1')
      return str
    },
  },
}
</script>

<style lang="scss">
.domain {
  &,
  & a {
    cursor: pointer;
    height: 100%;
    text-decoration: none;
  }
  .domain-card {
    overflow: hidden;
    .el-card__body {
      padding: 0;
    }
  }
  .image {
    position: relative;
    display: block;
    background-size: cover;
    background-position: center;
  }
  .infos {
    padding: 10px;
    align-items: flex-start;
    flex-wrap: wrap;
    .title {
      font-size: 120%;
      margin-right: 10px;
      margin-bottom: 5px;
    }
    .time {
      margin-top: 6px;
      color: $red-d4;
    }
    .icon.glass {
      height: 24px;
      width: 18px;
      &.vin-rouge {
        color: $rouge;
      }
      &.vin-blanc {
        color: $blanc;
      }
      &.vin-moelleux {
        color: $moelleux;
      }
      &.vin-liquoreux {
        color: $liquoreux;
      }
      &.vin-rose {
        color: $rose;
      }
    }
  }
  &.small,
  &.medium {
    .label {
      position: absolute;
      bottom: 0;
      border-top-right-radius: 7px;
    }
    .domain-card,
    .image {
      border-top-left-radius: 60px;
    }
    .image {
      border-bottom-right-radius: 60px;
    }
  }
  &.small {
    .image {
      height: 160px;
      min-width: 140px;
    }
  }
  &.medium {
    .image {
      height: 220px;
      min-width: 170px;
    }
  }
  &.large {
    .label {
      border-bottom-right-radius: 7px;
    }
    .domain-card,
    .image {
      border-top-right-radius: 60px;
    }
    .image {
      height: 220px;
      min-width: 350px;
    }
  }
  @media only screen and (min-width: 768px) {
    &.small {
      max-width: 30%;
    }
    &.medium {
      max-width: 40%;
    }
    &.large {
      max-width: 60%;
    }
  }
}
</style>
