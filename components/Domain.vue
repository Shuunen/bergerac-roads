<template>
  <el-container direction="vertical" class="domain">
    <nuxt-link :to="$i18n.path(link)">
      <el-card class="domain-card take-height">
        <el-container direction="vertical">
          <div class="image" v-lazy:background-image="image" />
          <div class="infos">
            <span class="title">{{ data.title }}</span>
            <time class="time">ajouté le {{ added }}</time>
          </div>
        </el-container>
      </el-card>
    </nuxt-link>
  </el-container>
</template>

<script>
import getSlug from 'speakingurl'

export default {
  props: {
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
      let path = '/icones/no-image.png'
      if (this.data.thumbnail) {
        path = this.data.thumbnail
      } else if (this.data.photos && this.data.photos.length) {
        path = this.data.photos[0]
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
      const added = new Intl.DateTimeFormat('fr-FR', options).format(new Date(this.data.updated))
      return added
    },
  },
}
</script>

<style lang="scss" scoped>
.domain {
  cursor: pointer;
  a {
    text-decoration: none;
  }
}
.image {
  width: 100%;
  display: block;
  min-height: 130px;
  flex-grow: 1;
  background-size: cover;
  background-position: center;
}
.infos {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: $moelleux-l2;
  .title {
    font-size: 120%;
  }
  .time {
    margin-top: 6px;
    color: $red-d4;
  }
}

/* height fix */
.domain,
.domain a {
  height: 100%;
}
</style>
