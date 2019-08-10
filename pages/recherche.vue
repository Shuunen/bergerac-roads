<template>
  <el-container direction="vertical" class="recherche">
    <Searchbar />
  </el-container>
</template>

<script>
import Searchbar from '~/components/Searchbar'

export default {
  components: {
    Searchbar,
  },
}
</script>
