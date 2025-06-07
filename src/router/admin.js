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
      {
        path: '/home/admin',
        name: 'Admin Home',
        component: () => import('@/views/admin/home.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/admin/list_cargo_editar',
        name: 'Lista Cargo',
        component: () => import('@/views/admin/list_cargo_editar.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/admin/cargo_editar/:id',
        name: 'Editar Cargo',
        component: () => import('@/views/admin/cargo_editar.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/forum/tratarerros',
        name: 'Tratar error',
        component: () => import('@/views/forum/config/tratar_erros.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/admin/vincularleis',
        name: 'Vincular Leis',
        component: () => import('@/views/admin/vincularLeisDisciplinas.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/admin/rag',
        name: 'Rag Chat',
        component: () => import('@/views/admin/rag_chat.vue'),
        meta: { requiresAuth: true, role: true } 
      },
       {
        path: '/admin/edital_cadastro',
        name: 'Cad Edital',
        component: () => import('@/views/admin/concurso_admin.vue'),
        meta: { requiresAuth: true, role: true } 
      },
]