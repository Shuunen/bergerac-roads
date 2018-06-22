<template>
  <div class="footer">
    <small>{{ $t('footer.alcoolWarning') }}</small>
    <div class="grappe"/>
    <small>{{ $t('footer.copyright') }}</small>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  padding: 30px 0 20px;
  background-color: $white;
  display: grid;
  grid-gap: 20px;
  text-align: center;
}
</style>
