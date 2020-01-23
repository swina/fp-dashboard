<template>
    <div class="flex flex-wrap w-full justify-center">
        <div class="w-full bg-primary text-secondary mb-2 text-center p-4">
            {{options.title}}
        </div>
        <template  v-for="(card,index) in $store.getters[options.getter]">
            <div :class="style" :key="'card_' + index">
                <div class="rounded-t-lg object-cover w-full shadow-lg h-48" v-lazy:background="card[options.img]">
                    <!--<img v-lazy="card"/>-->
                </div>
                
                <div class="px-2 py-4 border-l border-r border-t">
                    <div class="font-light mb-2">
                        <span>{{card[options.name]}}</span>
                    </div>
                    <div v-if="card.rating">
                        <v-rating-mood :showRating="false" :starSize="20" :rating="card.rating"/>
                    </div>
                    <div v-if="card.price">
                        <v-price-mood :price="item_price(card)"/>
                    </div>
                </div>
                
                <div class="flex items-center justify-center py-4 border-b border-r border-l rounded-b-lg">
                    
                    <button @click="$emit('click',card)" class="btn inline-block text-sm btn-secondary">
                        {{$tr(options.btn)}}
                    </button>
                    
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data:()=>({
        items:null
    }),
    props:{
        options: {
            type: Object ,
            required: false ,
            default: ()=> {  }
        }
    },
    computed:{
        lista(){
            return this.$store.getters[this.options.getter]
        },
        style(){
            if ( this.options.style === 'dense' ){
                return 'w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4 px-6 rounded mb-4 overflow-hidden'
            }
            return 'w-full md:w-1/3 lg:w-1/3 xl:w-1/4 px-6 rounded mb-4 overflow-hidden'
        },
    },
    methods:{
        routing(item){
            if ( this.options.route ){
                
                if ( this.options.param ){
                    
                    return this.options.route + '/' + this.item[this.options.param]
                }
                return this.options.route
            }
            return '/'
        },
        item_price(item){
            return {
                price: item.price,
                sale_price: item.sale_price,
                qty: 1
            }
        }
    }
}
</script>