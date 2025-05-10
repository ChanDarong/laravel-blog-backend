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
  email: '',
  password: ''
});

const login = async () => {
  loading.value = true
  error.value = null

  try {
    await authStore.login(form.value)

    // Redirect to dashboard after successful login
    router.push({ name: 'dashboard' })
  } catch (err) {
    console.log(err.response)
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full lg:grid min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            Login
          </h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <form @submit.prevent="login">
          <div class="grid gap-4">
            <div v-if="error" class="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
              {{ error }}
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
                <a
                  href="/forgot-password"
                  class="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input v-model="form.password" id="password" type="password" required />
            </div>
            <Button type="submit" :disabled="loading" class="w-full">
              <span v-if="loading">Logging in...</span>
              <span v-else>Login</span>
            </Button>
            <Button variant="outline" class="w-full">
              Login with Google
            </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <router-link :to="{ name: 'register' }" class="underline">Sign up</router-link>
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
