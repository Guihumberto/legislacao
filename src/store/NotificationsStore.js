// stores/notifications.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import api from "@/services/api"

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)

  // WebSocket
  const { isConnected, connect, disconnect, sendMessage } = useWebSocket()

  // Computed
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.isRead).length
  )

  const lawNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'law')
  )

  const revisionNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'revision')
  )

  const sortedNotifications = computed(() => 
    [...notifications.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  // Actions
  const fetchNotifications = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Exemplo de chamada para Elasticsearch
      const response = await api.get('notifications/_search', {
        params: {
          size: 10,
          sort: 'createdAt:desc'
        }
      })
      
       // Com axios, os dados já vêm em response.data
      notifications.value = response.data.hits?.hits?.map(hit => ({
        id: hit._id,
        ...hit._source,
        createdAt: new Date(hit._source.createdAt)
      })) || []
      
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Erro ao buscar notificações'
      console.error('Erro ao carregar notificações:', err)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (!notification || notification.isRead) return

      // Atualiza no servidor usando axios
      await api.patch(`notifications/${notificationId}`, {
        isRead: true
      })

      // Atualiza localmente
      notification.isRead = true
      notification.readAt = new Date()

      // Notifica outros dispositivos via WebSocket
      if (isConnected.value) {
        sendMessage({
          type: 'mark_as_read',
          notificationId: notificationId,
          readAt: notification.readAt.toISOString()
        })
      }

    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Erro ao marcar como lida'
      console.error('Erro ao marcar notificação como lida:', err)
    }
  }

  const initializeWebSocket = () => {
    // connect()
  }

  const disconnectWebSocket = () => {
    // disconnect()
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.value
        .filter(n => !n.isRead)
        .map(n => n.id)

      if (unreadIds.length === 0) return

      // Atualiza no servidor usando axios
      await api.patch('notifications/mark-all-read', {
        notificationIds: unreadIds
      })

      // Atualiza localmente
      notifications.value.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true
          notification.readAt = new Date()
        }
      })

    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Erro ao marcar todas como lidas'
      console.error('Erro ao marcar todas as notificações como lidas:', err)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      // Deleta no servidor usando axios
      await api.delete(`notifications/${notificationId}`)

      // Remove localmente
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }

    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Erro ao deletar notificação'
      console.error('Erro ao deletar notificação:', err)
    }
  }

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date(),
      ...notification
    }
    notifications.value.unshift(newNotification)
  }

  // Função auxiliar para obter token (implemente conforme sua autenticação)
  const getToken = () => {
    return localStorage.getItem('authToken') || ''
  }

  // Polling para verificar novas notificações (opcional)
  const startPolling = (interval = 30000) => {
    const pollInterval = setInterval(() => {
      fetchNotifications()
    }, interval)

    return () => clearInterval(pollInterval)
  }

  return {
    // State
    notifications,
    loading,
    error,
    isConnected,
    
    // Computed
    unreadCount,
    lawNotifications,
    revisionNotifications,
    sortedNotifications,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    startPolling,
    initializeWebSocket,
    disconnectWebSocket
  }
})