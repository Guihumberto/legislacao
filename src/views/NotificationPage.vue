<template>
   <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">Notificações</h1>
              <p class="text-body-1 text-grey-darken-1">
                Gerencie suas notificações do sistema
              </p>
            </div>
            
            <div class="d-flex gap-3">
              <v-btn-toggle v-model="filterType" color="primary" variant="outlined" divided>
                <v-btn value="all" size="small">
                  Todas ({{ notifications.length }})
                </v-btn>
                <v-btn value="unread" size="small">
                  Não lidas ({{ unreadCount }})
                </v-btn>
                <v-btn value="law" size="small">
                  Leis ({{ lawNotifications.length }})
                </v-btn>
                <v-btn value="revision" size="small">
                  Revisões ({{ revisionNotifications.length }})
                </v-btn>
              </v-btn-toggle>

              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    v-bind="props"
                  />
                </template>
                
                <v-list>
                  <v-list-item
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    :loading="markingAllAsRead"
                  >
                    <template v-slot:prepend>
                      <v-icon>mdi-check-all</v-icon>
                    </template>
                    <v-list-item-title>Marcar todas como lidas</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item @click="refreshNotifications" :loading="loading">
                    <template v-slot:prepend>
                      <v-icon>mdi-refresh</v-icon>
                    </template>
                    <v-list-item-title>Atualizar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>

          <!-- Loading State -->
          <v-card v-if="loading && notifications.length === 0" class="pa-6">
            <v-skeleton-loader type="list-item-avatar@5" />
          </v-card>

          <!-- Error State -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            class="mb-4"
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>

          <!-- Empty State -->
          <v-card 
            v-if="!loading && filteredNotifications.length === 0" 
            class="pa-12 text-center"
          >
            <v-icon size="64" color="grey-lighten-1" class="mb-4">
              {{ getEmptyStateIcon() }}
            </v-icon>
            <h3 class="text-h6 mb-2">{{ getEmptyStateTitle() }}</h3>
            <p class="text-body-2 text-grey-darken-1">
              {{ getEmptyStateSubtitle() }}
            </p>
          </v-card>

          <!-- Notifications List -->
          <div v-else class="notifications-container">
            <v-card
              v-for="notification in paginatedNotifications"
              :key="notification.id"
              class="mb-3 notification-card"
              :class="{ 'notification-unread': !notification.isRead }"
              @click="handleNotificationClick(notification)"
            >
              <v-card-text class="pa-4">
                <div class="d-flex align-start">
                  <v-avatar
                    :color="getNotificationColor(notification.type)"
                    size="48"
                    class="me-4 mt-1"
                  >
                    <v-icon :icon="getNotificationIcon(notification.type)" color="white" />
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="d-flex justify-space-between align-start mb-2">
                      <div>
                        <h4 class="text-subtitle-1 font-weight-medium mb-1">
                          {{ notification.title }}
                        </h4>
                        <v-chip
                          :color="getNotificationColor(notification.type)"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ getTypeLabel(notification.type) }}
                        </v-chip>
                      </div>
                      
                      <div class="d-flex align-center gap-2">
                        <span class="text-caption text-grey-darken-1">
                          {{ formatDateTime(notification.createdAt) }}
                        </span>
                        
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-dots-vertical"
                              variant="text"
                              size="small"
                              v-bind="props"
                              @click.stop
                            />
                          </template>
                          
                          <v-list density="compact">
                            <v-list-item
                              v-if="!notification.isRead"
                              @click="markAsRead(notification.id)"
                            >
                              <template v-slot:prepend>
                                <v-icon size="20">mdi-check</v-icon>
                              </template>
                              <v-list-item-title>Marcar como lida</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item
                              v-else
                              @click="markAsUnread(notification.id)"
                            >
                              <template v-slot:prepend>
                                <v-icon size="20">mdi-email-outline</v-icon>
                              </template>
                              <v-list-item-title>Marcar como não lida</v-list-item-title>
                            </v-list-item>
                            
                            <v-divider />
                            
                            <v-list-item
                              @click="deleteNotification(notification.id)"
                              class="text-error"
                            >
                              <template v-slot:prepend>
                                <v-icon size="20">mdi-delete-outline</v-icon>
                              </template>
                              <v-list-item-title>Excluir</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </div>

                    <p class="text-body-2 text-grey-darken-1 mb-0">
                      {{ notification.message }}
                    </p>

                    <div v-if="notification.metadata" class="mt-3">
                      <v-chip-group v-if="notification.metadata.tags">
                        <v-chip
                          v-for="tag in notification.metadata.tags"
                          :key="tag"
                          size="small"
                          variant="outlined"
                        >
                          {{ tag }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions v-if="notification.actionUrl" class="pt-0">
                <v-spacer />
                <v-btn
                  color="primary"
                  variant="text"
                  @click.stop="goToNotificationAction(notification)"
                >
                  Ver detalhes
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                rounded
              />
            </div>
          </div>
        </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/NotificationsStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useGeralStore } from '@/store/GeralStore';
const geralStore = useGeralStore()

const router = useRouter()
const notificationsStore = useNotificationsStore()

// State
const filterType = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const markingAllAsRead = ref(false)

// Computed
const {
  notifications,
  loading,
  error,
  unreadCount,
  lawNotifications,
  revisionNotifications,
  sortedNotifications
} = notificationsStore

const filteredNotifications = computed(() => {
  switch (filterType.value) {
    case 'unread':
      return sortedNotifications.filter(n => !n.isRead)
    case 'law':
      return lawNotifications
    case 'revision':
      return revisionNotifications
    default:
      return sortedNotifications
  }
})

const totalPages = computed(() => 
  Math.ceil(filteredNotifications.value.length / itemsPerPage.value)
)

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredNotifications.value.slice(start, end)
})

// Methods
const formatDateTime = (date) => {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
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

const getTypeLabel = (type) => {
  const labels = {
    law: 'Nova Lei',
    revision: 'Nova Revisão',
    system: 'Sistema',
    announcement: 'Anúncio'
  }
  return labels[type] || 'Notificação'
}

const getEmptyStateIcon = () => {
  switch (filterType.value) {
    case 'unread':
      return 'mdi-check-all'
    case 'law':
      return 'mdi-gavel'
    case 'revision':
      return 'mdi-file-document-edit-outline'
    default:
      return 'mdi-bell-off-outline'
  }
}

const getEmptyStateTitle = () => {
  switch (filterType.value) {
    case 'unread':
      return 'Nenhuma notificação não lida'
    case 'law':
      return 'Nenhuma notificação de lei'
    case 'revision':
      return 'Nenhuma notificação de revisão'
    default:
      return 'Nenhuma notificação'
  }
}

const getEmptyStateSubtitle = () => {
  switch (filterType.value) {
    case 'unread':
      return 'Todas as notificações foram lidas'
    case 'law':
      return 'Você será notificado quando novas leis forem adicionadas'
    case 'revision':
      return 'Você será notificado sobre revisões de editais importados'
    default:
      return 'Você será notificado sobre atualizações do sistema'
  }
}

const handleNotificationClick = (notification) => {
  if (!notification.isRead) {
    markAsRead(notification.id)
  }
}

const markAsRead = async (notificationId) => {
  await notificationsStore.markAsRead(notificationId)
}

const markAsUnread = async (notificationId) => {
  // Implementar no store se necessário
  const notification = notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.isRead = false
    notification.readAt = null
  }
}

const markAllAsRead = async () => {
  markingAllAsRead.value = true
  try {
    await notificationsStore.markAllAsRead()
  } finally {
    markingAllAsRead.value = false
  }
}

const deleteNotification = async (notificationId) => {
  if (confirm('Deseja realmente excluir esta notificação?')) {
    await notificationsStore.deleteNotification(notificationId)
  }
}

const goToNotificationAction = (notification) => {
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
}

const refreshNotifications = async () => {
  await notificationsStore.fetchNotifications()
}

// Watch for filter changes
watch(filterType, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  await notificationsStore.fetchNotifications()
})
</script>

<style scoped>
.notifications-container {
  margin: 0 auto;
}

.notification-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification-unread {
  border-left: 4px solid #1976d2;
  background-color: rgba(25, 118, 210, 0.04);
}

.notification-unread .text-subtitle-1 {
  font-weight: 600;
}
</style>