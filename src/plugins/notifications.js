// plugins/notifications.js - Plugin para inicializar notificações
import { useNotificationsStore } from '@/stores/notifications'
import { useNotificationPermission } from '@/composables/useNotificationPermission'

export default {
  install(app) {
    const notificationsStore = useNotificationsStore()
    const { requestPermission } = useNotificationPermission()

    // Inicializar quando o app carrega
    app.config.globalProperties.$initNotifications = async () => {
      // Solicitar permissão para notificações do browser
      await requestPermission()
      
      // Conectar WebSocket
      notificationsStore.initializeWebSocket()
      
      // Carregar notificações iniciais
      await notificationsStore.fetchNotifications()
    }

    // Cleanup quando o app é desmontado
    app.config.globalProperties.$cleanupNotifications = () => {
      notificationsStore.disconnectWebSocket()
    }
  }
}