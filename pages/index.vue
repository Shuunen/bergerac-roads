<template>
  <el-container>
    <el-header>
      <h1>Bergerac Roads</h1>
      </el-header>
    <el-main>
      <el-button>Bouton standard</el-button>
    </el-main>
  </el-container>
</template>

<script>
import AppLogo from "~/components/AppLogo.vue";

export default {
  components: {
    AppLogo
  }
};
</script>

<style>
.el-header {
  background-color: lightblue;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
