import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      nome: 'home',
      component: HomeView,
    },
    {
      path: '/ator-registration',
      nome: 'atorRegistration',
      component: () =>
        import('@/modules/registrations/atorRegistration/views/atorRegistrationView.vue'),
    },
    {
      path: '/diretor-registration',
      nome: 'diretorRegistration',
      component: () =>
        import('@/modules/registrations/diretorRegistration/views/diretorRegistrationView.vue'),
    },
    {
      path: '/classe-registration',
      nome: 'classeRegistration',
      component: () =>
        import('@/modules/registrations/classeRegistration/views/classeRegistrationView.vue'),
    },
    {
      path: '/item-registration',
      name: 'itemRegistration',
      component: () =>
        import('@/modules/registrations/itemRegistration/views/itemRegistrationView.vue'),
    },
    {
      path: '/titulo-registration',
      name: 'tituloRegistration',
      component: () =>
        import('@/modules/registrations/tituloRegistration/views/tituloRegistrationView.vue'),
    },
  ],
})

export default router
