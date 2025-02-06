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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useLoginStore();
  const userRole = authStore.login.admin
  if (to.meta.requiresAuth && !authStore.login.cpf) {
    next('/login');
  } else if (to.meta.role && to.meta.role !== userRole) {
    next('/restricted');
  } else {
    next();
  }
})

export default router
