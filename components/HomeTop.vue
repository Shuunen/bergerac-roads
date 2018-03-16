<template>
  <el-container class="background page-height">

    <el-row class="top-overlay">
      <Logo/>
      <Lang/>
    </el-row>

    <el-header></el-header>

    <el-main>
      <el-row class="parent-height" type="flex" justify="center" align="middle">
        <el-col :span="24">
          <div class="grid-content bg-purple-dark"><h1>Venez découvrir nos producteurs</h1>
          </div>
        </el-col>
      </el-row>
    </el-main>

    <el-row>
      <el-col :span="18" :offset="6">
        <div class="grid-content bg-purple">
          <Searchbar/>
        </div>
      </el-col>

    </el-row>

    <el-footer></el-footer>

    <img class="panneau" src="/images/entrant/panneau.png" alt="panneau">

  </el-container>
</template>

<script>
import Lang from "~/components/Lang.vue";
import Logo from "~/components/Logo.vue";
import Searchbar from "~/components/Searchbar";

export default {

  data() {
    return {
      activeIndex: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },



  },
  components: {
    Lang,
    Logo,
    Searchbar
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
  background-image: url("/static/images/vignes-03.jpg");
  background-size: cover;
  background-position: center;
}
.el-header,
.el-footer {
  background: $base-5;
}
.top-overlay {
  display: flex;
  position: absolute;
  width: 100%;
  padding: 0 10px;
  z-index: 20;
  justify-content: space-between;
}
.el-main {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.panneau {
  position: absolute;
  bottom: 130px;
  left: 10px;
  height: 60%;
  transform: rotate(3deg);
}
/*.el-main::after {
  z-index: 10;
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  background: $base-5;
  opacity: 0.2;
  content: "";
  display: block;
}*/
</style>
