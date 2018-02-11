<template>
  <div class="logo">
    <div class="icon" />
    <h1 class="text">Routes du Bergerac</h1>
  </div>
</template>

<style scoped>
.logo {
  z-index: 20;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 10px 20px;
  background-color: #9e9a67;
  color: #fcfae8;
}
.icon {
  margin: 3px 0 5px;
  height: 50px;
  width: 50px;
  background: url("/static/icones/wine-glass.svg");
  background-size: cover;
  background-position: center;
}
.text {
  font-size: 2rem;
}
</style>
