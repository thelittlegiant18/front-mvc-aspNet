import './assets/template.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import axios from "axios"
import Vueaxios from "vue-axios";
axios.defaults.baseURL = "https://localhost:7223/"

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.component('Toast', Toast);
app.use(PrimeVue)
app.use(pinia)
app.use(router)
app.use(ToastService)
app.use(VueSweetalert2)
app.use(Vueaxios, axios)

app.mount('#app')
