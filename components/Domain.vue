<template>
  <el-container direction="vertical" class="domain">
    <nuxt-link :to="link">
      <el-card :body-style="{ padding: '0px' }">
        <el-container direction="vertical">
          <div class="image" :style="{ backgroundImage: 'url(' + image + ')' }"></div>
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
import getSlug from "speakingurl";

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    link: function() {
      return "/domaine/" + this.data.id + "-" + getSlug(this.data.title);
    },
    image: function() {
      return this.data.image || "/images/no-image.png";
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
  }
};
</script>

<style lang="scss" scoped>
.domain {
  margin-bottom: 20px;
  cursor: pointer;
  a {
    text-decoration: none;
  }
}
.image {
  width: 100%;
  display: block;
  height: 180px;
  background-size: cover;
  background-position: center;
}
.infos {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: $white;
  .title {
    font-size: 1.4rem;
  }
  .time {
    margin-top: 6px;
    font-size: 1rem;
    color: #999;
  }
}
</style>
