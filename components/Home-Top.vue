<template>
  <el-container direction="vertical" class="home-top">
    <div class="color-line"></div>
    <div class="line background">
      <h1>Venez découvrir<br>nos producteurs</h1>
      <img class="panneau" src="/images/entrant/panneau.png" alt="panneau">
    </div>
    <div class="color-line"></div>
  </el-container>
</template>

<script>
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
  background-image: url("/static/images/entrant/credit photo Akim Benbrahim.jpg");
  background-size: cover;
  background-position: center;
  height: calc(100vh - (55px * 2));
}
.color-line {
  height: 55px;
  background: $base-5;
}
.panneau {
  position: absolute;
  bottom: 55px;
  left: 55px;
  height: 60%;
  transform: rotate(3deg);
}
</style>
