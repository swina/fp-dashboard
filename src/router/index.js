import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Shop from '@/views/Shop.vue'
import Reservations from '@/views/Reservations.vue'
import Settings from '@/views/Settings.vue'
import Login from '@/views/Login.vue'
import CurrentDate from '@/views/CurrentDate.vue'
import Products from '@/views/Products.vue'
import Orders from '@/views/Orders.vue'
import Chart from '@/views/Chart.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Dashboard
  },
  {
    path: '/shop',
    name: 'shop',
    component: Shop
  },
  {
    path: '/prenotazioni',
    name: 'reservations',
    component: Reservations
  },
  {
    path: '/ordini',
    name: 'orders',
    component: Orders
  },
  {
    path: '/data',
    name: 'dateSelector',
    component: CurrentDate
  },
  {
    path: '/prodotti',
    name: 'products',
    component: Products
  },
  {
    path: '/analisi',
    name: 'chart',
    component: Chart
  },
  {
    path: '/impostazioni',
    name: 'settings',
    component: Settings
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  //{
  //  path: '/impostazioni',
  //  name: 'settings',
  //  component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  //}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
