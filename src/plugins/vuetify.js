import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import colors from 'vuetify/es5/util/colors'
import theme from './theme'
import store from '@/store/store'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme
})

store.commit('theme',theme)
