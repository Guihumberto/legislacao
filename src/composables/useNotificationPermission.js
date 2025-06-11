// composables/useNotificationPermission.js
import { ref, onMounted } from 'vue'

export function useNotificationPermission() {
  const permission = ref(Notification.permission)
  const isSupported = ref('Notification' in window)

  const requestPermission = async () => {
    if (!isSupported.value) {
      return false
    }

    if (permission.value === 'granted') {
      return true
    }

    if (permission.value === 'denied') {
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error)
      return false
    }
  }

  onMounted(() => {
    if (isSupported.value) {
      permission.value = Notification.permission
    }
  })

  return {
    permission,
    isSupported,
    requestPermission
  }
}
