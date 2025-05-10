import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import Notiflix from "notiflix";

import App from './App.vue'
import router from './router'

// Set the base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Initial Notiflix notify
Notiflix.Notify.init({
  position: "center-top",
  timeout: 3000,
});

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
