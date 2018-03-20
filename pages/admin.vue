<template>
  <el-container direction="vertical" class="page-admin">
    <Header />
    <div class="color-line"></div>
    <el-main>
      <div class="line">
        <h1 class="title">Gestion du contenu</h1>
      </div>
      <el-row :gutter="20">
        <el-col :span="16">
          <AdminDomains />
        </el-col>
        <el-col :span="8">
          <AdminTags />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import AdminDomains from "~/components/Admin-Domains.vue";
import AdminTags from "~/components/Admin-Tags.vue";
import Header from "~/components/Header.vue";

export default {
  components: {
    AdminDomains,
    AdminTags,
    Header
  }
};
</script>

<style lang="scss" scoped>
.color-line {
  background-color: $red-d2;
}
.title {
  margin: 40px;
}
.page-admin {
  background: $red-d4;
  min-height: 100vh;
  padding-bottom: 10px;
}
</style>
