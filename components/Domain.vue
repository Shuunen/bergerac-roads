<template>
  <el-container direction="vertical" class="domain">
    <el-card :body-style="{ padding: '0px' }">
      <el-container direction="vertical">
        <img :src="data.image" class="image">
        <div class="infos">
          <span class="title">{{ data.title }}</span>
          <time class="time">ajouté le 19 mars à 12h12</time>
        </div>
      </el-container>
    </el-card>
  </el-container>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.domain {
  margin-bottom: 20px;
}
.image {
  width: 100%;
  display: block;
}
.infos {
  display: flex;
  flex-direction: column;
  padding: 10px;
  .title {
    font-size: 1.4rem;
  }
  .time {
    margin-top: 6px;
    font-size: 1rem;
    color: #999;
  }
}
</style>
