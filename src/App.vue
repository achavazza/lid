<script setup>
import { RouterLink, RouterView } from 'vue-router';

document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});
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
              <RouterLink class="navbar-item" to="/">Quiz</RouterLink>
              <RouterLink class="navbar-item" to="/all">Alle Fragen</RouterLink>
              <RouterLink class="navbar-item" to="/custom">Custom</RouterLink>
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
