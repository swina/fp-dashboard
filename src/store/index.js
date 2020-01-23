import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'
import getters from './getters'
import shop from './modules/shop'
import cart from './modules/cart'
import reservations from './modules/reservations'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: getters,
  /*plugins:[
    createPersistedState( { key:'fp-vuex' , paths: ['user','shop','navigation','settings','cart']})
  ],
  */
  modules: {
    shop,
    cart,
    reservations,
    settings: {
      state :{
        translations:[],
        theme:[]
      },
      mutations:{
        translations(state,translations){
          state.translations = translations
        },
        theme(state,theme){
          state.theme = theme
        }
      }
    },
    navigation:{
      state: {
        drawer: false,
        drawer_right: false,
        dialog: false,
        configurable: false,
        search: '',
        component:'',
        title: 'sales',
        description: '',
        notify:{
          status: false,
          title: '',
          error: ''
        },
        search: '',
        routing :{
          shipment: '/cart',
          checkout: '/shipment'
        }
      },
      mutations:{
        notify(state,notify){
          state.notify = notify
        },
        notify_off(state){
          state.notify = {
            status: false ,
            title: '',
            error: ''
          }
        },
        drawer(state){
          state.drawer = !state.drawer
        },
        drawer_right(state){
          state.drawer_right = !state.drawer_right
        },
        configurable(state){
          state.configurable = !state.configurable
        },
        search(state,search){
          state.search = search
        },
        component(state,component){
          state.component = component
        },
        dialog(state){
          state.dialog = !state.dialog
        },
        search(state,search){
          state.search = search
        }
      },
      actions:{
        SetNotify({commit},notify){
          commit('notify',notify)
        },
        CloseNotify({commit}){
          commit('notify_off')
        },
        SetSearch({commit},search){
          commit('search',search)
        }
      }
    },
    
    user: {
      state:{
        logged: false,
        locale: '',
        translations: [],
        wishes:[],
        user:[],
        register:{
          error: false,
          msg:''
        },
        promo: false
      },
      mutations:{
        logged(state,logged){
          state.logged = logged
        },
        locale(state,locale){
          state.locale = locale
        },
        user_translations(state,translations){
          state.translations = translations
        },
        wishes(state,wishes){
          state.wishes = wishes
        },
        wish_add(state,wish){
          state.wishes.push ( wish )
        },
        user(state,user){
          state.user = user
        },
        user_register_error(state,error){
          state.register = {
            error : true,
            msg : error
          }
        },
        promo(state){
          state.promo = !state.promo
        }
      },
      actions: {
        SetLogged({commit},logged){
          commit('logged',logged)
        },
        SetPromo({commit}){
          commit('promo')
        },
        SetUser({commit},user){
          commit('user',user)
        }
      }
    },
  
    order: {
      state: {
        order:null
      },
      mutations:{
        order(state,order){
          state.order = order
        }
      }
    }
  }
})
