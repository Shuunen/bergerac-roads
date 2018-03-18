<template>
  <el-container direction="vertical" class="admin">
    <Header :floating="false" :title="'Gestion du contenu'" />
    <AdminTable />
  </el-container>
</template>

<script>
import AdminTable from "~/components/Admin-Table.vue";
import Header from "~/components/Header.vue";

export default {
  components: {
    AdminTable,
    Header
  }
};
</script>

<style lang="scss" scoped>
.admin {
  background: $base-5;
  height: 100vh;
}
.admin-table {
  margin: 10px;
}
</style>
