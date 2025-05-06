<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- <Header /> -->
    <main class="flex-grow">
      <router-view />
    </main>
    <!-- <Footer /> -->
  </div>
</template>

<style scoped>

</style>
