import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Shop from '../views/Shop.vue'
import Reservations from '../views/Reservations.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import CurrentDate from '../views/CurrentDate.vue'
import Products from '../views/Products.vue'
import Orders from '../views/Orders.vue'
import Chart from '../views/Chart.vue'
import Prenotazioni from '../views/Prenotazioni.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Dashboard'
    },
    component: Dashboard
  },
  {
    path: '/shop',
    name: 'shop',
    meta: {
      title: 'Nuova Prenotazione'
    },
    component: Shop
  },
  {
    path: '/prenotazioni',
    name: 'reservations',
    meta: {
      title: 'Prenotazioni'
    },
    component: Prenotazioni
  },
  {
    path: '/ordini',
    name: 'orders',
    meta: {
      title: 'Ordini'
    },
    component: Orders
  },
  {
    path: '/data',
    name: 'dateSelector',
    meta: {
      title: 'Data di lavoro'
    },
    component: CurrentDate
  },
  {
    path: '/prodotti',
    name: 'products',
    meta: {
      title: 'Prodotti'
    },
    component: Products
  },
  {
    path: '/analisi',
    name: 'chart',
    meta: {
      title: 'Analisi'
    },
    component: Chart
  },
  {
    path: '/impostazioni',
    name: 'settings',
    meta: {
      title: 'Impostazioni'
    },
    component: Settings
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login'
    },
    component: Login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
