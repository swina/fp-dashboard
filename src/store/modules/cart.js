const cart = {
    state: {
        mode: 0,
        items:{
            teglie: [],
            tonde: [],
            tranci:[]
        },
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
        mode ( state , mode ){
            state.mode = mode
        },
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
        add_tonde(state,product){
            state.items.tonde.push(product)
        },
        add_tranci(state,product){
            state.items.tranci.push(product)
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
            state.items = {
                teglie: [],
                tonde: [],
                tranci:[]
            }
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
        CartMode ( { commit } , mode ){
            commit ( 'mode' , mode )
        },
        CreateCart({commit},items){
            commit('cart',items)
        },
        AddSingleTonde({commit},product){
            commit('add_tonde',product)
        },
        AddSingleTranci({commit},product){
            commit ( 'add_tranci' , product )
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