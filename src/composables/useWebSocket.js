// composables/useWebSocket.js
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationsStore } from '@/store/NotificationsStore'

export function useWebSocket() {
  const socket = ref(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = ref(null)
  
  const notificationsStore = useNotificationsStore()

  const connect = () => {
    try {
      const wsUrl = process.env.VUE_APP_WEBSOCKET_URL || 'ws://localhost:8080'
      const token = localStorage.getItem('authToken')
      
      socket.value = new WebSocket(`${wsUrl}?token=${token}`)

      socket.value.onopen = () => {
        console.log('WebSocket conectado')
        isConnected.value = true
        reconnectAttempts.value = 0
        
        // Enviar identificação do usuário
        const userId = getUserId()
        if (userId) {
          socket.value.send(JSON.stringify({
            type: 'identify',
            userId: userId
          }))
        }
      }

      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleMessage(data)
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error)
        }
      }

      socket.value.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason)
        isConnected.value = false
        
        // Tentar reconectar se não foi um fechamento intencional
        if (event.code !== 1000 && reconnectAttempts.value < maxReconnectAttempts) {
          scheduleReconnect()
        }
      }

      socket.value.onerror = (error) => {
        console.error('Erro no WebSocket:', error)
        isConnected.value = false
      }

    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error)
      scheduleReconnect()
    }
  }

  const disconnect = () => {
    if (reconnectInterval.value) {
      clearTimeout(reconnectInterval.value)
      reconnectInterval.value = null
    }
    
    if (socket.value) {
      socket.value.close(1000, 'Desconectado pelo cliente')
      socket.value = null
    }
    
    isConnected.value = false
  }

  const scheduleReconnect = () => {
    if (reconnectAttempts.value >= maxReconnectAttempts) {
      console.log('Máximo de tentativas de reconexão atingido')
      return
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000)
    console.log(`Tentando reconectar em ${delay}ms...`)
    
    reconnectInterval.value = setTimeout(() => {
      reconnectAttempts.value++
      connect()
    }, delay)
  }

  const handleMessage = (data) => {
    switch (data.type) {
      case 'notification':
        // Nova notificação recebida
        notificationsStore.addNotification(data.notification)
        showNotificationToast(data.notification)
        break
        
      case 'notification_read':
        // Notificação marcada como lida em outro dispositivo
        const notification = notificationsStore.notifications.find(
          n => n.id === data.notificationId
        )
        if (notification) {
          notification.isRead = true
          notification.readAt = new Date(data.readAt)
        }
        break
        
      case 'ping':
        // Responder ao ping do servidor
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
          socket.value.send(JSON.stringify({ type: 'pong' }))
        }
        break
        
      default:
        console.log('Mensagem WebSocket não reconhecida:', data)
    }
  }

  const showNotificationToast = (notification) => {
    // Mostrar toast usando Vuetify snackbar ou biblioteca de toast
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  const getUserId = () => {
    // Implementar lógica para obter ID do usuário
    return localStorage.getItem('userId')
  }

  const sendMessage = (message) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(message))
    }
  }

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    reconnectAttempts
  }
}


// Exemplo de servidor WebSocket (Node.js)
/*
const WebSocket = require('ws')
const jwt = require('jsonwebtoken')

const wss = new WebSocket.Server({ port: 8080 })

const clients = new Map() // userId -> Set of WebSocket connections

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const token = url.searchParams.get('token')
  
  // Verificar token JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId
    
    // Adicionar cliente ao mapa
    if (!clients.has(userId)) {
      clients.set(userId, new Set())
    }
    clients.get(userId).add(ws)
    
    ws.userId = userId
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data)
        handleMessage(ws, message)
      } catch (error) {
        console.error('Erro ao processar mensagem:', error)
      }
    })
    
    ws.on('close', () => {
      if (clients.has(userId)) {
        clients.get(userId).delete(ws)
        if (clients.get(userId).size === 0) {
          clients.delete(userId)
        }
      }
    })
    
  } catch (error) {
    ws.close(1008, 'Token inválido')
  }
})

function handleMessage(ws, message) {
  switch (message.type) {
    case 'identify':
      // Cliente se identificou
      break
      
    case 'mark_as_read':
      // Propagar para outros dispositivos do mesmo usuário
      broadcastToUser(ws.userId, {
        type: 'notification_read',
        notificationId: message.notificationId,
        readAt: message.readAt
      }, ws)
      break
      
    case 'pong':
      // Resposta ao ping
      break
  }
}

function broadcastToUser(userId, message, excludeWs = null) {
  if (clients.has(userId)) {
    clients.get(userId).forEach(client => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }
}

// Função para enviar notificação para usuários específicos
function sendNotificationToUsers(userIds, notification) {
  userIds.forEach(userId => {
    broadcastToUser(userId, {
      type: 'notification',
      notification: notification
    })
  })
}

// Função para broadcast de notificação de lei (todos os usuários)
function broadcastLawNotification(notification) {
  clients.forEach((connections, userId) => {
    broadcastToUser(userId, {
      type: 'notification',
      notification: notification
    })
  })
}

module.exports = { sendNotificationToUsers, broadcastLawNotification }
*/