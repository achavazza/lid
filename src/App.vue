<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <section class="hero is-success is-fullheight">
    <div class="hero-head">
      <header class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              LiD Quiz
            </a>
            <span class="navbar-burger" data-target="navbarMenuHeroC">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" class="navbar-menu">
            <div class="navbar-end">
              <RouterLink class="navbar-item" to="/">Home</RouterLink>
              <RouterLink class="navbar-item" to="/results">Results</RouterLink>
              <RouterLink class="navbar-item" to="/about">About</RouterLink>
            </div>
          </div>
        </div>
      </header>
    </div>
    
    <RouterView />
  </section>
</template>

<style scoped>
</style>
