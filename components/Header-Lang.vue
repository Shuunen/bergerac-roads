<template>
  <el-dropdown class="lang">
    <span class="el-dropdown-link french flag" v-if="$i18n.locale === 'fr'">{{ $t('common.french') }}</span>
    <span class="el-dropdown-link english flag" v-else>{{ $t('common.english') }}</span>
    <el-dropdown-menu slot="dropdown">
      <nuxt-link v-if="$i18n.locale === 'fr'" :to="`/en` + $route.fullPath">
        <el-dropdown-item class="english flag">{{ $t('common.english') }}</el-dropdown-item>
      </nuxt-link>
      <nuxt-link v-else :to="$route.fullPath.replace(/^\/[^\/]+/, '')">
        <el-dropdown-item class="french flag">{{ $t('common.french') }}</el-dropdown-item>
      </nuxt-link>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.el-dropdown {
  height: 20px;
  color: $white;
  cursor: pointer;
  margin-top: 20px;
  margin-right: 10px;
}
.flag {
  /*$size: 32px;
  height: $size;
  width: $size;*/
  padding-left: 22px;
  background-position: center left;
  background-repeat: no-repeat;
  &.french {
    background-image: url('/icones/french-flag-small.png');
  }
  &.english {
    background-image: url('/icones/english-flag-small.png');
  }
  &.el-dropdown-menu__item {
    padding-left: 30px;
    background-position-x: 7px;
    padding-right: 20px;
  }
}
</style>
