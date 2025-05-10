<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)

onMounted(async () => {
  // Check if we have a token stored
  if (authStore.token) {
    try {
      // Try to fetch the user with the stored token
      await authStore.fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }
  loading.value = false
})
</script>

<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <!-- Add your loading spinner here -->
    <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
  <template v-else>
    <router-view />
  </template>
</template>

<style scoped>

</style>
