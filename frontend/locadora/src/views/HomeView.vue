<script setup lang="ts">
import claqueteImg from '@/assets/claquete.png'
</script>

<template>
  <main class="page-container">
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="card max-w-2xl text-center">
        <img
          :src="claqueteImg"
          alt="Claquete de cinema"
          class="w-64 h-64 object-contain mb-8 mx-auto"
        />
        <h1 class="text-5xl font-bold mb-6 text-primary">Sistema de Locadora Passatempo</h1>
        <p class="text-lg text-gray-700">
          Use a barra de navegação para acessar os cadastros de
          <span class="font-semibold text-primary">Ator</span>,
          <span class="font-semibold text-primary">Diretor</span> e
          <span class="font-semibold text-primary">Classe</span>.
          <br />
          <br />
          <span class="text-5x font-bold text-secondary">Por Heloisa e Heloara</span>.
        </p>
      </div>
    </div>
  </main>
</template>
