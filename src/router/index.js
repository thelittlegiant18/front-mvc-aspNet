import { createRouter, createWebHistory } from 'vue-router'
import { useLogin } from "@/stores/login"
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: HomeView
    },
    {
      path: '/Articles',
      name: 'articles',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/Articles.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !useLogin().isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router
