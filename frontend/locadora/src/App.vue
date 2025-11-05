<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Snackbar from './components/Snackbar.vue'
import { useSnackbar } from './composables/useSnackbar'

const { snackbarState, hideSnackbar } = useSnackbar()
</script>

<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <main class="container mx-auto">
      <RouterView />
    </main>
    <Snackbar
      :show="snackbarState.show"
      :message="snackbarState.message"
      :type="snackbarState.type"
      @close="hideSnackbar"
    />
  </div>
</template>
