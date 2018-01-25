<template>
  <div class="select-list-container" :style="{ height: `${height}px` }">
    <p class="introduction">{{ $t('search.introduction') }}</p>
    <el-checkbox-group
      v-model="checkedItems"
      @change="emitCheckedItems"
    >
      <el-checkbox
        v-for="item in items"
        :key="item.id"
        :label="item.title"
      />
    </el-checkbox-group>
    <el-input
      ref="autocomplete"
      :placeholder="$t('search.start')"
      v-model="startingPoint"
      clearable
      @clear="setStartingPoint('')"
    />
    <el-button
      :disabled="checkedItems.length === 0"
      @click="launchItineraryProcessing"
    >
      {{ $t('search.itinerary') }}
    </el-button>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import { eventBus } from '../store/index'

export default {
  props: {
    height: {
      type: Number,
      default: 300,
    },
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
  watch: {
    items: function() {
      // Reinitialize the checked items' list when the items' list changes.
      this.checkedItems = []
    }
  },
  mounted() {
    // Selects or not by clicking on the button in infowindow.
    eventBus.$on('select-marker', selectedMarker => {
      let index = this.checkedItems.findIndex(item => item === selectedMarker.title)
      if (index === -1) {
        this.checkedItems.push(selectedMarker.title)
      } else {
        this.checkedItems.splice(index, 1)
      }
    })
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
    launchItineraryProcessing() {
      // Necessary to emit the checked items with their coordinates.
      let formattedCheckedItems = []
      for (let checkedItem of this.checkedItems) {
        let originalCheckedItem = this.items.find(item => item.title === checkedItem)
        formattedCheckedItems.push({
          name: checkedItem,
          position: {
            lat: +originalCheckedItem.latitude,
            lng: +originalCheckedItem.longitude,
          },
        })
      }
      eventBus.$emit('process-itinerary', formattedCheckedItems)
    },
    emitCheckedItems(value) {
      eventBus.$emit('checked-items', value)
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
  .el-checkbox-group {
    max-width: 100%;
    overflow-y: auto;
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
      margin-top: .5rem;
    }
  }
  .el-input {
    margin: 2rem 0;
  }
  .el-button {
    flex: none;
  }
}
</style>
