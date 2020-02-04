<template>
    <div class="w-full flex flex-col md:flex-row bg-gray-400 flex-wrap pb-20">
        <!--<div class="w-full flex flex-row p-2">
            <span title="Lista" @click="view='list'"><i class="material-icons fab">list</i></span>
            <span title="Foto" class="ml-2" @click="view='photo'"><i class="material-icons fab">image</i></span>
        </div>
        -->    
        <div class="w-full md:w-1/2 pb-4 flex flex-col">
            <div class="w-full flex flex-row items-center text-center">
                <!--<i class="material-icons fab" @click="nextPage(0)">keyboard_arrow_left</i>-->
                <div class="w-full text-xl font-bold">Listino <i class="material-icons fab" @click="searchView=!searchView">search</i><p class="text-xs">Trascina il prodotto a destra per aggiungerlo</p></div>
                <!--<i class="material-icons fab" @click="nextPage(1)">keyboard_arrow_right</i>-->
            </div>
            <div class="w-full p-1" v-if="searchView">
                <input type="text" v-model="search" placeholder="cerca prodotto" class="w-3/4 text-xs"/>
                <button class="btn btn-blue" @click="initProducts">Tutti</button>
            </div>
            <draggable :list="products" :group="{ name: 'gusti', pull: 'clone', put: false }" class="bg-white p-1 flex flex-row flex-wrap">
                <template  v-for="(product,index) in products">
                    <div :key="'product_' + index" class="text-sm tagged px-2 border border-black mr-2 mb-2 cursor-pointer">{{product.name}}</div>
                </template>
            </draggable>
        </div>
        <div class="w-full md:w-1/2 p-2 h-full">
            <div class="text-xl font-bold text-left cursor-pointer flex flex-row justify-between items-center">
                <template v-for="(mode,m) in modes">
                    <span v-if="m===currentMode" class="border-t border-lr p-2 rounded-t bg-red-700 text-white mr-2">{{mode}}</span>
                    <span v-if="m!=currentMode" class="mr-2 text-gray-600 hover:text-red-500" @click="currentMode=m">{{mode}}</span>
                </template>
            </div>
            
            
            <v-appTeglia v-if="currentMode===0"/>
            <v-appTonda v-if="currentMode===1"/>
            <v-appSingle v-if="currentMode===2"/>
        </div>

        <div class="fixed bottom-0 left-0 w-full border-t bg-blue-300 items-center flex flex-col">
            <!--<div class="w-full flex flex-row justify-between p-2 bg-black text-white">
                <template v-for="(type,index) in Object.keys(cart)">
                        <div :key="'type_' + index"><span class="uppercase">{{type}}</span><span class="ml-2 px-4 py-2 bg-red-700 text-white">{{cart[type].length}}</span></div>
                    
                </template>
            </div>
            -->
            <div class="w-full flex flex-row bg-black text-white">
                <div class="w-1/2 text-left flex flex-row justify-around items-center">
                <template v-for="(type,index) in Object.keys(cart)">
                        <div :key="'type_' + index"><span class="uppercase">{{type}}</span><span class="ml-2 px-4 py-2 bg-red-700 text-white">{{cart[type].length}}</span></div>
                    
                </template>
                </div>
                <div class="w-1/4 text-left">
                    <span class="text-md ml-2" v-if="$store.getters.currentName">Cliente: 
                        <span class="text-xl font-bold">{{$store.getters.currentName}}</span>
                    </span>
                    <span v-if="$store.getters.currentTime">
                        <span>{{$dFormat($store.getters.currentDate)}} <i class="material-icons">alarm</i> <span class="bg-white p-2 rounded">{{$store.getters.currentTime}}</span></span>
                    </span>
                </div>
                <!--<div class="w-1/3"><span class="font-bold text-md" v-if="$store.getters.currentTime">{{$dFormat($store.getters.currentDate)}} <i class="material-icons">alarm</i> <span class="bg-white p-2 rounded">{{$store.getters.currentTime}}</span></span></div>-->
                <div class="w-1/4 text-md text-right flex flex-row items-center">

                    <div class="w-1/2 p-2 bg-white text-black">&euro; {{total}}</div>
                    <div class="w-1/2 bg-red-700 text-white p-2 text-center hover:bg-black cursor-pointer" @click="createReservation">Prenota</div>
                </div>
            </div>
    </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
    name: 'Shop',
    components : {
        draggable
    },
    data:()=>({
        view: 'list',
        search:'',
        searchView: false,
        modes: ['TEGLIA','PIZZA TONDA','TRANCIO'],
        currentMode: 0,
        startIndex: 0,
        endIndex: 10,
        cart:{
            teglie:[],
            tonde:[],
            tranci:[]
        },
        products:[],
        slices:[],
        gusti:0,
        teglie:[],
        teglia: false,
        cartTotal: 0,
        total: 0
    }),
    computed:{
        component(){
            return this.currentMode === 0 ? v-AppTeglia : null
        }
    },
    watch:{
        currentMode(mode){
            console.log ( 'Set mode to => ' , mode)
            this.$store.dispatch('CartMode',mode)
        }
    },
    methods:{
        initProducts(){
            this.products = this.$store.getters.products
        },
        createReservation(){
            if ( !this.$store.getters.currentName ){
                this.$router.push ( 'prenotazioni' )
            }
        }
    },
    mounted(){
        this.initProducts()
        this.cart = this.$store.getters.cart.items
    }
}
</script>