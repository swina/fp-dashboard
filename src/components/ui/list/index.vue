<template>
    <div class="flex flex-wrap w-full justify-center">
        <div v-if="options.title" class="w-full bg-primary text-secondary mb-2 text-center p-4">
            {{options.title}}
        </div>
        <template  v-for="(card,index) in lista">
            <div class="w-full flex flex-wrap h-24 p-2 border-b border-grey" :key="'card_' + index">
                <div class="w-1/4 flex object-cover h-20" v-lazy:background="card[options.img]">
                    <!--<img v-lazy="card"/>-->
                </div>
                
                <div class="w-1/2 flex items-center pl-2">
                    <div class="font-light mb-2 justify-start text-left">
                        <span>{{card[options.name]}}</span>
                    </div>
                </div>    
                <div class="w-1/4 flex flex-wrap items-center justify-center">
                    <v-price-mood v-if="card.price" :price="item_price(card)"/>
                    <div class="w-full flex justify-center">
                        <button v-if="options.btn" @click="$emit('click',card)" class="btn text-sm btn-primary mr-2">
                            {{$tr(options.btn)}}
                        </button>
                        <v-switch-mood v-if="options.isswitch" :binded="card" @change="elStatus"/>
                    </div>
                </div>
                <!--
                    <button @click="$emit('click',card)" class="btn bg-primary inline-block text-sm text-secondary hover:bg-secondary hover:text-primary mr-2">
                        {{options.btn}}
                    </button>
                -->    
                
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data:()=>({
    }),
    props:{
        options: {
            type: Object ,
            required: false ,
            default: ()=> { contest: 'info'}
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
                qty:1
            }
        },
        elStatus(el,obj){
            this.$emit('change',el,obj)
        }
    }
}
</script>