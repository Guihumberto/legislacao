import { useElasticsearch } from '@/composables/useElasticsearch'

const { search, index, update } = useElasticsearch()
const NOTIFICATIONS_INDEX = 'notifications'

export const notificationService = {
  // Buscar notificações do usuário
  async getUserNotifications(userId) {
    const query = {
      query: {
        bool: {
          must: [
            { term: { userId } },
            { range: { createdAt: { gte: 'now-30d' } } }
          ]
        }
      },
      sort: [
        { createdAt: { order: 'desc' } }
      ],
      size: 100
    }

    return await search(NOTIFICATIONS_INDEX, query)
  },

  // Criar notificação para nova lei (todos os usuários)
  async createLawNotification(lawData) {
    const notification = {
      type: 'law',
      title: 'Nova Norma Adicionada',
      message: `A Norma "${lawData.title}" foi adicionada ao sistema`,
      metadata: {
        lawId: lawData.id,
        lawTitle: lawData.title,
        tags: lawData.tags || []
      },
      actionUrl: `/avancado/${lawData.id}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      broadcast: true // Para todos os usuários
    }

    return await index(NOTIFICATIONS_INDEX, notification)
  },

  // Criar notificação para nova revisão (usuários com editais)
  async createRevisionNotification(revisionData, userIds) {
    const notifications = userIds.map(userId => ({
      type: 'revision',
      title: 'Nova Revisão Disponível',
      message: `Uma nova revisão foi enviada para o edital "${revisionData.editalTitle}"`,
      userId,
      metadata: {
        revisionId: revisionData.id,
        editalId: revisionData.editalId,
        editalTitle: revisionData.editalTitle
      },
      actionUrl: `/editals/${revisionData.editalId}/revisions/${revisionData.id}`,
      createdAt: new Date().toISOString(),
      isRead: false
    }))

    // Indexar todas as notificações 
    const promises = notifications.map(notification => 
      index(NOTIFICATIONS_INDEX, notification)
    )

    return await Promise.all(promises)
  },

  // Marcar como lida
  async markAsRead(notificationId) {
    return await update(NOTIFICATIONS_INDEX, notificationId, {
      isRead: true,
      readAt: new Date().toISOString()
    })
  },

  // Marcar múltiplas como lidas
  async markMultipleAsRead(notificationIds) {
    const promises = notificationIds.map(id => 
      update(NOTIFICATIONS_INDEX, id, {
        isRead: true,
        readAt: new Date().toISOString()
      })
    )

    return await Promise.all(promises)
  }
}