<template>
  <el-container direction="vertical" class="admin-table">

    <h2>Mots clés</h2>

    <div class="line start">

      <div class="loading line" v-if="loading">
        <i class="el-icon-loading"/>
      </div>

      <el-tag :key="tag.id" v-for="tag in tags" closable
              :disable-transitions="false" @close="deleteTag(tag.id)">
        {{ tag.name }}
      </el-tag>

      <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
                @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"/>

      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Ajouter</el-button>
    </div>

  </el-container>
</template>

<script>
export default {
  data() {
    return {
      api: process.env.api + '/tags',
      loading: true,
      tags: [],
      inputVisible: false,
      inputValue: '',
    }
  },
  mounted() {
    this.getTags()
  },
  methods: {
    getTags() {
      this.loading = true
      fetch(this.api)
        .then(response => response.json())
        .then(tags => {
          this.tags = tags
          this.loading = false
        })
    },

    addTag(name) {
      const headers = new Headers()
      headers.append('Accept', 'application/json') // This one is enough for GET requests
      headers.append('Content-Type', 'application/json') // This one sends body
      const body = JSON.stringify({ name })
      fetch(this.api, { method: 'post', headers, body }).then(this.getTags)
    },

    deleteTag(id) {
      fetch(this.api + '/' + id, { method: 'delete' }).then(this.getTags)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.addTag(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.loading {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background: $white;
  font-size: 120%;
  margin-top: -10px;
  margin-right: 10px;
}
.el-tag, .button-new-tag, .input-new-tag {
  background-color: $white;
  color: $red-d4;
  font-size: 110%;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  opacity: .6;
  &:hover {
    opacity: 1;
  }
}
.input-new-tag {
  width: inherit;
}
</style>
