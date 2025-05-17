/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import 'shepherd.js/dist/css/shepherd.css'
import { useAuthStore } from '@/store/firebase/authStore';


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

const authStore = useAuthStore()

authStore.init().then(() => {
    app.mount('#app')
})


