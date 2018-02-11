<template>
  <el-container class="background page-height">
    <Logo />
    <el-header>

    </el-header>
    <el-main>
      <el-row class="parent-height" type="flex" justify="center" align="middle">
        <h1>Venez découvrir nos producteurs</h1>
      </el-row>
    </el-main>
    <el-footer>

    </el-footer>
  </el-container>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  components: {
    Logo
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 7vw;
  text-align: center;
  color: $bright;
  z-index: 20;
}
h1::after,
h1::before {
  margin: auto;
  background-color: $skin;
  height: 3px;
  width: 30vw;
  content: "";
  display: block;
  margin-top: 8px;
}
.background {
  background: url("/static/images/vignes-03.jpg");
  background-size: cover;
  background-position: center;
}
.el-header,
.el-footer {
  background: $base-5;
}
.el-main {
  position: relative;
  overflow: hidden;
}
.el-main::after {
  z-index: 10;
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  background: $base-5;
  opacity: .2;
  content: '';
  display: block;
}
</style>
