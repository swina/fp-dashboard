const shop = {
    state: {
        settings:null,
        shop:[],
        categories:[],
        category:[],
        products:[],
        product:[],
        variations:[],
        configurable_items:[],
        taste:[],
        sales:[],
        tags:[],
        qty:1
    },
    mutations:{
        settings(state,settings){
            state.settings = settings
        },
        shop(state,shop){
            state.shop = shop
        },
        SET_TAGS(state,tags){
            state.tags = tags
        },
        SET_PRODUCT(state,product){
        state.product = product
        },
       
        categories(state,categories){
            state.categories = categories
        },
        category(state,category){
            state.category = category
        },
        products(state,products){
            state.products = products
        },
        product(state,product){
            state.product = product
        },
        variations(state,variations){
            state.variations = variations
        },
        configurable_items(state,items){
            state.configurable_items = items
        },
        product_variations(state,variations){
        //if ( !state.product.variations ){
        //  state.product.variations = []
        //}
            state.product.variations = variations
        },
        tastes(state,tastes){
            state.tastes = tastes
        },
        product_configurables(state,tastes){
            state.product.configurables = tastes
        },
        sales(state,sales){
            state.sales = sales
        },
        qty(state,qty){
            state.qty = qty
        }
    },
    actions: {
        SetSettings({commit},settings){
            commit('settings',settings)
        },
        SetShop({commit},shop){
            commit('shop',shop)
        },
        SetCategories({commit},categories){
            commit('categories',categories)
        },
        SetCategory({commit},category){
            commit('category',category)
        },
        SetProducts({commit},products){
            commit('products', products)
        },
        SetProduct({commit},product){
            commit('SET_PRODUCT',product)
        },
        SetSales({commit},sales){
            commit('sales',sales)
        },
        SetTags({commit},tags){
            commit('SET_TAGS',tags)
        },
        SetQty({commit},qty){
            commit('qty',qty)
        }

    }
}

export default shop