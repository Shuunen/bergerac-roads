<template>
  <el-container :direction="size === 'inline' ? 'horizontal' : 'vertical'" class="domain" :class="size">
    <el-card @click.native="viewDomain()" class="domain-card take-height">
      <el-container :direction="['small', 'inline'].includes(size) ? 'horizontal' : 'vertical'">
        <div class="image" v-lazy:background-image="image">
          <div class="number line" v-if="number">
            {{ number }}
            <div class="icon pin" />
          </div>
          <div class="label" v-if="label && size !== 'inline'" :class="['label-' + label]">
            <div class="icon" />
          </div>
        </div>
        <div class="infos col">
          <div class="line">
            <span class="title">{{ data.title }}</span>
            <span class="glasses line" v-if="size !== 'inline'">
              <div class="icon glass" v-for="(wine, index) in wines" :key="index" :class="wine" />
            </span>
          </div>
          <div class="description" v-if="description">{{ description }}</div>
        </div>
      </el-container>
    </el-card>
  </el-container>
</template>

<script>
import truncate from 'lodash/truncate'
import { eventBus } from '../store'

const winesToDisplay = ['blanc', 'moelleux', 'liquoreux', 'rose', 'rouge']

const descriptionSize = {
  inline: 140,
  small: 140,
  medium: 150,
  large: 230,
}

const imageSize = {
  inline:'60x60',
  small: '587x260',
  medium: '587x260',
  large: '658x260',
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
    number: function() {
      return this.data.number
    },
    image: function() {
      let path = '/icons/no-image.png'
      if (this.data.thumbnail) {
        path = this.data.thumbnail
      } else if (this.data.photos && this.data.photos.length) {
        path = process.env.cdnBase + this.data.photos[0]
        path = path.replace('cdn/none', 'crop/' + imageSize[this.size])
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
      const added = new Intl.DateTimeFormat('fr-FR', options).format(
        new Date(this.data.updated),
      )
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
    viewDomain() {
      if (this.size === 'inline') {
        return
      }
      eventBus.$emit('goto-domain', this.data)
    }
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
  .number {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: $red-d2;
    color: $white;
    padding: 2px 2px 2px 7px;
    border-top-right-radius: 7px;
    .icon.pin {
      height: 24px;
      width: 20px;
      background-image: url(#{$cdn}/images/pin.png);
      background-repeat: no-repeat;
      background-size: contain;
      margin-right: 2px;
      margin-left: 2px;
    }
  }
  .label {
    border-bottom-right-radius: 7px;
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
  }
  &.small,
  &.medium {
    .number + .label {
      display: none;
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
    .domain-card,
    .image {
      border-top-right-radius: 60px;
    }
    .image {
      height: 220px;
      min-width: 350px;
    }
  }
  &.inline {
    & > a {
      pointer-events: none;
      width: 100%;
    }
    .el-card {
      border: 0;
    }
    .image {
      height: 60px;
      width: 60px;
      & + .infos {
        width: calc(100% - 60px);
      }
    }
    .number {
      border-radius: 0;
      width: 100%;
    }
    .infos.col {
      justify-content: space-around;
      padding: 5px 10px;
    }
    .infos .line,
    .description {
      width: 100%;
    }
    .title,
    .description {
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: auto;
      margin-bottom: 0;
      text-align: left;
      line-height: 1;
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
