<template>
  <div class="logo">
    <div class="icon" />
    <h1 class="text">Routes du Bergerac</h1>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  z-index: 20;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 10px 20px;
  background-color: $grey_l;
  color: #f6b24c;
}
.icon {
  margin: 3px 0 5px;
  height: 50px;
  width: 50px;
  background: url("/static/logos/picto-logo.png");
  background-size: cover;
  background-position: center;
}
.text {
  font-size: 2rem;
}
</style>
