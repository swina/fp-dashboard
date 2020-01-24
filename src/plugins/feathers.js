import Vue from 'vue'
import store from '@/store'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import myapi from './api'
import router from '@/router'

const socket = io( 'https://fp-admin-api.herokuapp.com/', {
  transports: ['websocket'],
  polling: {
    extraHeaders: {
      Authorization: 'Basic000002121212121212222'
    }
  }
})//process.env.VUE_APP_APISERVER, {transports: ['websocket']})

const api = feathers()
  .configure(socketio(socket,{
    timeout:20000
  }))
  .configure(auth({ storage: window.localStorage }))

//set current user locale
store.commit('locale', window.navigator.userLanguage || window.navigator.language)

//init data (translations,store info,categories,sales)

/*
api.service('translations').find().then(result=>{
  store.commit('translations',result.data)
  store.commit('user_translations',
    result.data.filter(lang=>{
      return lang.locale === store.state.user.locale
    })
  )
  console.log ( 'loaded translations ...')
  api.service('store').find().then(result=>{
    store.dispatch('SetShop',result.data[0])
    console.log ( 'loaded store ...')

    let query = {
      query: {
        language : store.state.user.locale,
        status: true,
        home: true,
        $sort: { order_int: 1}
      }
    }

    api.service('categories').find(query).then(response=>{
      store.dispatch('SetCategories',response.data)
      console.log ( 'loaded categories ...')
      let query = {
        query: {
          language: store.state.user.locale,
          sale_price : {
            '$gt' : '0'
          },
          status: 1,
          $sort : { category_id:1 , order_int: 1}
        }
      }
      api.service('products').find(query).then(response=>{
        store.dispatch('SetSales',response.data)
        console.log ( 'loaded sales ...')
      }).catch(error=>{
        console.log ( error )
      })
    }).catch(err=>{
      console.log ( err )
    })

  })
})
*/

api.authenticate().then(user=>{
  store.dispatch('SetUser',user)
  store.dispatch('SetLogged',true)
  api.service('settings').find().then(response=>{
    console.log ( 'settings' , response.data )
    store.dispatch('SetSettings',response.data[0])
  })
  api.service('products').find({query:{type:'gusto',$sort:{name:1}}}).then(response=>{
    store.dispatch('SetProducts',response.data)
    console.log ( 'loaded products ...')
  }).catch(error=>{
    console.log ( error )
  })  
}).catch(error=>{
  router.push('login')
  console.log ( 'not authenticated ...')
  //api.authenticate({
  //  email: 'admin',
  //  password: 'password',
  //  strategy:'local'
  //}).then ( user=> {
  //  store.dispatch ( 'SetUser' , user )
  //  api.service('settings').find().then(response=>{
  //    store.dispatch('SetSettings',response.data[0])
  //  })
  //  api.service('products').find({query:{type:'gusto',$sort:{name:1}}}).then(response=>{
  //    store.dispatch('SetProducts',response.data)
  //    console.log ( 'loaded products ...')
  //  }).catch(error=>{
  //    console.log ( error )
  //  }) 
  //}).catch ( error => {
  //  console.log ( error )
  //})
})

export default {
  install: function (Vue) {
    Vue.prototype.$api = api
  }
}
