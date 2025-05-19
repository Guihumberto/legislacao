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
        path: '/documents/:id',
        name: 'Documento',
        component: () => import('@/views/documents/document.vue'),
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
      {
        path: '/myforuns',
        name: 'Meus Foruns',
        component: () => import('@/views/forum/myforuns.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/avancado/forumlaw/:id',
        name: 'Forum Law',
        component: () => import('@/views/forum/lawforum.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/permissoes',
        name: 'Permissoes',
        component: () => import('@/views/forum/permissoes.vue'),
        meta: { requiresAuth: true } 
      },
]