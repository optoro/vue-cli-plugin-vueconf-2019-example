<template>
  <div id="app">
    <nav id="nav" class="nav nav-pills justify-content-center mt-4">
      <router-link class="nav-link" to="/">Home</router-link>
      <router-link class="nav-link" to="/about">About</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  text-align: center;
}
</style>
