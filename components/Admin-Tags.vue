<template>
  <el-container direction="vertical" class="admin-table">

    <h2>Mots clés</h2>

    <div class="line start">
      <el-tag :key="tag" v-for="tag in tags" closable
       :disable-transitions="false" @close="handleClose(tag)">
       {{tag}}
      </el-tag>

      <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>

      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>

  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
