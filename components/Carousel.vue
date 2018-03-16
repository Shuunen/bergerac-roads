<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in items" :key="item.index">
      <h3>{{ item.label }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>

  const items = [
      {'index': 0, 'label':'photo1'},
      {'index': 1, 'label':'photo2'},
      {'index': 2, 'label':'photo3'},
  ];


  export default {
    data(){
        return {
            items
        }
    }
  }

</script>



<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>