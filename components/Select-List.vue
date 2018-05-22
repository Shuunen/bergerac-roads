<template>
  <div>
    <el-checkbox-group v-model="checkedItems">
      <el-checkbox-button v-for="(item, index) in items" :label="item.name" :key="index" />
    </el-checkbox-group>
    <el-button @click="$emit('get-checked-items', checkedItems)">Calculer</el-button>
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
.el-checkbox-button {
  display: block;
}
.el-checkbox-button__inner {
  width: 100%;
}
</style>
