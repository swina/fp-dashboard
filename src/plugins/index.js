import Vue from 'vue'
//import VueLazyload from 'vue-lazyload'
//import SvgIcon from 'vue-svgicon'

import apiserver from './feathers'
import translator from './translator'
import api from './api'
import utils from './utils'
import cart from './cart'
import auth from './auth'
import order from './order'
import user from './user'
import shop from './shop'

//Vue.use(VueLazyload)
//Vue.use(SvgIcon)
Vue.use(apiserver)
Vue.use(translator)
Vue.use(api)
Vue.use(utils)
Vue.use(cart)
Vue.use(order)
Vue.use(auth)
Vue.use(user)
Vue.use(shop)
