<template>
    <div class="pb-8">
        <!-- timing view -->
        <div class="flex flex-row flex-wrap justify-around" v-if="view==='timing' && hrs">
            <template v-for="(hour,index) in hrs">
                <div class="relative flex flex-col justify-center items-center border rounded m-1 py-4 px-12" :key="'hour_' + index">
                    <button class="bg-gray-100 p-2 rounded border border-gray-800 hover:bg-gray-500 text-xl font-bold cursor-pointer text-black" @click="current=index,view='detail'">{{hour.time}}</button>
                    <button :class="'text-3xl font-bold w-20 h-20 mt-2 flex items-center justify-center rounded cursor-pointer ' + $hourStatus(hour.items)" @click="current=index,modal=!modal">{{hour.items}}</button>
                    <div class="flex flex-row justify-around mt-1 cursor-pointer" @click="reservationDetail(index)">
                        <template v-for="(tipo,index) in resQty(index)">
                            <span :key="'tipo_' + index" :class="type[index].bg + ' px-2 mr-2 rounded'" :title="type[index].title">{{tipo}}</span>
                        </template>
                    </div>
                </div>
            </template>
        </div>

        <!-- input customer name and  create reservation modal -->
        
        <v-uiModal :modal="modal" v-if="hrs" @close="modal=!modal" @click="savePrenotazione">
            <div slot="header" class="p-2 bg-blue-800 text-white w-full rounded-tr rounded-tl">
                {{$dFormat($store.getters.currentDate)}} - {{hrs[current].time}}
            </div>
            <div slot="content" class="flex flex-row justify-center p-8 text-center w-full">
                <div class="w-full" v-if="$store.getters.cart.items.length">
                    <input type="text" placeholder="nome" class="border rounded mt-2 p-2" v-model="currentName"/>
                </div>
                <div class="w-full flex flex-col">
                    <p class="text-left">Cliente</p>
                    <input type="text" placeholder="nome" class="border rounded my-2 p-2" v-model="currentName"/>
                    <div v-if="isCart" class="flex flex-col p-2 text-left">
                        <template v-for="(type,index) in Object.keys(cart)">
                            <div :key="'type_' + index" class="mb-4 flex flex-row justify-around">
                                <div class="uppercase">{{type}}</div>
                                <div class="ml-2 px-4 py-2 bg-red-700 text-white">{{cart[type].length}}</div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </v-uiModal>
        
        <div class="fixed top-0 right-0 bg-gray-300 p-2 z-1 h-screen w-full md:w-1/3" v-if="res" @click="res=null">
            <template v-for="(tipo,index) in Object.keys(res)">
                <div class="flex flex-col text-left">
                    <div class="font-bold uppercase tagged">{{tipo}}</div>
                    <template v-for="(gusto,i) in res[tipo]">
                        <div v-if="gusto.length" class="flex flex-row flex-wrap">
                            <template v-for="(g,n) in gusto">
                                <div class="w-1/2 text-centr text-sm p-1 border border-black bg-white">{{g.name}}</div>
                            </template>
                        </div>
                        <div v-if="!gusto.length">
                            1. {{gusto.name}}
                        </div>
                    </template>
                </div>
            </template>
        </div>

        <div v-if="isCart" class="fixed bottom-0 left-0 w-full p-1 text-white">
            <div class="w-1/2 blinking m-auto p-1 flex flex-row items-center justify-between text-center rounded-lg">
                <div class="text-center m-auto">
                Hai una prenotazione da completare. Seleziona l'ora o il giorno e l'ora. 
                </div>
                <div><i class="material-icons fab bg-white text-black" title="Clicca per eliminarla">delete</i></div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'Prenotazioni',
    data:()=>({
        reservations: null,
        type: [ { bg: 'bg-orange-500' , title: 'Teglie' }, { bg: 'bg-indigo-400' , title: 'Tonde' } , { bg: 'bg-gray-400' , title: 'Tranci'} ],
        res: null,
        cart: null,
        isCart: false,
        hrs: null,
        view: 'timing',
        current: 0,
        index: null,
        modal: false,
        currentName: ''

    }),
    beforeMount(){
        let vm = this
        !this.$store.getters.currentDate ? this.$currentDate() : null
        this.getCart()
        this.getReservations()
    },

    watch:{
        cart(obj){
            if ( obj.teglie.length || obj.tonde.length || obj.tranci.length ){
               return this.isCart = true 
            }
            return this.isCart = false
        }
    },
    methods:{
        resQty(index){
            let res = this.reservations[index]
            if ( res ){
                let detail = JSON.parse(res.reservations)
                console.log ( detail )
                return [ detail.teglie.length , detail.tonde.length , detail.tranci.length ]
            }
        },
        reservationDetail(index){
            this.res = JSON.parse(this.reservations[index].reservations)
        },
        createHours(){
            let vm = this
            let hour = parseInt(this.$store.getters.settings.start_time)*100
            let end_time = parseInt(this.$store.getters.settings.end_time)*100
            let hours = [{
                date: vm.$store.getters.currentDate,
                time: (hour/100).toFixed(2),
                items: 0 ,
                name: '',
                reservations:[]
            }]
            let multiplier = 0
            let counter = (end_time - hour)/25
            for ( var n = 0 ; n < counter ; n++ ){
                if ( multiplier > 2 ){
                    multiplier = 0
                    hour += 55
                } else {
                    hour += 15
                    multiplier++
                }
                let time = hour/100
                hours.push ( 
                    {
                        date: vm.$store.getters.currentDate,
                        time: time.toFixed(2),
                        items: 0 ,
                        name: '',
                        reservations:[]
                    }
                )
                this.reservations.forEach ( res => {
                    hours.forEach ( (hour,index) => {
                        let reservation = {
                            name: res.name ,
                            reservations: res.reservation
                        }
                        if ( res.time === hour.time ) {
                            hours[index].items = res.items
                            hours[index].reservations.push ( reservation )
                        }
                    })
                })
                this.hrs = hours
            }
        },
        getReservations(d=null){
            let vm = this
            this.total = 0
            this.$reservations(d).then ( res => {
                console.log ( res )
                vm.reservations = this.$store.getters.reservations
                vm.reservations.forEach(res=>{
                    this.total += parseFloat(res.total)
                })
                this.createHours()
            }).catch ( err => {
                console.log ( err )
            })
        },
        getCart(){
            this.cart = this.$store.getters.cart.items
        },
        savePrenotazione(){
            if ( !this.cart.teglie.length && !this.cart.tonde.length && !this.cart.tranci.length ){
                this.$router.push('shop') 
            } else {
                let res = this.hrs[this.current]
                res.items = this.$store.getters.cart.items.teglie.length*8 + this.$store.getters.cart.items.tonde.length + this.$store.getters.cart.items.tranci.length
                res.reservations = this.$store.getters.cart.items
                res.name = this.currentName
                let items = this.$store.getters.cart
                this.$api.service ( 'reservations' ).create({
                    date: res.date,
                    time: res.time,
                    name: res.name,
                    items: res.items,
                    reservations: JSON.stringify(res.reservations)
                }).then ( created => {
                    this.$store.dispatch('ResetCart')
                    this.$store.dispatch('SetCartTotal',0)
                    this.getCart()
                    this.modal =! false
                    console.log ( created )
                    this.cart = null
                })
            }
        }
    }
}
</script>