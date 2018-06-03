<template>
  <div class="select-list-container">
    <el-input
      ref="autocomplete"
      placeholder="Point de départ"
      v-model="startingPoint"
      clearable
      @clear="setStartingPoint('')" />
    <p>Si aucune adresse n'est entrée, votre localisation sera prise comme point de départ.</p>
    <el-checkbox-group v-model="checkedItems">
      <el-checkbox v-for="(item, index) in items" :label="item.name" :key="index" />
    </el-checkbox-group>
    <el-button
      @click="emitCheckedItems()"
      :disabled="checkedItems.length === 0"
    >
      Calculer
    </el-button>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import { eventBus } from '../store/index'

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
      startingPoint: '',
    }
  },
  computed: {
    google: gmapApi,
    // Restrict autocomplete to results in France.
    autocomplete: function() {
      return new this.google.maps.places.Autocomplete(
        this.$refs.autocomplete.$refs.input,
        {
          componentRestrictions: {
            country: 'fr',
          },
        }
      )
    },
  },
  mounted() {
    this.autocomplete.addListener('place_changed', () => {
      this.setStartingPoint(this.autocomplete.getPlace().formatted_address)
    })
  },
  methods: {
    setStartingPoint(value) {
      this.startingPoint = value
      eventBus.$emit('set-starting-point', this.startingPoint)
    },
    emitCheckedItems() {
      eventBus.$emit('get-checked-items', this.checkedItems)
    },
  },
}
</script>

<style lang="scss">
.select-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 20rem;
  padding: 2rem;
  background-color: $white;

  .el-checkbox-group {
    padding: 2rem 0;
  }
  .el-checkbox {
    display: block;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
}
</style>
