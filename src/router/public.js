export default [
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
        path: '/testeleges',
        name: 'Meus Testes',
        component: () => import('@/views/Blog.vue'),
      },
      {
        path: '/homepainel',
        name: 'Home Painel',
        component: () => import('@/views/public/home.vue'),
      },
      {
        path: '/homepainel/concurso/:id',
        name: 'Painel Concurso',
        component: () => import('@/views/public/concurso.vue'),
      },
      {
        path: '/homepainel/create_plan',
        name: 'Criar Plano',
        component: () => import('@/views/public/create_plan.vue'),
      },
      {
        path: '/homepainel/disciplinas/:id',
        name: 'Normas por Disciplinas',
        component: () => import('@/views/public/create_plan.vue'),
      },
      {
        path: '/homepainel/disciplinas/:id',
        name: 'Normas por Disciplinas',
        component: () => import('@/views/public/disciplinas.vue'),
      },
      {
        path: '/homepainel/showall/normas',
        name: 'Todas as Normas',
        component: () => import('@/views/public/allNormas.vue'),
      },
      {
        path: '/restricted',
        name: 'Area Restrita',
        component: () => import('@/views/areaRestricted.vue'),
      },
      {
        path: '/:pathMatch(.*)*', // Captura todas as rotas não definidas
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
      }
]