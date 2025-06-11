<template>
  <v-menu 
    v-model="menu" 
    :close-on-content-click="false"
    location="bottom end"
    offset="8"
    max-width="400"
    max-height="500"
  >
    <template v-slot:activator="{ props }">
      <v-badge
        :content="unreadCount"
        :model-value="unreadCount > 0"
        color="error"
        size="small"
        dot
      >
        <v-btn
          icon
          variant="text"
          v-bind="props"
          :loading="loading"
          density="compact"
        >
          <v-icon 
            :color="unreadCount > 0 ? 'white' : 'default'"
            size="18"
          >
            mdi-bell{{ unreadCount > 0 ? '' : '-outline' }}
          </v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-card class="notification-dropdown" elevation="8">
      <v-card-title class="d-flex justify-space-between align-center py-3">
        <span class="text-h6">Notificações</span>
        <div class="d-flex gap-2">
          <v-btn
            v-if="unreadCount > 0"
            variant="text"
            size="small"
            color="primary"
            @click="markAllAsRead"
            :loading="markingAllAsRead"
            icon="mdi-check-all"
            title="Marcar todas como lidas"
          >
          </v-btn>
          
          <v-btn
            icon
            variant="text"
            size="small"
            @click="goToNotificationsPage"
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <div class="notification-content">
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
        />

        <div v-if="error" class="pa-4">
          <v-alert 
            type="error" 
            variant="tonal"
            closable
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>
        </div>

        <div v-if="!loading && sortedNotifications.length === 0" class="pa-6 text-center">
          <v-icon size="48" color="grey-lighten-1" class="mb-2">
            mdi-bell-off-outline
          </v-icon>
          <p class="text-grey-darken-1">Nenhuma notificação</p>
        </div>

        <v-list v-else class="pa-0" max-height="350" style="overflow-y: auto;">
          <template v-for="(notification, index) in recentNotifications" :key="notification.id">
            <v-list-item 
              :class="{ 'notification-unread': !notification.isRead }"
              class="notification-item"
              @click="handleNotificationClick(notification)"
            >
              <template v-slot:prepend>
                <v-avatar 
                  :color="getNotificationColor(notification.type)"
                  size="40"
                  class="me-3"
                >
                  <v-icon :icon="getNotificationIcon(notification.type)" color="white" />
                </v-avatar>
              </template>

              <v-list-item-title class="text-wrap">
                {{ notification.title }}
              </v-list-item-title>
              
              <v-list-item-subtitle class="text-wrap mt-1">
                {{ notification.message }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                  <span class="text-caption text-grey-darken-1">
                    {{ formatTime(notification.createdAt) }}
                  </span>
                  
                  <v-btn
                    v-if="!notification.isRead"
                    icon
                    variant="text"
                    size="x-small"
                    color="primary"
                    class="mt-1"
                    @click.stop="markAsRead(notification.id)"
                  >
                    <v-icon size="16">mdi-check</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
            
            <v-divider v-if="index < recentNotifications.length - 1" />
          </template>
        </v-list>

        <v-divider v-if="sortedNotifications.length > 5" />
        
        <v-card-actions v-if="sortedNotifications.length > 5" class="justify-center">
          <v-btn
            variant="text"
            color="primary"
            @click="goToNotificationsPage"
          >
            Ver todas ({{ sortedNotifications.length }})
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/NotificationsStore'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const notificationsStore = useNotificationsStore()

// State
const menu = ref(false)
const markingAllAsRead = ref(false)

// Computed
const {
  notifications,
  loading,
  error,
  unreadCount,
  sortedNotifications
} = notificationsStore

const recentNotifications = computed(() => 
  sortedNotifications.slice(0, 5)
)

// Methods
const formatTime = (date) => {
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ptBR 
  })
}

const getNotificationIcon = (type) => {
  const icons = {
    law: 'mdi-gavel',
    revision: 'mdi-file-document-edit-outline',
    system: 'mdi-cog-outline',
    announcement: 'mdi-bullhorn-outline'
  }
  return icons[type] || 'mdi-information-outline'
}

const getNotificationColor = (type) => {
  const colors = {
    law: 'blue',
    revision: 'orange',
    system: 'grey',
    announcement: 'green'
  }
  return colors[type] || 'primary'
}

const handleNotificationClick = (notification) => {
  if (!notification.isRead) {
    markAsRead(notification.id)
  }
  
  // Navegar para página específica se necessário
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
  
  menu.value = false
}

const markAsRead = async (notificationId) => {
  await notificationsStore.markAsRead(notificationId)
}

const markAllAsRead = async () => {
  markingAllAsRead.value = true
  try {
    await notificationsStore.markAllAsRead()
  } finally {
    markingAllAsRead.value = false
  }
}

const goToNotificationsPage = () => {
  router.push('/notifications')
  menu.value = false
}

// Lifecycle
let stopPolling = null

onMounted(async () => {
  await notificationsStore.fetchNotifications()
  // Inicia polling para verificar novas notificações a cada 30 segundos
  // stopPolling = notificationsStore.startPolling(30000)
})

onUnmounted(() => {
  if (stopPolling) {
    stopPolling()
  }
})
</script>

<style scoped>
.notification-dropdown {
  min-width: 360px;
  max-width: 400px;
}

.notification-content {
  max-height: 400px;
}

.notification-item {
  padding: 12px 16px !important;
  min-height: 72px;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.notification-unread {
  background-color: rgba(25, 118, 210, 0.08);
  border-left: 4px solid #1976d2;
}

.notification-unread .v-list-item-title {
  font-weight: 600;
}

.text-wrap {
  white-space: normal !important;
  word-break: break-word;
}
</style>