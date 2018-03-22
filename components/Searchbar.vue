<template>
  <div class="search-bar">

    <div class="filters">
      <el-checkbox-group v-model="checkedFilters" @change="handleCheckedCitiesChange">
        <el-checkbox-button v-for="filter in filters" :label="filter.name" :key="filter.key" size="medium" border>
          {{ filter.label }}
        </el-checkbox-button>
      </el-checkbox-group>
    </div>

    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <span>Results nb {{ domaines | sum }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light"/>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple"/>
        <el-button type="primary" round icon="el-icon-refresh">Create</el-button>
      </el-col>
    </el-row>

    <ul>
      <li v-for="domaine in domaines" :key="domaine.key">
        <h4>{{ domaine.label }}</h4>
        <div>
          <div v-for="filter in domaine.filters" :key="filter.key">{{ filter.label }}</div>
        </div>
      </li>
    </ul>

  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  background-color: #ffffff6b;
  padding: 20px;
}
.filters {
  background-color: $white;
}
</style>


<script>
const filters = [
  { key: 0, label: 'Vin Bio', name: 'filtre1' },
  { key: 1, label: 'Domaine skiable', name: 'filtre2' },
  { key: 2, label: 'Vin super bon', name: 'filtre3' },
]
let domaines = [
  {
    key: 0,
    label: 'domaine 1',
    filters: [{ key: 0, label: 'Vin Bio', name: 'filtre1' }],
    address: '123 bd du vin',
  },
  {
    key: 1,
    label: 'domaine 2',
    filters: [{ key: 1, label: 'Domaine skiable', name: 'filtre2' }],
    address: '123 bd du vin',
  },
  {
    key: 2,
    label: 'domaine 3',
    filters: [
      { key: 0, label: 'Vin Bio', name: 'filtre1' },
      { key: 1, label: 'Domaine skiable', name: 'filtre2' },
    ],
    address: '123 bd du vin',
  },
  {
    key: 3,
    label: 'domaine 4',
    filters: [
      { key: 1, label: 'Domaine skiable', name: 'filtre2' },
      { key: 2, label: 'Vin super bon', name: 'filtre3' },
    ],
    address: '123 bd du vin',
  },
]

export default {
  filters: {
    capitalize: function(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    sum: function(value) {
      return value.length
    },
  },
  data() {
    return {
      currentDate: new Date(),
      checkAll: false,
      checkedFilters: [],
      filters,
      isIndeterminate: true,
      domaines,
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedFilters = val ? filters : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      //console.log('handleCheckedCitiesChange value = ' + value);

      let checkedCount = value.length
      this.checkAll = checkedCount === this.filters.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.filters.length

      let checkedFiltersToApply = this.checkedFilters

      this.domaines = domaines

      if (checkedFiltersToApply.length !== 0) {
        this.domaines = this.domaines.filter(function(domaine) {
          console.log('apply' + checkedFiltersToApply)
          let isValid = false
          domaine.filters.forEach(function(filter) {
            if (checkedFiltersToApply.indexOf(filter.name) >= 0 || isValid) {
              console.log('in filter array')
              isValid = true
            } else {
              isValid = false
            }
          })
          return isValid
        })
      }
    },
  },
}
</script>
