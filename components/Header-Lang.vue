<template>
  <el-dropdown class="lang">
    <span class="el-dropdown-link french flag">
      Français
      <i class="el-icon-arrow-down el-icon--right"/>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item class="english flag">English</el-dropdown-item>
      <el-dropdown-item>
        <nuxt-link to="/admin">Admin</nuxt-link>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.el-dropdown {
  margin-left: auto;
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
