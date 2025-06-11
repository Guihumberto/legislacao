export const createNotificationPayload = (type, data) => {
  const basePayload = {
    createdAt: new Date().toISOString(),
    isRead: false
  }

  switch (type) {
    case 'law':
      return {
        ...basePayload,
        type: 'law',
        title: 'Nova Lei Adicionada',
        message: `A lei "${data.title}" foi adicionada ao sistema`,
        metadata: { lawId: data.id, lawTitle: data.title },
        actionUrl: `/laws/${data.id}`,
        broadcast: true
      }

    case 'revision':
      return {
        ...basePayload,
        type: 'revision',
        title: 'Nova Revisão Disponível',
        message: `Uma nova revisão foi enviada para o edital "${data.editalTitle}"`,
        metadata: { 
          revisionId: data.id, 
          editalId: data.editalId,
          editalTitle: data.editalTitle 
        },
        actionUrl: `/editals/${data.editalId}/revisions/${data.id}`
      }

    default:
      return basePayload
  }
}