<template>
  <el-container direction="vertical" class="admin-table">
    <h2>Domaines et chateaux</h2>
    <el-table :data="domains" stripe :style="'width: 100%'" v-loading="loading" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="title" label="Nom" />
      <el-table-column label="Actif ?" width="180">
        <template slot-scope="scope">
          {{ scope.row.active ? 'oui' : 'non' }}
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      api: process.env.api + '/domains',
      loading: true,
      domains: [],
    }
  },
  mounted() {
    this.getDomains()
  },
  methods: {
    getDomains() {
      this.loading = true
      fetch(this.api)
        .then(response => response.json())
        .then(domains => {
          this.domains = domains
          this.loading = false
        })
    },

    addDomain(name) {
      const headers = new Headers()
      headers.append('Accept', 'application/json') // This one is enough for GET requests
      headers.append('Content-Type', 'application/json') // This one sends body
      const body = JSON.stringify({ name })
      fetch(this.api, { method: 'post', headers, body }).then(this.getDomains)
    },

    deleteDomain(id) {
      fetch(this.api + '/' + id, { method: 'delete' }).then(this.getDomains)
    },

    tableRowClassName({ row }) {
      if (!row.active) {
        return 'inactive-row'
      }
      return ''
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/ressources/variables.scss";

.admin-table .el-table {
  background-color: $white;
}
</style>
