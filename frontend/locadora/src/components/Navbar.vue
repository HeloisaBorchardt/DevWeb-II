<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <ul class="flex space-x-6 text-white justify-center">
      <li><RouterLink to="/" class="nav-link">Home</RouterLink></li>
      <li><RouterLink to="/ator-registration" class="nav-link">Atores</RouterLink></li>
      <li><RouterLink to="/diretor-registration" class="nav-link">Diretores</RouterLink></li>
      <li><RouterLink to="/classe-registration" class="nav-link">Classes</RouterLink></li>
      <li><RouterLink to="/item-registration" class="nav-link">Item</RouterLink></li>
      <li><RouterLink to="/titulo-registration" class="nav-link">Título</RouterLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
