export default [
    {
        path: '/importar',
        name: 'Ingestão',
        component: () => import('@/views/AdmImportar.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/publishs_admin',
        name: 'publicar',
        component: () => import('@/views/AdmPublishs.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/laws',
        name: 'Normas',
        component: () => import('@/views/AdmLaws.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/users',
        name: 'Usuários',
        component: () => import('@/views/AdmUsers.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/fonte_admin',
        name: 'Fonte Admin',
        component: () => import('@/views/AdminFonte.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/forum/cadastro',
        name: 'Cadastro',
        component: () => import('@/views/forum/config/cad_forum.vue'),
        meta: { requiresAuth: true, role: true } 
      },
]