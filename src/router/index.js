import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../shared/public/pages/Home.component.vue'

//const AboutView = () => import('../public/pages/aboutView.vue');
const Home=() => import('../shared/public/pages/Home.component.vue')
const Destiny =() => import('../handling/components/destiny-information-section.component.vue')
const Senders =() => import('../profiles/components/senders-information-section.component.vue')
const Consignees =() => import('../profiles/components/consignees-information-section.component.vue')
const Documents =() => import('../handling/components/document-information-section.component.vue')
const Shipping =() => import('../booking/components/shipping-information-section.component.vue')
const LogIn =() => import('../security/component/user-consignee.component.vue')
const Register=() => import('../security/component/user-consignee-register.component.vue')



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: LogIn
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    }
      ,
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
    },
    {
      path:'/register',
      name:'register',
      component: Register
    }
  ]
})

export default router