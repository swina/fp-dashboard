const cart = {
    state: {
        items:[],
        total:0,
        totals:{
          cart:0,
          total:0,
          discount:0,
          shipping:0,
          coupon:'',
          coupon_value:''
        },
        delivery:[]
    },
    mutations: {
        cart(state,products){
            state.items = products
        },
        reset_cart(state){
            state.items = []
        },
        add_to_cart(state,product){
            console.log ( product )
            state.items.push( product )
        },
        cart_total(state,total){
            state.total = total
            //state.total += total
            //state.totals.total += total
            //state.totals.cart += total
        },
        
        delivery(state,delivery){
            state.delivery = delivery
        },
        reset_cart(state){
            state.items = []
            state.total = 0
            state.totals = {
            cart:0,
            total:0,
            discount:0,
            shipping:0,
            coupon:'',
            coupon_value:''
            }
            state.delivery = []
        },
        update_cart_items(state,items){
            state.items = items
        },
       
        update_cart_totals(state,totals){
            state.totals = totals
        }
    },
    actions :{
        CreateCart({commit},items){
            commit('cart',items)
        },
        ResetCart({commit}){
            commit('reset_cart')
        },
        AddToCart({commit},data){
            commit('add_to_cart',data)
        },
        SetCartTotal({commit},total){
            commit('cart_total',total)
        }

    }
}
export default cart