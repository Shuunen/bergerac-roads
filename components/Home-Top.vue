<template>
  <el-container direction="vertical" class="home-top">
    <div class="color-line"></div>
    <div class="line background">
      <h1>Venez découvrir<br>nos producteurs</h1>
      <img class="panneau" src="/images/entrant/panneau.png" alt="panneau">
    </div>
  </el-container>
</template>

<script>
</script>

<style lang="scss" scoped>
h1 {
  line-height: 1.2;
  text-align: center;
  padding: 20px 40px;
  z-index: 20;
  background: rgba($green-d3, 0.33);
}
h1::after,
h1::before {
  margin: 30px auto;
  background-color: $white;
  height: 3px;
  width: 24vw;
  content: "";
  display: block;
}
.background {
  background-image: url("/static/images/entrant/credit photo Akim Benbrahim.jpg");
  background-size: cover;
  background-position: center;
  height: calc(100vh - (55px * 2));
}
.color-line {
  background: $green-d2;
}
.panneau {
  position: absolute;
  bottom: 55px;
  left: 55px;
  height: 60%;
  transform: rotate(3deg);
}
</style>
