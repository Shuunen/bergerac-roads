<template>
  <el-dropdown class="lang">
    <span class="el-dropdown-link french flag" v-if="$i18n.locale === 'fr'">{{ $t('common.french') }}</span>
    <span class="el-dropdown-link english flag" v-else>{{ $t('common.english') }}</span>
    <el-dropdown-menu slot="dropdown">
      <nuxt-link v-if="$i18n.locale === 'fr'" :to="`/en` + $route.fullPath">
        <el-dropdown-item class="english flag">
          {{ $t('common.english') }}
        </el-dropdown-item>
      </nuxt-link>
      <nuxt-link v-else :to="$route.fullPath.replace(/^\/[^\/]+/, '')">
        <el-dropdown-item class="french flag">
          {{ $t('common.french') }}
        </el-dropdown-item>
      </nuxt-link>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/ressources/icons.scss";
@import "@/assets/styles/ressources/variables.scss";

.el-dropdown {
  height: 20px;
  color: $white;
  cursor: pointer;
  margin-top: 16px;
  margin-right: 10px;
}
.flag {
  position: relative;
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: -21px;
    top: 5px;
  }
  &.french::before {
    @include sprite($french-flag);
  }
  &.english::before {
    @include sprite($english-flag);
  }
  &.el-dropdown-menu__item::before {
    left: 6px;
    top: 12px;
  }
}
.el-dropdown-menu__item {
  padding-left: 30px;
  padding-right: 20px;
}
</style>
