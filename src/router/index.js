// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/store/LoginStore'

import adminRoutes from '@/router/admin'
import publicRoutes from '@/router/public'
import userRoutes from '@/router/user'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      ...adminRoutes,
      ...publicRoutes,
      ...userRoutes,
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
    next('/login');
  } else if (to.meta.role && to.meta.role !== role) {
    next('/restricted');
  } else {
    next();
  }
})

export default router
