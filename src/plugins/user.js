import Vue from 'vue'
import store from '@/store'

export default {
  install: function (Vue) {
    Vue.prototype.$user_orders = function(){
      let query = {
        query :{
          user : {
            _id: store.state.user._id
          }
        }
      }
      this.$api.service('orders').find(query).then(result=>{
        console.log ( result )
        return result.data
      })
    }
  }
}
