import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../shared/public/pages/Home.component.vue'

const Destiny =() => import('../handling/components/destiny-information-section.component.vue')
const Senders =() => import('../profiles/components/senders-information-section.component.vue')
const Consignees =() => import('../profiles/components/consignees-information-section.component.vue')
const Documents =() => import('../handling/components/document-information-section.component.vue')
const Shipping =() => import('../booking/components/shipping-information-section.component.vue')


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
      path: '/shipping',
      name: 'shipping',
      component: Shipping
    }
  ]
})

export default router
