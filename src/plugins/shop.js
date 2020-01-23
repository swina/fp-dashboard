import Vue from 'vue'
import store from '@/store'

export default {
  install: function (Vue) {
    Vue.prototype.$wish = function(){
      let item = store.state.shop.product
      let icon = 'like-o'
      let is_wishes = store.state.user.wishes.filter(wish=>{
        return wish._id === this.item._id
      })
      is_wishes.length ? icon = 'like' : icon = 'like-o'
      return icon
    }

    Vue.prototype.$wish_add = function(){
      if ( store.state.user.wishes ){
        let item = store.state.shop.product
        let icon = 'like-o'
        let is_wishes = store.state.user.wishes.filter(wish=>{
          return wish._id === item._id
        })
        if ( is_wishes.length ){
          is_wishes = store.state.user.wishes.filter(wish=>{
            return item._id != wish._id
          })
          store.commit('wishes',is_wishes)
        } else {
          store.commit('wish_add', item)
          icon = 'like'
        }
        return icon
      }
    }

    Vue.prototype.$wish_remove = function(index){
      let wishes = store.state.user.wishes
      console.log ( 'removing wishes' )
      wishes.splice(index,1)
      store.commit('wishes',wishes)
      store.commit('products',wishes)
    }
  }
}
