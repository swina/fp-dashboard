<template>
    <draggable :list="slices" group="gusti" class="flex flex-row flex-wrap min-h-full shadow bg-gray-300 border-4 border-black border-dashed text-black" @change="change">
        
        <template v-for="(slice,index) in slices">
            <div :key="'slice_' + index" :class="'relative w-1/2 h-20 border-r border-b border-dashed border-black flex text-center m-auto items-center px-6 '">
                <div v-if="!slices.length" class="text-center w-full">{{index}}</div>
                <div v-if="slices.length" class="w-full text-center">{{slices[index].name}}</div>
                <div class="absolute bottom-0 right-0"><i v-if="slices.length" class="material-icons fab" @click="slices.splice(index,1),teglia=false">delete</i></div>
            </div>

        </template>
        <div class="w-full p-2 flex flex-row text-sm">
            <div class="w-1/3" v-if="gusti===1"><button class="btn btn-blue" @click="gustoUnico">GUSTO UNICO</button></div>
            <div class="w-1/3" v-if="gusti">GUSTI <span class="fab w-10 bg-red-600 text-white px-3">{{gusti}}</span></div>
            <div class="w-1/3"><button class="btn btn-blue" v-if="teglia" @click="saveTeglia">Salva Teglia</button></div>
        </div>
        <div v-if="$store.getters.cart.items.teglie" class="w-full flex flex-row p-2">
            <template v-for="(tg,index) in $store.getters.cart.items.teglie">
                <div :key="'tg_' + index" @click="slices=tg.teglia,mode=index" :class="'fab w-10 mr-2 ' + bgTeglia(index)">{{index+1}}</div>
            </template>
            <button class="btn btn-blue text-sm">Nuova</button>
        </div>
    </draggable>
    
</template>

<script>
import draggable from 'vuedraggable'
export default {
    name: 'Teglia',
    components: {
        draggable
    },
    data:()=>({
        cart:null,
        gusti:0,
        slices:[],
        teglia: false,
        teglie:[],
        mode: -1
    }),
    beforeMount(){
        this.initTeglia()
    },
    watch:{
      
        slices(array){
            array = array.filter ( a => {
                return a.name != 'NA'
            })
            let gusti = this.$arrayGroup ( array , 'name' , 'qty' )
            this.gusti = gusti.keys.length
            array.length === 8 ? this.teglia = true : this.teglia = false
        }
    },
    methods:{

        change(evt){
            evt.moved ? this.slices.push ( evt.added.element ) : this.slices.pop()
        },
        gustoUnico(){
            let slice = this.slices.filter ( slice => { return slice.name != 'NA' })
            let slices = []
            for ( var n=0 ; n < 8 ; n++ ){
                slices.push(slice[0])
            }
            this.slices = slices
        },
        bgTeglia(index){
            return this.mode === index ? 'bg-red-500' : 'bg-blue-400' 
        },
        getTeglia(index){
            console.log ( this.$store.getters.cart.items.teglie[index].teglia )
            //this.slices =  this.$store.getters.cart.items.teglie[index].teglia
        },
        initTeglia(gusto){
            //this.teglie = this.$store.getters.cart.items.teglie
            gusto = gusto || 'NA'
            for ( var n=0 ; n < 8 ; n++ ){
                this.slices[n] = {
                    name: 'NA',
                    qty: 1
                }
            }
        },
        saveTeglia(){
            if ( this.mode < 0 ){
                this.cart.teglie.push ( { teglia : this.slices } )
            } else {
                this.cart.teglie[this.mode] = { teglia: this.slices }
            }
            this.$store.dispatch('CreateCart',this.cart)
            //this.initTeglia()
            this.gusti = 0
            this.teglia = false
            console.log ( this.$store.getters.cart.items.teglie )
        }
    },
    mounted(){
        this.cart = this.$store.getters.cart.items
        //this.initTeglia()
    }
}
</script>