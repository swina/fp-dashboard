<template>
<div class="w-full flex flex-col md:flex-row flex-wrap pb-20">
        <div class="w-full flex flex-row justify-end p-2">
            <span title="Lista" @click="view='list'"><i class="material-icons fab">list</i></span>
            <span title="Foto" class="ml-2" @click="view='photo'"><i class="material-icons fab">image</i></span>
        </div>    
    <div class="w-full md:w-1/2 p-2">
        <div class="w-full flex flex-row items-center justify-between">
            <i class="material-icons fab" @click="nextPage(0)">keyboard_arrow_left</i>
            <div class="text-xl font-bold">Listino</div>
            <i class="material-icons fab" @click="nextPage(1)">keyboard_arrow_right</i>
        </div>
        <draggable :list="products" :group="{ name: 'gusti', pull: 'clone', put: false }" class="flex flex-row flex-wrap">
            <template  v-for="(product,index) in products">
                <transition name="collapse">
                <div v-if="index > startIndex && index < (startIndex+10)" :class="'hover:bg-gray-300 cursor-move flex ' + layout" :key="'product_' + index" :title="product.name">
                    <div v-if="view==='photo'" class="w-32 h-32 m-2">
                        <img :src="product.image" class="h-32 w-32"/>
                    </div>
                    <div>
                        <span v-if="view==='photo'">{{product.name.substring(0,20)}}</span>
                        <span v-if="view==='list'">{{product.name}}</span>
                    </div>
                    <div v-if="!parseInt(product.sale)">&euro; {{product.price}}</div>
                    <div v-if="parseInt(product.sale)" class="text-red-500">&euro; {{product.sale}}</div>
                </div>
                </transition>
            </template>
        </draggable>

    </div>
    <div class="w-full md:w-1/2 p-2 border-l-4 border-dashed">
        <div class="text-xl font-bold">Ordine</div>
        <draggable :list="slices" group="gusti" class="flex flex-row flex-wrap" @change="log">
             <template v-for="(slice,index) in slices">
                
                <div :key="'slice_' + index" :class="'cursor-move items-center relative flex ' + layout">
                    <div v-if="view==='photo'" class="w-32 h-32 m-1">
                        <img v-if="slice" :src="slice.image" class="h-32 w-32"/>
                    </div>
                    <div v-if="slice" :class="listCol"><span>{{slice.name}}</span></div>
                    <div v-if="slice && !parseInt(slice.sale)"><span class="tagged">&euro; {{slice.price}}</span></div>
                    <div v-if="slice && parseInt(slice.sale)"><span class="tagged text-red-500">&euro; {{slice.sale}}</span></div>
                    <i v-if="slice" :class="'material-icons fab ' + iconLayout" @click="slices.splice(index,1)">delete</i>
                </div>
                
            </template>
        </draggable>
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
            <button class="w-1/2 bg-red-700 text-white p-2 text-center" @click="createCart">Prenota</button>
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
        startIndex: 0,
        endIndex: 10,
        products:[],
        slices:[null],
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
        }
    },
    methods:{
        nextPage(flag){
            if ( !flag ) {
                this.startIndex > 0 ? this.startIndex = this.startIndex-10 : this.startIndex = 0
            }
            if ( flag ){
                this.startIndex + 10 < this.products.length ? this.startIndex = this.startIndex+10 : null
            }
        },
        log(evt){
            //this.slices.pop()
        },
        getImage(i){
            let slice = this.slices[i]//this.$store.getters.slices[i]
            return slice ? 'background:url(' + slice.image + '); background-size:cover;' : ''
        },
        createCart(){
            let vm = this
            this.slices.forEach((slice,index)=>{
                !slice ? this.slices.splice(index,1) : null
            })
            this.$store.dispatch('CreateCart',this.slices)
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
        }
    },
    mounted(){
        this.products = this.$store.getters.products
        this.$store.getters.cart.items.length ? this.slices = this.$store.getters.cart.items : null
    }
}
</script>