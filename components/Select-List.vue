<template>
  <div class="select-list-container">
    <p class="introduction">{{ $t('search.introduction') }}</p>
    <div class="autocomplete-input">
      <el-input
        ref="autocomplete"
        :placeholder="$t('search.start')"
        v-model="startingPoint"
        clearable
        @clear="setStartingPoint('')"
      />
      <el-button
        icon="el-icon-view"
        :disabled="checkedItems.length === 0"
        @click="emitCheckedItems"
        circle
      />
    </div>
    <el-checkbox-group v-model="checkedItems">
      <el-checkbox v-for="item in items" :label="item.title" :key="item.id" />
    </el-checkbox-group>
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
  },
  mounted() {
    let autocomplete = new this.google.maps.places.Autocomplete(
      this.$refs.autocomplete.$refs.input,
      {
        // Restrict autocomplete to results in France.
        componentRestrictions: {
          country: 'fr',
        },
      }
    )
    autocomplete.addListener('place_changed', () => {
      this.setStartingPoint(autocomplete.getPlace().formatted_address)
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
  padding: 2rem;
  background-color: $white;
  .introduction {
    margin: 0 0 2rem;
    text-align: justify;
  }
  .autocomplete-input {
    width: 100%;
    display: flex;
    .el-button {
      margin-left: 1rem;
    }
  }
  .el-checkbox-group {
    max-width: 100%;
    margin-top: 2rem;
    .el-checkbox {
      display: block;
      .el-checkbox__label {
        max-width: 95%;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
      }
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
}
</style>
