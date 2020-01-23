import Vue from 'vue'
import store from '@/store'

export default {
  install: function (Vue) {
    Vue.prototype.$create_order = function ( payment = this.$tr('reservation') ){
      console.log ( payment )
      let reservation = Date.now()
      let summary = store.state.cart.totals
      summary.cart_total = store.state.cart_total
      let order = {
        reservation: reservation,
        total_to_pay: store.state.cart.total,
        payment: payment,
        status: 0,
        items: store.state.cart.items,
        user: store.state.user.user,
        summary: store.state.cart.totals,
        delivery: store.state.cart.delivery,
        created: store.state.cart.delivery.date
      }
      console.log ( 'order=>', order )
      store.commit('order',order)
      /*
      this.$api.service('orders').create(order).then(result=>{
        store.state.cart.items.map(item=>{
          item.id = item._id
          item.ordernr = reservation
          item.ref = result.nr
          item.status = 0
          item.delivery = store.state.cart.delivery,
          delete item._id
          this.$api.service('orderitems').create(item)
        })
        //store.commit('reservation',reservation)
        store.commit('order',result)
        store.commit('reset_cart')
        this.$router.push('/order')
      })
      */
    }
  }
}
