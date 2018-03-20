<template>
  <el-container direction="vertical" class="last-domains">
    <el-main>
      <div class="col">
        <h2>Domaines ajoutés récemment</h2>
        <el-row :gutter="20">
          <el-col :span="8" :key="domain.id" v-for="domain in domains">
            <Domain :data="domain" />
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getDomains } from "~/utils/db";
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
      getDomains().then(domains => {
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
.last-domains {
  background-color: $red-d3;
  padding-bottom: 20px;
}
h2 {
  margin: 20px 0;
}
</style>
