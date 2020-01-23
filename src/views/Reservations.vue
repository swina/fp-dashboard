<template>
    <div class="pb-20">
        <!-- topbar -->
        <div class="w-full flex flex-row items-center bg-blue-300">
            <!-- current date -->
            <div class="w-full md:w-1/3 text-2xl text-left pl-2 cursor-pointer items-center" @click="setView('selectDate')" v-if="$store.getters.currentDate" title="Cambia data">
                {{$dFormat($store.getters.currentDate)}}
                <i class="material-icons ml-2">arrow_drop_down_circle</i>
            </div>
            <!-- title -->
            <div class="w-full md:w-1/3 text-2xl text-center">Prenotazioni - &euro;{{parseFloat(total).toFixed(2)}}</div>
            <!-- views -->
            <div class="w-full md:w-1/3 text-right">
                <i class="material-icons cursor-pointer p-2" @click="setView('timing')" title="Orari">query_builder</i>
                <!--<i class="material-icons cursor-pointer p-2" @click="setView('calendar')">calendar_today</i>-->
                <i class="material-icons cursor-pointer p-2" @click="setView('list')" title="Lista">list</i>
            </div>
        </div>

        <!-- timing view -->
        <div class="flex flex-row flex-wrap justify-around" v-if="view==='timing'">
            <template v-for="(hour,index) in hrs">
                <div class="relative flex flex-col justify-center items-center border rounded m-1 py-4 px-12" :key="'hour_' + index">
                    <button class="bg-gray-100 p-2 rounded border border-gray-800 hover:bg-gray-500 text-xl font-bold cursor-pointer" @click="current=index,view='detail'">{{hour.time}}</button>
                    <button :class="'text-3xl font-bold w-20 h-20 mt-2 flex items-center justify-center rounded cursor-pointer ' + status(hour.items)" @click="current=index,modal=!modal">{{hour.items}}</button>
                </div>
            </template>
        </div>


        <!-- calendar view -->
        <div v-if="view==='calendar'">
            <vue-cal style="height:550px" 
                :events="events" 
                :disable-views="['years', 'year']"
                :time-from="17 * 60" 
                :time-to="23 * 60" 
                :time-step="15" 
                :hide-weekdays="[1]"></vue-cal>   
        </div>

        <!-- list view -->
        <div v-if="view==='list'" class="w-full">
            <template v-for="(reservation,index) in reservations">
                <div class="flex flex-row flex-wrap justify-between border-b text-left p-2" :key="'res_' + index">
                    <div class="w-8 text-xl">
                        {{reservation.id}}
                    </div>
                    <div class="w-8">
                        <!--{{reservation.date.split('-')[2]}}-{{reservation.date.split('-')[1]}} - -->
                        <span class="tagged text-xl">{{reservation.time}}</span>
                    </div>
                    <div class="flex-0">{{reservation.name}}</span></div>
                    <div class="w-3/5">
                        <template v-for="(item,i) in JSON.parse(reservation.reservations)">
                            <div :key="'line_' + index + '_' + i" class="flex flex-row flex-wrap justify-between">
                                <div class="w-3/4">{{item.name}}</div>
                                <div v-if="!parseInt(item.sale)">&euro; {{item.price}}</div>
                                <div v-if="parseInt(item.sale)" class="text-red-500">&euro; {{item.sale}}</div>
                                <div><i class="material-icons cursor-pointer" @click="removeItem(index,i,item)">delete</i></div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>

        <!-- detail view -->
        <div v-if="view==='detail'" class="w-full">
            <template v-for="(reservation,index) in reservations">
                <div v-if="reservation.time === $store.getters.currentTime" class="flex flex-row flex-wrap justify-between border-b text-left p-2" :key="'res_' + index">
                    <div class="w-1/5 text-xl">
                        {{reservation.id}}
                    </div>
                    <div class="w-1/5">
                        <!--{{reservation.date.split('-')[2]}}-{{reservation.date.split('-')[1]}} - -->
                        <span class="tagged text-xl">{{reservation.time}}</span>
                    </div>
                    <div class="w-1/5 uppercase">{{reservation.name}}</span></div>
                    <div class="w-2/5">
                        <template v-for="(item,i) in JSON.parse(reservation.reservations)">
                            <div :key="'line_' + index + '_' + i" class="flex flex-row flex-wrap justify-between">
                                <div>{{item.name}}</div>
                                <div v-if="!parseInt(item.sale)">&euro; {{item.price}}</div>
                                <div v-if="parseInt(item.sale)" class="text-red-500">&euro; {{item.sale}}</div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>

        <!-- input customer name and  create reservation modal -->
        <v-modal :modal="modal" @close="modal=!modal" :ok="$store.getters.cart.items.length" @click="addReservation">
            <div slot="header" class="p-2 bg-blue-800 text-white w-full rounded-tr rounded-tl">
                {{$dFormat($store.getters.currentDate)}} - {{$store.getters.currentTime}}
            </div>
            <div slot="content" class="flex flex-row justify-center p-8 text-center w-full">
                <div class="w-full" v-if="$store.getters.cart.items.length">
                    <input type="text" placeholder="nome" class="border rounded mt-2 p-2" v-model="currentName"/>
                </div>
                <div class="w-full" v-if="!$store.getters.cart.items.length">
                    <input type="text" placeholder="nome" class="border rounded mt-2 p-2" v-model="currentName"/>
                    <div class="text-sm">Non hai nessun preordine attivo al momento</div>
                    <button class="btn btn-blue" v-if="currentName" @click="createNewReservation">CREA ADESSO</button>
                </div>
            </div>
        </v-modal>

        <!-- change current date -->
        <div v-if="view==='selectDate'" class="w-full text-center">
            <vue-cal 
            hide-view-selector 
            :time="false" 
            style="margin:0 auto;height: 20rem;" 
            class="w-full md:w-1/4 vuecal--blue-theme" 
            default-view="month" 
            today-button
            xsmall
            @cell-click="onCellClick">
                
            </vue-cal>
        </div>

        <!-- bottom toolbar => current reservation -->
        <div class="fixed bottom-0 left-0 w-full border-t bg-blue-300 items-center flex flex-row">
            <div class="w-1/3"></div>
            <div class="w-1/3 text-right mr-2 text-xl">Prenotazione</div>
            <div class="w-1/3 text-2xl text-right flex flex-row items-center">
                <div class="w-1/2 p-2 bg-white text-black">&euro; {{$store.getters.cart.total}}</div>
                <button class="w-1/2 bg-red-700 text-white p-2 text-center" @click="$router.push('/shop')">
                    <span v-if="$store.getters.cart.items.length">Modifica</span>
                    <span v-if="!$store.getters.cart.items.length">Crea</span>
                </button>
            </div>
        </div>

    </div>
</template>
<script>

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
    name: 'Reservations',
    components: {
        VueCal
    },
    data:()=>({
        view: 'timing',     //default view
        modal: false, 
        reservations: null,
        total:0,
        current: null,
        currentName: '',    //customer name
        hrs: [],            //timing hours
        events:[]           //calendar events
    }),
    beforeMount(){
        let vm = this
        !this.$store.getters.currentDate ? this.$currentDate() : null
        this.getReservations()

    },
    watch:{
        current(i){
            this.$store.dispatch('SetCurrentTime',this.hrs[i].time)
            this.getReservations()
        },
        view(v){
            if ( v === 'calendar' ){
                var d = new Date(this.$store.getters.currentDate);
                d.setDate(d.getDate() - 8);
                this.getReservations(this.$reservationsDate(d))
            }
        }
    },
    methods:{
        getReservations(d=null){
            let vm = this
            this.total = 0
            this.$reservations(d).then ( res => {
                vm.reservations = this.$store.getters.reservations
                vm.reservations.forEach(res=>{
                    this.total += parseFloat(res.total)
                })
                this.createHours()
                this.createEvents()
            }).catch ( err => {
                console.log ( err )
            })
        },
        status(nr){
            let max = parseInt(this.$store.getters.settings.item_per_hour)

            if ( nr > max ){
                return 'bg-red-500 text-white'
            }
            if ( nr > (max * .75) ){
                return 'bg-orange-500 text-black'
            }
            if ( nr > 0 ){
                return 'bg-green-500 text-black'
            }
            return 'bg-gray-200 text-black'
        },
        getToday(d){
            let today = new Date();
            let year = today.getFullYear()
            let month = this.padDate(today.getMonth()+1)
            let day = this.padDate(today.getDate())
            this.today = year+'-'+month+'-'+day
            this.$store.dispatch('SetCurrentDate',this.today)
        },
        setView(view){
            this.view = view
        },
        onCellClick (d) {
            this.$currentDate(d)
            this.getReservations()
            this.view = 'timing'
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
            //for ( var n=0 ; n < 24 ; n++ ){
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
            }
            this.reservations.forEach(res=>{
                hours.forEach ( (hr,index) => {
                    if ( hr.date === res.date && hr.time === res.time ){
                        if ( !res.items ){
                            let reservations = {
                                name: res.name ,
                                items: JSON.parse(res.reservations)
                            }
                            hours[index].items = res.items
                            hours[index].reservations.push ( reservations )
                        } else {
                            let reservations = {
                                name: res.name ,
                                items: JSON.parse(res.reservations)
                            }
                            hours[index].items += res.items
                            hours[index].reservations.push ( reservations )
                        }
                    }
                })
            })
            this.hrs = hours
        },
        createEvents(){
            this.reservations.forEach ( res => {
                this.events.push (
                    {
                        start: res.date + ' ' + res.time.replace('.',':'),
                        end: res.date + ' ' +  (Number(res.time)+0.05).toFixed(2).toString().replace('.',':') ,
                        title: res.name,
                        content: res.items,
                        class: 'reservation'
                    }
                )
            })
        },
        addReservation(){
            console.log ( 'create reservation ...')
            let res = this.hrs[this.current]
            res.items = this.$store.getters.cart.items.length
            res.reservations = this.$store.getters.cart.items
            res.name = this.currentName
            this.$api.service ( 'reservations' ).create({
                date: res.date,
                time: res.time,
                name: res.name,
                items: res.items,
                reservations: JSON.stringify(res.reservations)
            }).then ( created => {
                this.$store.dispatch('ResetCart')
                this.$store.dispatch('SetCartTotal',0)
                this.modal =! this.modal
                console.log ( created )
            })
        },
        createNewReservation(){
            //this.$store.dispatch('SetCurrentTime',this.hrs[this.current].time)
            this.$store.dispatch('SetCurrentName',this.currentName)
            this.$router.push('shop')
        },
        removeItem(index,i,item){
            console.log ( index , i )
            let r = this.reservations[index]
            let reservations = JSON.parse(r.reservations)
            reservations.splice(i,1)
            this.reservations[index].items--
            this.reservations[index].reservations = JSON.stringify(reservations)
            let res = this.reservations[index]
            let price = 0
            parseInt(item.sale) ? price = item.sale : price = item.price  
            res.total = (parseFloat(res.total) - parseFloat(price)).toFixed(2)
            let id = res.id 
            delete res.id
            this.$api.service('reservations').patch(id , res ).then ( patched => {
                console.log ( 'reservation patched' )
                this.getReservations()
            })
            //this.reservations = reservations
            //console.log ( this.hrs[this.current].reservations[i] )
            //this.hrs[h].reservations.splice(i,1)
        }
    }
}
</script>