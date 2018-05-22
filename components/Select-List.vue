<template>
  <div>
    <el-checkbox-group v-model="checkedItems">
      <el-checkbox v-for="(item, index) in items" :label="item.name" :key="index" />
    </el-checkbox-group>
    <el-button>Calculer</el-button>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      checkedItems: [],
    }
  },
}
</script>

<style>
.el-checkbox {
  display: block;
}
.el-checkbox + .el-checkbox {
  margin: 0;
}
</style>
