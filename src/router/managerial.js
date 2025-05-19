export default [
    {
        path: '/gerencial/normas',
        name: 'Gerencial Normas',
        component: () => import('@/views/managerial/Norms.vue'),
        meta: { requiresAuth: true, role: true } 
      },
      {
        path: '/gerencial/search',
        name: 'Gerencial Pesquisa',
        component: () => import('@/views/managerial/TermsSearch.vue'),
        meta: { requiresAuth: true, role: true } 
      }
]