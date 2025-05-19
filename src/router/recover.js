// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/store/LoginStore'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/login',
        name: 'Entrar',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: '/about',
        name: 'Sobre',
        component: () => import('@/views/About.vue'),
      },
      {
        path: '/importar',
        name: 'Ingestão',
        component: () => import('@/views/AdmImportar.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/publishs_admin',
        name: 'publicar',
        component: () => import('@/views/AdmPublishs.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/laws',
        name: 'Normas',
        component: () => import('@/views/AdmLaws.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/users',
        name: 'Usuários',
        component: () => import('@/views/AdmUsers.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/fonte_admin',
        name: 'Fonte Admin',
        component: () => import('@/views/AdminFonte.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/leges',
        name: 'Legislacao',
        component: () => import('@/views/Legislacao.vue'),
      },
      {
        path: '/text/:id',
        name: 'Texto',
        component: () => import('@/views/textoComplet.vue'),
      },
      {
        path: '/avancado/:id',
        name: 'Avancado',
        component: () => import('@/views/textoAvancado.vue'),
      },
      {
        path: '/textTimeLine/:id',
        name: 'TimeLine',
        component: () => import('@/views/textoTimeLine.vue'),
      },
      {
        path: '/legesporlei',
        name: 'Legislacaoporlei',
        component: () => import('@/views/LegesPorLei.vue'),
      },
      {
        path: '/newslaws',
        name: 'Normas Adicionadas',
        component: () => import('@/views/Newslaws.vue'),
      },
      {
        path: '/textpage/:id',
        name: 'Page',
        component: () => import('@/views/textPage.vue'),
      },
      {
        path: '/linkedData',
        name: 'linkedData',
        component: () => import('@/views/linkedData.vue'),
      },
      {
        path: '/help',
        name: 'Ajuda',
        component: () => import('@/views/Help.vue'),
      },
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
        path: '/collection_search/:id',
        name: 'Coleção pesquisa',
        component: () => import('@/views/collectionSearch.vue'),
      },
      {
        path: '/collection_list',
        name: 'Lista de Coleções',
        component: () => import('@/views/CollectionPublish.vue'),
      },
      {
        path: '/myposts',
        name: 'Meus Posts',
        component: () => import('@/views/MyPosts.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/testeleges',
        name: 'Meus Testes',
        component: () => import('@/views/Blog.vue'),
      },
      {
        path: '/myposts/create/:id?',
        name: 'Criar Post',
        component: () => import('@/views/MyPostCreate.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: '/:pathMatch(.*)*', // Captura todas as rotas não definidas
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
      },
    ],
  },
  {
    path: '/blog',
    component: () => import('@/layouts/blog/Blog.vue'),
    children:[
      {
        path: '',
        name: 'Blog Arcádio',
        component: () => import('@/views/Blog.vue'),
      },
      {
        path: '/chatNew',
        name: 'BlogTeste',
        component: () => import('@/views/LegislacaoChatClone.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useLoginStore();
  console.log('heelo', authStore.login.cpf, to.meta.requiresAuth);
  if (to.meta.requiresAuth && !authStore.login.cpf) {
    next('/login');
  } else {
    next();
  }
});

export default router
