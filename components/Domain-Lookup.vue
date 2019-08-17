<template>
  <div class="domain-lookup">
    <el-dialog :visible.sync="dialogVisible">
      <DomainDetails v-if="domain && domain.id" :domain="domain" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="close(false)">Fermer</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from '../store'
import DomainDetails from '~/components/Domain-Details.vue'

export default {
  components: {
    DomainDetails,
  },
  data () {
    return {
      domain: null,
      dialogVisible: false,
    }
  },
  mounted () {
    eventBus.$on('domain-lookup', this.showDomain)
  },
  destroyed () {
    eventBus.$off('domain-lookup', this.showDomain)
  },
  methods: {
    showDomain (domain) {
      console.log('show domain', domain)
      this.domain = domain
      this.dialogVisible = true
    },
    close (seeFullpage) {
      this.dialogVisible = false
      if (seeFullpage) {
        eventBus.$emit('goto-domain', this.domain)
      }
    },
  },
}
</script>

<style>
.domain-lookup .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100% - 100px);
}
</style>
