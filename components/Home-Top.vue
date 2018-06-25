<template>
  <el-container direction="vertical" class="home-top">
    <div class="color-line"/>
    <div class="line background" v-lazy:background-image="images.background">
      <el-row class="title" justify="center">
        <el-col :span="14" :xs="24">
          <h1>{{ $t('home-top.title') }}<br><small>{{ $t('home-top.subtitle') }}</small></h1>
        </el-col>
      </el-row>
      <img class="panneau" v-lazy="images.panneau" alt="panneau">
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      images: {
        background: process.env.cdn + '/images/entrant/credit-photo-Akim-Benbrahim.jpg',
        panneau: process.env.cdn + '/images/entrant/panneau-500.png',
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.home-top {
  z-index: 1;
  position: relative;
  overflow: hidden;
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
    small {
      font-family: $font-primary;
      font-weight: normal;
      font-size: 60%;
      line-height: 1.3;
      display: block;
      margin-top: 10px;
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
