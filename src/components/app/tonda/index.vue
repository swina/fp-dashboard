<template>
    <draggable :list="slices" group="gusti" :class="'flex flex-row flex-wrap min-h-full shadow bg-gray-300 border-4 border-black border-dashed ' + dragHeight" @change="change">
        <template v-for="(slice,index) in slices">
            <div :key="'slice_' + index" class="w-full bg-gray-600 border-b cursor-move items-center relative flex flex-row justify-between p-2">
                <!--<div v-if="view==='photo'" class="w-32 h-32 m-1">
                    <img v-if="slice" :src="slice.image" class="h-32 w-32"/>
                </div>-->
                <div v-if="slice" class="w-1/2 pl-2 text-left"><span>{{slice.name}}</span></div>
                
                <div v-if="slice && !parseInt(slice.sale)"><span class="tagged bg-white">&euro; {{slice.price}}</span></div>
                <div v-if="slice && parseInt(slice.sale)"><span class="tagged bg-white text-red-500">&euro; {{slice.sale}}</span></div>
                <i v-if="slice" class="material-icons fab" @click="slices.splice(index,1)">delete</i>
            </div>
            
        </template>
    </draggable>
</template>
<script>

import draggable from 'vuedraggable'
export default {
    name : 'ShopTonda',
    components: {
        draggable
    },
    data:()=>({
        slices:[],
        cart:null
    }),
    computed:{
        dragHeight(){
            return this.slices.length ? 'h-full' : 'h-10'
        }
    },
    watch:{
        slices(array){
            this.cart.tonde = array  
            this.$store.dispatch('CreateCart',this.cart)
        }
    },
    methods:{
        change(evt){
            /*if ( !evt.move ){
                let single = evt.added.element
                let items = this.$store.getters.cart.items
                this.mode === 1 ? 
                    items.tonde.push ( single ) : 
                    items.tranci.push ( single )  
                this.$store.dispatch('CreateCart',items)
                //this.mode === 1 ? this.slices = this.$store.getters.cart.items.tonde : this.slices = this.$store.getters.cart.items.tranci    
                //this.slices.pop()
            }
            */
        },
    },
    mounted(){
       
        this.slices = this.$store.getters.cart.items.tonde
        this.cart = this.$store.getters.cart.items
    }
}
</script>