<template>
  <el-container direction="vertical" class="home-mid">
    <el-main>
      <div class="line">
        <h2>Domaines ajoutés récemment</h2>
        <el-row :gutter="20">
          <el-col :span="12" :key="domain.id" v-for="domain in domains">
            <Domain :data="domain" />
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getLocalOrFetch } from "~/utils/db";
import Domain from "./Domain.vue";

export default {
  data() {
    return {
      loading: true,
      domains: []
    };
  },
  methods: {
    init() {
      this.loading = true;
      console.log("Home Mid : init");
      getLocalOrFetch('domains').then(domains => {
        console.log("Home Mid : got domains", domains);
        this.domains = domains;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.init();
  },
  components: {
    Domain
  }
};
</script>

<style lang="scss" scoped>
.home-mid {
  background-color: $green-d2;
}
h2 {
  margin: 20px 0;
}
</style>
