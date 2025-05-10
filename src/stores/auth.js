import { defineStore } from "pinia";
import axios from "axios";
import Notiflix from "notiflix";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  actions: {
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/auth/register', userData);
        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        // Set the token in Axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        // Get user info
        await this.fetchUser();
        Notiflix.Notify.success("Register successfully");
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
        Notiflix.Notify.failure(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/auth/login', credentials);
        this.token = response.data.token;
        localStorage.setItem('token', this.token);

        // Set the token in Axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        // Get user info
        await this.fetchUser();

        Notiflix.Notify.success('Log in successfully');

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed';
        Notiflix.Notify.failure(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.token) return null;

      this.loading = true;

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        const response = await axios.get('/auth/profile');
        this.user = response.data;
        return this.user;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user data';
        // If unauthorized, logout user
        if (error.response?.status === 401) {
          this.logout();
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        if (this.token) {
          await axios.post('/auth/logout');

          Notiflix.Notify.success('Logout successfully')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Logout failed';
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        this.loading = false;
      }
    }
  }
});
