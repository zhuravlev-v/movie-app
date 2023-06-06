import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'

import App from './App.vue'
import router from './router'

import './assets/styles/main.scss'
import 'vue-final-modal/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const vfm = createVfm()
app.use(vfm)

app.mount('#app')

// window.app = app