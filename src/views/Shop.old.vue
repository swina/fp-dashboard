<template>
<div class="w-full flex flex-col md:flex-row flex-wrap pb-20">
        <!--<div class="w-full flex flex-row p-2">
            <span title="Lista" @click="view='list'"><i class="material-icons fab">list</i></span>
            <span title="Foto" class="ml-2" @click="view='photo'"><i class="material-icons fab">image</i></span>
        </div>
        -->    
    <div class="w-full md:w-1/2 p-2 pb-4">
        <div class="w-full flex flex-row items-center justify-between">
            <i class="material-icons fab" @click="nextPage(0)">keyboard_arrow_left</i>
            <div class="text-xl font-bold">Listino<p class="text-xs">Trascina il prodotto a destra per aggiungerlo</p></div>
            <i class="material-icons fab" @click="nextPage(1)">keyboard_arrow_right</i>
        </div>
        <div class="w-full">
            <input type="text" v-model="search" placeholder="cerca prodotto" class="w-3/4"/>
            <button class="btn btn-blue" @click="initProducts">Tutti</button>
        </div>
        <draggable :list="products" :group="{ name: 'gusti', pull: 'clone', put: false }" class="flex flex-row flex-wrap">
            
                <template  v-for="(product,index) in products">
                    <div :key="'product_' + index" class="text-sm tagged px-2 border border-black mr-2 mb-2 cursor-pointer">{{product.name}}</div>
                </template>

        </draggable>
        <!--
        <draggable v-if="currentMode!=0" :list="products" :group="{ name: 'gusti', pull: 'clone', put: false }" class="flex flex-row flex-wrap">
        
            <template  v-for="(product,index) in products">
                <transition name="collapse">
                <div v-if="index > startIndex && index < (startIndex+10) || search.length > 3" :class="'hover:bg-gray-300 cursor-move flex ' + layout" :key="'product_' + index" :title="product.name">
                    <div v-if="view==='photo'" class="w-32 h-32 m-2">
                        <img :src="product.image" class="h-32 w-32"/>
                    </div>
                    <div>
                        <span v-if="view==='photo'">{{product.name.substring(0,20)}}</span>
                        <span v-if="view==='list'">{{product.name}}</span>
                    </div>
                    
                    <div v-if="currentMode != 0 && !parseInt(product.sale)">&euro; {{product.price}}</div>
                    <div v-if="currentMode != 0 && parseInt(product.sale)" class="text-red-500">&euro; {{product.sale}}</div>
                </div>
                </transition>
            </template>
        </draggable>
        -->
    </div>
    <div class="w-full md:w-1/2 p-2 h-full">
        <div class="text-xl font-bold text-left cursor-pointer flex flex-row justify-between items-center">
            <template v-for="(mode,m) in modes">
                <span v-if="m===currentMode" class="border-t border-lr p-2 rounded-t bg-red-700 text-white mr-2">{{mode}}</span>
                <span v-if="m!=currentMode" class="mr-2 text-gray-400 hover:text-red-500" @click="currentMode=m">{{mode}}</span>
            </template>
        </div>
        <draggable :list="slices" group="gusti" class="flex flex-row flex-wrap min-h-full shadow bg-gray-300 border-4 border-black border-dashed" @change="log">
            <div v-if="currentMode===0" class="w-full flex flex-row flex-wrap text-sm font-bold items-center">
                <template v-for="(slice,index) in slices">
                    
                        <div :key="'slice_' + index" :class="'relative w-1/2 h-24 border-r border-b border-dashed border-black flex text-center m-auto items-center px-6 ' + sliceBackground(slice)">
                            <div v-if="!slice.name" class="text-center w-full">{{slice}}</div>
                            <div v-if="slice.name" class="w-full text-center">{{slice.name}}</div>
                            <div class="absolute bottom-0 right-0"><i v-if="slice.name" :class="'material-icons fab ' + iconLayout" @click="slices.splice(index,1),slices.push({name:'NA',price:'0'}),teglia=false">delete</i></div>
                        </div>

                </template>
                <div class="w-full p-2" v-if="gusti">GUSTI <span class="fab w-10 bg-red-600 text-white px-3">{{gusti}}</span></div>
                <div class="w-full bg-white p-2"><button class="btn btn-blue" v-if="teglia" @click="saveTeglia">Salva Teglia</button></div>
            </div>
            <div v-if="currentMode != 0" class="w-full">
             <template v-for="(slice,index) in slices">
                <div :key="'slice_' + index" :class="'w-full cursor-move items-center relative flex ' + layout">
                    <!--<div v-if="view==='photo'" class="w-32 h-32 m-1">
                        <img v-if="slice" :src="slice.image" class="h-32 w-32"/>
                    </div>-->
                    <div v-if="slice" :class="listCol"><span>{{slice.name}}</span></div>
                   
                    <div v-if="slice && !parseInt(slice.sale)"><span class="tagged">&euro; {{slice.price}}</span></div>
                    <div v-if="slice && parseInt(slice.sale)"><span class="tagged text-red-500">&euro; {{slice.sale}}</span></div>
                    <i v-if="slice" :class="'material-icons fab ' + iconLayout" @click="slices.splice(index,1)">delete</i>
                </div>
                
            </template>
            </div>
        </draggable>
        <div v-if="currentMode===0" class="w-full bg-black text-white p-4">
            Teglie in ordine 
            <div class="flex flex-col flex-wrap">
            <template v-for="(tg,index) in teglie">
                <div class="fab w-10 mr-2 bg-red-600 hover:bg-green-500" @click="slices=tg">{{index+1}}</div>
            </template>    
            </div>
            <button class="btn btn-blue text-sm px-2 py-1" @click="initTeglia">Nuova</button>
        </div>
    </div>
    <div class="fixed bottom-0 left-0 w-full border-t bg-blue-300 items-center flex flex-row">
        <div class="w-1/3 text-left">
            <span class="text-xl ml-2" v-if="$store.getters.currentName">Cliente: 
                <span class="text-xl font-bold">{{$store.getters.currentName}}</span>
            </span>
        </div>
        <div class="w-1/3"><span class="font-bold text-xl" v-if="$store.getters.currentTime">{{$dFormat($store.getters.currentDate)}} <i class="material-icons">alarm</i> <span class="bg-white p-2 rounded">{{$store.getters.currentTime}}</span></span></div>
        <div class="w-1/3 text-2xl text-right flex flex-row items-center">
            <div class="w-1/2 p-2 bg-white text-black">&euro; {{total}}</div>
            <div class="w-1/2 bg-red-700 text-white p-2 text-center hover:bg-black cursor-pointer" @click="createCart">Prenota</div>
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
        modes: ['TEGLIA','PIZZA TONDA','TRANCIO'],
        currentMode: 0,
        startIndex: 0,
        endIndex: 10,
        products:[],
        slices:[],
        gusti:0,
        teglie:[],
        teglia: false,
        cartTotal: 0
    }),
    computed:{
        layout(){
            return this.view === 'photo' ? 'flex-col text-xs' : 'flex-row  w-full justify-between border-b p-3'
        },
        iconLayout(){
            return this.view === 'photo' ? 'absolute top-0 left-0 p-1 m-1' : ''
        },
        listCol(){
            return this.view === 'photo' ? '' : 'w-2/3 text-left'
        },
        
        total(){
            let total = 0
            this.slices.forEach( slice => {
                
                if ( slice ){
                    parseInt(slice.sale) ? total += parseFloat(slice.sale) : total += parseFloat(slice.price) 
                }
            })
            this.cartTotal = total.toFixed(2)
            return total.toFixed(2)
        },
        
    },
    watch:{
        currentMode(mode){
            mode === 0 ? this.initTeglia() : this.slices = ['']
        },
        search(str){
            if ( str.length > 3 ){
                
                this.initProducts()
                let array = []
                this.products.map ( prod => {
                    if ( prod.name.toLowerCase().indexOf ( str.toLowerCase() ) > -1 ){
                        console.log ( prod.name )
                        array.push ( prod )
                    }
                })
                this.startIndex = 0
                this.endIndex = 10
                this.products = array
            }
        },
        slices(array){
            array = array.filter ( a => {
                return a.name != 'NA'
            })
            let gusti = this.$arrayGroup ( array , 'name' , 'qty' )
            this.gusti = gusti.keys.length
            console.log ( gusti )
        }
    },
    methods:{
        checkTeglia(){
            this.slices.forEach( slice => {
                console.log ( slice.name )
                return slice.name === 'NA' ? this.teglia = false : this.teglia = true
            })
        },
        nextPage(flag){
            if ( !flag ) {
                this.startIndex > 0 ? this.startIndex = this.startIndex-10 : this.startIndex = 0
            }
            if ( flag ){
                this.startIndex + 10 < this.products.length ? this.startIndex = this.startIndex+10 : null
            }
        },
        log(evt){
            this.currentMode != 0 ? null : this.popSlices()
        },
        popSlices(){
            this.slices.pop() 
            this.checkTeglia()
        },
        background(qty,slice){
            return slice.qty === qty ? 'bg-red-600 text-white' : ''
        },
        qty(index,qty){
            this.slices[index].qty = qty
        },
        sliceBackground(slice){
            return slice.id ? 'bg-white' : ''
        },
        getImage(i){
            let slice = this.slices[i]//this.$store.getters.slices[i]
            return slice ? 'background:url(' + slice.image + '); background-size:cover;' : ''
        },
        createCart(){
            let vm = this
            let cart = {}
            let teglie
            let array = this.slices.filter ( slice => {
                return slice.name != 'NA'
            })
            this.teglie ? teglie = { teglie : this.teglie } : null
            cart = {
                items : array,
                teglie : this.teglie
            }

            this.$store.dispatch('CreateCart',cart)
            this.$store.dispatch('SetCartTotal',this.cartTotal)
            
            
            if ( this.$store.getters.currentTime && this.$store.getters.currentDate && this.$store.getters.currentName ){
                
                let res = {
                    date: this.$store.getters.currentDate,
                    time: this.$store.getters.currentTime,
                    name: this.$store.getters.currentName,
                    items: this.slices.length,
                    total: this.$store.getters.cart.total,
                    reservations: JSON.stringify(this.slices)
                }
                this.$api.service ( 'reservations' ).create(res).then ( created => {
                    this.$store.dispatch('ResetCart')
                    this.$store.dispatch('SetCartTotal',0)
                    this.$store.dispatch('SetCurrentName','')
                    this.$store.dispatch('SetCurrentTime',null)
                    this.$router.push('/prenotazioni')
                })
            } else {
                this.$router.push('/prenotazioni')
            }    
        },
        saveTeglia(){
            this.teglie.push (  this.slices )
            this.teglia = false
            this.initTeglia()
        },
        initTeglia(){
            this.slices = []
            for ( var n=0 ; n < 8 ; n++ ){
                this.slices.push ( {name:'NA',price:0})
            }
        },
        initProducts(){
            this.products = this.$store.getters.products.map ( prod => {
                let product = prod
                product.sizes = [ '1' , '2' , '4' , '6' , 'TG' ]
                product.qty = '1'
                return product
            })
        }
    },
    mounted(){
       
        this.initProducts()
        this.$store.getters.cart.items.length ? this.slices = this.$store.getters.cart.items : null
        this.initTeglia()
    }
}
</script>