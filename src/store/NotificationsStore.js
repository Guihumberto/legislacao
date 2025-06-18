// stores/notifications.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { useLoginStore } from '@/store/LoginStore'
import { notificationService } from '@/services/notificationService'
import api from "@/services/api"

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)

  // WebSocket
  const { isConnected, connect, disconnect, sendMessage } = useWebSocket()

  // Computed
  const unreadCount = computed(() => 
    sortedNotifications.value.filter(n => !n.isRead).length
  )

  const lawNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'law')
  )

  const revisionNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'revision')
  )

  const listNotifications = computed(() => {
    const list = notifications.value.filter(n => n.type === 'law' || n.type === 'revision')
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })

  const controlesRead = computed(() => {
    const list = notifications.value.filter(n => n.type === 'controle')
    return list
  })

  const sortedNotifications = computed(() => {
    const controleMap = new Map();

    controlesRead.value.forEach(c => {
      const source = c
      controleMap.set(source.notificationId, source);
    });

    // Agora monta o resultado final:
    const finalNotifications = listNotifications.value.filter(n => {
      const controle = controleMap.get(n.id);

      // Se foi deletada, exclui
      if (controle?.isDeleted) {
        return false;
      }

      // Caso contrário, mantém
      return true;
    }).map(n => {
      const controle = controleMap.get(n.id);

      return {
        ...n,
        isRead: controle?.isRead || false
      };
    });

    return [...finalNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  })  

  const formatDate = computed(() => {
      const now = new Date();
      
      const day = String(now.getDate()).padStart(2, '0');  // Garante 2 dígitos para o dia
      const month = String(now.getMonth() + 1).padStart(2, '0');  // Meses começam em 0, então somamos 1
      const year = now.getFullYear();
      
      const hours = String(now.getHours()).padStart(2, '0');  // Garante 2 dígitos para a hora
      const minutes = String(now.getMinutes()).padStart(2, '0');  // Garante 2 dígitos para os minutos
      
      return `${day}-${month}-${year} ${hours}:${minutes}`;
  })

  const userLogin = computed(() => {
      const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
      const login = {
          login: JSON.parse(data).cpf,
          password: JSON.parse(data).password
      } 
      return login.login
  })

  // Actions
  const fetchNotifications = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Exemplo de chamada para Elasticsearch
      const response = await api.post('notifications/_search', {
        size: 10,
        sort: [
          { "createdAt": { "order": "desc" } }
        ],
        query: {
            "bool":{
              "should":[
                    {
                      bool: {
                          must: [
                              { "terms": { type: ["law", "pessoal"] } }
                          ]
                      }
                  },
                  {
                      "bool": {
                          "must": [
                              { "terms": { "type": ["controle"] }},
                              { "term": { "user_id": userLogin.value }},
                          ]
                      }
                  }
              ]
           }
        }
      });

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
    const loginStore = useLoginStore()
    const cpf = loginStore.readLogin?.cpf || null
    if(!cpf) return

    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (!notification || notification.isRead) return

      //Atualiza no servidor usando axios
      const response = await api.put(`notifications/_doc/${cpf + notificationId}`, {
        notificationId,
        isRead: true,
        date_read: formatDate.value,
        user_id: cpf,
        type: 'controle',
        broadcast: notification.broadcast
      })

      // Atualiza localmente
      notification.isRead = true
      notification.readAt = new Date()

      const controleNot = notifications.value.find(n => n.notificationId === notificationId)
      if(!controleNot) {
        notifications.value.push({
          id: cpf + notificationId,
          notificationId,
          isRead: true,
          readAt: new Date(),
          type: 'controle',
          user_id: cpf,
          broadcast: notification.broadcast
        })
      }
      controleNot.isRead = true

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

  const markAsNotRead  = async (notificationId) => {
    const loginStore = useLoginStore()
    const cpf = loginStore.readLogin?.cpf || null
    if(!cpf) return

    try {
      const notification = notifications.value.find(n => n.id === notificationId)
      const controleNot = notifications.value.find(n => n.notificationId === notificationId)
      if (!notification || notification.isRead) return

      const resp = await api.post(`notifications/_update/${cpf + notificationId}`, {
        "doc":{
            isRead: false
        }
      })

      notification.isRead = false
      notification.readAt = new Date()
      controleNot.isRead = false

    } catch (error) {
      console.log('error marcar como nao lida');
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.value
        .filter(n => !n.isRead)
        .map(n => n.id)

      if (unreadIds.length === 0) return

      for (const id of unreadIds) {
        await markAsRead(id)
      }

    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Erro ao marcar todas como lidas'
      console.error('Erro ao marcar todas as notificações como lidas:', err)
    }
  }

  const deleteNotification = async (notificationId) => {
    const loginStore = useLoginStore()
    const cpf = loginStore.readLogin?.cpf || null
    if(!cpf) return

    try {
      const resp = await api.post(`notifications/_update/${cpf + notificationId}`, {
        "doc":{
            notificationId,
            isDeleted: true,
            date_deleted: formatDate.value,
            user_id: cpf,
            type: 'controle',
        }
      })

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

  const initializeWebSocket = () => {
    // connect()
  }

  const disconnectWebSocket = () => {
    // disconnect()
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
    markAsNotRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    startPolling,
    initializeWebSocket,
    disconnectWebSocket
  }
})