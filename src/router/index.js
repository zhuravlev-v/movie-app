import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: () => import('../views/MovieView.vue')
    },
    {
      path: '/series/:id',
      name: 'series',
      component: () => import('../views/SeriesView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    },
    // {
    //   path: '/credit',
    //   name: 'credit',
    //   component: () => import('../views/CreditView.vue')
    // },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
  ]
})

router.beforeEach((to, from) => {
  router.prevRoute = from
  // return false
})

export default router
