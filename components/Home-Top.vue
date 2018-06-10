<template>
  <el-container direction="vertical" class="home-top">
    <div class="color-line"/>
    <div class="line background" v-lazy:background-image="'/images/entrant/credit-photo-Akim-Benbrahim.jpg'">
      <el-row class="title" justify="center">
        <el-col :span="14" :xs="24">
          <h1>{{ $t('home-top.header') }}</h1>
        </el-col>
      </el-row>
      <img class="panneau" v-lazy="'/images/entrant/panneau-500.png'" alt="panneau">
    </div>
  </el-container>
</template>

<style lang="scss" scoped>
.home-top {
  z-index: 1;
  position: relative;
}
.title {
  z-index: 10;
  display: flex;
  justify-content: center;
  .el-col,
  h1 {
    height: 100%;
  }
  h1 {
    line-height: 1.2;
    text-align: center;
    padding: 20px 40px;
    z-index: 20;
    background: rgba($green-d3, 0.5);
    &::after,
    &::before {
      margin: 30px auto;
      background-color: $white;
      height: 3px;
      width: 90%;
      content: '';
      display: block;
    }
  }
}

@media (max-width: 450px) {
  .title {
    height: 100%;
    h1 {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}

.background {
  background-size: cover;
  background-position: center;
  height: calc(100vh - 55px);
}
.color-line {
  background: $green-d3;
}
.panneau {
  position: absolute;
  bottom: 0;
  right: 10px;
  height: 75%;
  opacity: 0.9;
  transform: rotate(3deg);
}
</style>
