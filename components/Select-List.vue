<template>
  <div class="select-list-container">
    <el-checkbox-group v-model="checkedItems">
      <el-checkbox v-for="(item, index) in items" :label="item.name" :key="index" />
    </el-checkbox-group>
    <el-button
      @click="$emit('get-checked-items', checkedItems)"
      :disabled="checkedItems.length === 0"
    >
      Calculer
    </el-button>
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

<style lang="scss">
.select-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $white;
}
.el-checkbox-group {
  padding: 2rem;
}
.el-checkbox {
  display: block;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
</style>
