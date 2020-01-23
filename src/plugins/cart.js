import Vue from 'vue'
import store from '@/store'

export default {
  install: function (Vue) {

    Vue.prototype.$add_to_cart = function( data = {} ){
      let total = 0
      let variations_total = 0
      let qty = data.qty
      let p = data.item
      parseFloat(p.sale_price) ? total += parseFloat(p.sale_price)*parseFloat(qty) : total+= parseFloat(p.price)*parseFloat(qty)
      let item_total = total
      if ( data.variations ){
        data.variations.map(va=>{
          if ( va.price ){
            variations_total += parseFloat(va.price)
          }
        })
      }
      total = item_total + variations_total
      let obj = {
        item : data.item ,
        variations: data.variations,
        total: total,
        qty: qty ,
        total_variation: variations_total
      }
      /*
      let variations_total = 0
      if ( store.state.shop.product.variations ){
        store.state.shop.product.variations.map(va => {
          if ( va.price ){
            variations_total += parseFloat(va.price)
          }
        })
      }
      total = item_total + variations_total
      */
      //order_total.total = parseFloat(total).toFixed(2)
      //store.commit('add_cart_total',total)
      //store.dispatch('AddToCart' , data )
      store.dispatch('AddToCart', obj)
      store.commit('cart_total',total)
      return true
    }

    Vue.prototype.$remove_from_cart = function ( index ){
      if ( index != 'undefined' ){
        let cart = store.state.cart
        let p = cart.items
        p.splice(index,1)
        let cart_total = 0
        let cart_total_variation = 0
        p.map (item=>{
          cart_total += parseFloat(item.total)
        })
        let totals = {
          cart      : cart_total ,
          total     : cart_total ,
          shipping  : 0 ,
          discount  : 0 ,
          coupon    : '',
          coupon_value : ''
        }
        store.commit('update_cart_items',p)
        //store.commit('update_cart_total',cart_totals.total)
        store.commit('update_cart_totals',totals)
        //store.commit('order_total',order_total)
      }
    }

    Vue.prototype.$check_coupon = function(code){
      return new Promise((resolve, reject) => {
        let response = {}
        this.$api.service('coupons').find({query:{code:code}}).then(result=>{
          if ( result.data.length ) {
            response.check = true// this.$coupon(result.data[0],store.state.cart.total)
            response.coupon = result.data[0]
           
            resolve( response )
          } else {
            response.check = false 
            response.dialog_message = this.$tr('invalid code')
            resolve (response)
          }
        })
      })
    }

    Vue.prototype.$coupon = function ( coupon , total ){
      let result
      if ( coupon ){
        if ( parseFloat(total) >= coupon.limit ){
          if ( !coupon.discount ){
            store.commit('update_cart_totals', {
              coupon: coupon._id,
              coupon_value: coupon.value,
              total: (parseFloat(total) - parseFloat(coupon.value)).toFixed(2),
              discount: coupon.value,
              cart: store.state.cart.totals.cart,
              shipping: store.state.cart.totals.shipping
            })
            return { error: false  }
          } else {
            let value = parseFloat(total) - ((parseFloat(total)*parseFloat(coupon.discount))/100)
            store.commit('update_cart_totals',
              {
                coupon: coupon._id,
                coupon_value: coupon.discount + '%',
                total: value.toFixed(2),
                discount: ((parseFloat(total)*parseFloat(coupon.discount))/100).toFixed(2),
                cart: store.state.cart.totals.cart,
                shipping: store.state.cart.totals.shipping
              })
            return { error: false }
          }
        } else {
          return { error : 'coupon limit' , value: coupon.limit }
        }
      }
      return result
    }
  },
  
}
