// Plugins
import { registerPlugins } from '@/plugins'
import 'shepherd.js/dist/css/shepherd.css'
import { useAuthStore } from '@/store/firebase/authStore.js'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

const authStore = useAuthStore()
// authStore.handleRedirectResult().then(() => {
//   // Mount app after auth initialization
//   app.mount('#app')
// })
app.mount('#app')