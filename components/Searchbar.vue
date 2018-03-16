<template>
  <div class="filters">

    <el-checkbox :indeterminate="isIndeterminate"
                 v-model="checkAll"
                 @change="handleCheckAllChange">Check all</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedFilters" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="filter in filters" :label="filter" :key="filter">{{filter}}</el-checkbox>
    </el-checkbox-group>

    <div @click="testFuction"><h3>TEST</h3></div>

    <ul >
        <li v-for="domaine in domaines" :key="domaine.key">nom : {{domaine.label}}</li>
      </ul>
    </div>


</template>

<style lang="scss" scoped>

  .filters{
    background-color: wheat;
  }
</style>


<script>

    const filters = ['filtre1', 'filtre2', 'filtre3'];
    let domaines =  [
        {'key':0,'label':'domaine 1', 'filters':'filtre1'},
        {'key':1,'label':'domaine 2', 'filters':'filtre2'},
        {'key':2,'label':'domaine 3', 'filters':'filtre2'},
        {'key':3,'label':'domaine 4', 'filters':'filtre3'}
    ];

    export default {
        data() {
            return {
                checkAll: false,
                checkedFilters: [],
                filters,
                isIndeterminate: true,
                domaines

            };
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedFilters = val ? filters : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                console.log('handleCheckedCitiesChange value = ' + value);

                let checkedCount = value.length;
                this.checkAll = checkedCount === this.filters.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.filters.length;
            },
            testFuction(){

                this.domaines = this.domaines.filter(function (item) {
                    return item.filters == 'filtre1';

                })

                console.log('domaines  = ' + this.domaines);
            }


        },

    };
</script>