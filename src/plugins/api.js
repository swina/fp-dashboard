import Vue from 'vue'
import store from '@/store'

function padNumber(num,str){
  if ( num < 10 ){
      return str + num
  } else {
      return num
  }
}

function queryDate(d){
  let today = new Date(d);
  let year = today.getFullYear()
  let month = padNumber(today.getMonth()+1,'0')
  let day = padNumber(today.getDate(),'0')
  console.log ( year+'-'+month+'-'+day )
  return year+'-'+month+'-'+day
}

function query_by_date ( d = null , status = 0  ){
  let date
  let query
  !d ? date = queryDate( new Date() ) : date = queryDate( new Date(d)) 
  
    query = { 
      query: {
        items : {
            $gt: 0
        },
        date: date,
        status: status,
        $limit: 200,
        $sort : {
            date: 1,
            time: 1
        }
      }
    }
    return query
  
}


function query_by_period ( from = null , to = null , status = 0){
    let dateFrom, dateTo, query
    !from ? dateFrom = queryDate( new Date() ) : dateFrom = queryDate( from )
    let d = new Date(dateFrom)
    d.setDate ( d.getDate() - 7 )
    !to ? dateTo = queryDate( d ) : dateTo = queryDate( to )
    query = { 
      query: {
        items : {
            $gt: 0
        },
        date: {
          $gt : dateFrom ,
          $lt : dateTo
        },
        status: status,
        $limit: 200,
        $sort : {
            date: 1,
            time: 1
        }
      }
    }
  return query
}

export default {
  install: function (Vue) {

    Vue.prototype.$reservations = function (from=null){
      let date 
      let query
      !from ? date = store.getters.currentDate : date = from 
      console.log ( from )
      return new Promise((resolve,reject) => {
        if ( !from ){
          query = { 
            query: {
              items : {
                  $gt: 0
              },
              date: date,
              status: 0,
              $limit: 200,
              $sort : {
                  date: 1,
                  time: 1
              }
            }
          }
        } else {
          query = { 
            query: {
              items : {
                  $gt: 0
              },
              date: {
                $gt : date 
              },
              status: 0,
              $limit: 200,
              $sort : {
                  date: 1,
                  time: 1
              }
            }
          }
        }
        this.$api.service('reservations').find( query ).then ( response => {
          store.dispatch( 'SetReservations' , response.data )
          resolve(true)
        }).catch ( error => {
          console.log ( error )
        })
      })
    }

    Vue.prototype.$orders = function( d = null ){
      store.getters.currentDate ? d = store.getters.currentDate : null
      let query = query_by_date ( d , 1 )
      console.log ( query )
      this.$api.service('reservations').find ( query ).then ( response => {
        store.dispatch('SetOrders',response.data)
        console.log ( response.data )
      })
    }

    Vue.prototype.$ordersByPeriod = function ( from = new Date() , to = new Date() , status = 0){
      return new Promise((resolve, reject) => {
        let query = query_by_period ( from , to , status )
        console.log ( from, to , query )
        this.$api.service('reservations').find ( query ).then ( response => {
          store.dispatch('SetOrders',response.data)
          resolve(true)
        })
      })
    }

    Vue.prototype.$categories = function(d= new Date()){
      return new Promise((resolve, reject) => {
        let query = {
          query: {
            language : this.$root.locale,
            status: true,
            home: true,
            $sort: { order_int: 1}
          }
        }
        this.$api.service('categories').find(query).then(response=>{
          store.commit('categories',response.data)
          resolve(true)
        }).catch(err=>{
          console.log ( err )
        })
      })
    }

    Vue.prototype.$sales = function(){
      return new Promise((resolve, reject) => {
        let query = {
          query: {
            language: this.$root.locale,
            sale_price : {
              '$gt' : '0'
            },
            status: 1,
            $sort : { category_id:1 , order_int: 1}
          }
        }
        this.$api.service('products').find(query).then(response=>{
          console.log ( response.data )
          store.commit('sales',response.data)
          resolve(true)
        }).catch(error=>{
          reject()
        })
      })
    }

    Vue.prototype.$products = function(){
      return new Promise((resolve, reject) => {
        let query = {
          query :{
            $sort: { name: 1}
          }
        }
        this.$api.service('products').find(query).then(response=>{
          this.$store.dispatch('SetProducts',this.products)
          resolve(true)
        }).catch(error=>{
          console.log ( error )
          reject(false)
        })
      })
    }

    Vue.prototype.$category = function(item){
      let cat = store.state.shop.categories.filter(c=>{
        return c._id === item.category_id
      })
      return cat[0].category
    }


    Vue.prototype.$variations = function(){
      return new Promise((resolve, reject) => {
        let query = {
          query : {
            category_id: this.$store.state.shop.product.category_id,
            status: 1,
            language: this.$store.state.user.locale,
            variation: 1,
            $sort: { order_int:1}
          }
        }
        this.$api.service('products').find(query).then(result=>{
          store.commit('variations',result.data)
          resolve(true)
        }).catch(error=>{
          reject()
        })
      })
    }

    Vue.prototype.$configurable_items = function(){
      return new Promise((resolve, reject) => {
        let query = {
          query :{
            category_id: store.state.shop.category.configurable_category,
            status: 1,
            variation: 0,
            language: store.state.user.locale,
            $sort: { order_int: 1}
          }
        }
        this.$api.service('products').find(query).then(response=>{
          store.commit('configurable_items',response.data)
          resolve(true)
        }).catch(error=>{
          reject()
        })
      })
    }

    /*
    Vue.prototype.$wish = function(item){
      return new Promise((resolve,reject)=>{
        let wishes = []
        if ( store.state.user.wishes ){
          wishes = store.state.user.wishes
        }
        wishes.push ( item._id )
        this.$api.service('user/wishes/').patch(store.state.user._id,{wishes:wishes}).then(response=>{
          console.log ( response )
          resolve(true)
        }).catch(error=>{
          console.log ( error )
          reject()
        })
      })
    }
    */
  }
}
