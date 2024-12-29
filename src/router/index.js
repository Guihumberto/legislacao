// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAvaliacaoStore } from '@/store/AvaliacaoStore'


const requireAuth = async(to, from, next) => {
    const avaliacaoStore = useAvaliacaoStore()
    const user = await avaliacaoStore.loginMalha()
    if(user){
      next()
    } else {
      next('/avaliacao')
    }
}

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
      },
      {
        path: '/laws',
        name: 'Normas',
        component: () => import('@/views/AdmLaws.vue'),
      },
      {
        path: '/users',
        name: 'Usuários',
        component: () => import('@/views/AdmUsers.vue'),
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
      },
      {
        path: '/favorites',
        name: 'Favoritos',
        component: () => import('@/views/Favorites.vue'),
      },
      {
        path: '/documents',
        name: 'Documentos',
        component: () => import('@/views/Documents.vue'),
      },
      {
        path: '/collection_search/:id',
        name: 'Coleção pesquisa',
        component: () => import('@/views/collectionSearch.vue'),
      },
      {
        path: '/myposts',
        name: 'Meus Posts',
        component: () => import('@/views/MyPosts.vue'),
      },
      {
        path: '/myposts/create/:id?',
        name: 'Criar Post',
        component: () => import('@/views/MyPostCreate.vue'),
      },
      {
        path: '/:pathMatch(.*)*', // Captura todas as rotas não definidas
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
      },
    ],
  },
  {
    path: '/painel',
    component: () => import('@/layouts/clear/Clear.vue'),
    children:[
      {
        path: '',
        name: 'Painel',
        component: () => import('@/views/Test.vue'),
      },
    ]
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
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
