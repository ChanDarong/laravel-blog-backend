<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref(null)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

const register = async () => {
  loading.value = true
  error.value = null
  try {
    await authStore.register({
      ...form.value
    })

    // Redirect to dashboard after successful registration
    router.push({ name: 'dashboard' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
};

</script>

<template>
  <div class="w-full lg:grid min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            Register
          </h1>
          <p class="text-balance text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>
        <form @submit.prevent="register">
          <div class="grid gap-4">
            <!-- Show error if exists -->
            <div v-if="error" class="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {{ error }}
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label for="first-name">First name</Label>
                <Input v-model="form.firstName" id="first-name" placeholder="Max" required />
              </div>
              <div class="grid gap-2">
                <Label for="last-name">Last name</Label>
                <Input v-model="form.lastName" id="last-name" placeholder="Robinson" required />
              </div>
            </div>
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                v-model="form.email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">Password</Label>
              </div>
              <Input v-model="form.password" id="password" type="password" required />
            </div>
            <Button type="submit" :disabled="loading" class="w-full">
              <span v-if="loading">Creating Account...</span>
              <span v-else>Create Account</span>
            </Button>
            <Button variant="outline" class="w-full">
              Login with Google
            </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          Already have have an account?
          <router-link :to="{ name: 'login' }" class="underline">Sign in</router-link>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="/public/login-img.jpg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover bg-center dark:brightness-[0.2] dark:grayscale"
      >
    </div>
  </div>
</template>
