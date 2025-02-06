export default [
    {
        path: '/history',
        name: 'Histórico',
        component: () => import('@/views/History.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/favorites',
        name: 'Favoritos',
        component: () => import('@/views/Favorites.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/documents',
        name: 'Documentos',
        component: () => import('@/views/Documents.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/myposts',
        name: 'Meus Posts',
        component: () => import('@/views/MyPosts.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/myposts/create/:id?',
        name: 'Criar Post',
        component: () => import('@/views/MyPostCreate.vue'),
        meta: { requiresAuth: true } 
      },
]