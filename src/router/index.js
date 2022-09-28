import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../public/pages/Home.component.vue'

//const AboutView = () => import('../public/pages/aboutView.vue');
const Destiny =() => import('../varuta/pages/destiny-list.component.vue')
const Senders =() => import('../varuta/pages/senders-list.component.vue')
const Consignees =() => import('../varuta/pages/consignees-list.component.vue')
const Documents =() => import('../varuta/pages/document-list.component.vue')
const Shipping =() => import('../varuta/pages/shipping-list.component.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/destinations',
      name: 'destinations',
      component: Destiny
    },
    {
      path: '/senders',
      name: 'senders',
      component: Senders
    },
    {
      path: '/consignees',
      name: 'consignees',
      component: Consignees
    },
    {
      path: '/documents',
      name: 'documents',
      component: Documents
    },
    {
      path: '/envios',
      name: 'envios',
      component: Shipping
    }
  ]
})

export default router
