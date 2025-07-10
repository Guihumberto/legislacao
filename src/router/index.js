// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/store/LoginStore'

import adminRoutes from '@/router/admin'
import publicRoutes from '@/router/public'
import userRoutes from '@/router/user'
import managerialRoutes from '@/router/managerial'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      ...adminRoutes,
      ...publicRoutes,
      ...userRoutes,
      ...managerialRoutes
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
    ]
  },
  {
    path: '/chatarcadio',
    component: () => import('@/layouts/chat/Chat.vue'),
    children:[
      {
        path: '',
        name: 'Chat Arcádio',
        component: () => import('@/views/Chatarcadio.vue'),
      },
      {
        path: '/chatarcadio/:id',
        name: 'Chat',
        component: () => import('@/views/Chatarcadio.vue'),
      },
    ]
  },
  {
    path: '/landingpage',
    component: () => import('@/layouts/clear/Clear.vue'),
    children:[
      {
        path: '',
        name: 'Legislação Hero',
        component: () => import('@/views/public/hero_page.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const data = sessionStorage.getItem('userData') || localStorage.getItem('userData');
  const cpf = JSON.parse(data)?.cpf
  const role = JSON.parse(data)?.admin

  if (to.meta.requiresAuth && !cpf) {
    next({
      path: '/login',
      query: { redirect: to.fullPath } // salva onde o usuário queria ir
    })
  } else if (to.meta.role && to.meta.role !== role) {
    next('/restricted');
  } else {
    next();
  }
})

export default router
