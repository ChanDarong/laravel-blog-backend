import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue';
import Dashboard from '@/pages/dashboard/index.vue';
import Login from '@/pages/auth/Login.vue';
import register from '@/pages/auth/Register.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        auth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta: {
        guest: true
      }
    }
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if the rout requires auth
  if (to.matched.some(record => record.meta.auth)) {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: 'login' })
    } else {
      // Fetch user data if not available
      if (!authStore.user) {
        try {
          await authStore.fetchUser()
        } catch (error) {
          // If fetching user fails, redirect to login
          return next({ name: 'login' })
        }
      }
      next()
    }
  }
  // Check if route requires guest access only (like login/register)
  else if (to.matched.some(record => record.meta.guest)) {
    // If user is already authenticated, redirect to dashboard
    if (authStore.isAuthenticated) {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  } else {
    // For routes that don't have any meta
    next()
  }
})

export default router
