<template>
    <div>
        <div class="w-full flex flex-row items-center bg-blue-300">
            <div class="w-full md:w-1/3 text-2xl text-left pl-2 cursor-pointer items-center" @click="setView('selectDate')" v-if="$store.getters.currentDate">
                {{$dFormat($store.getters.currentDate)}}
                
                <i class="material-icons ml-2">arrow_drop_down_circle</i>
            </div>
            <div class="w-full md:w-1/3 text-2xl text-center">Prenotazioni</div>
            <div class="w-full md:w-1/3 text-right">
                <i class="material-icons cursor-pointer p-2" @click="setView('timing')">timer</i>
                <i class="material-icons cursor-pointer p-2" @click="setView('calendar')">calendar_today</i>
                <i class="material-icons cursor-pointer p-2" @click="setView('list')">list</i>
            </div>
        </div>
        <div class="flex flex-row flex-wrap justify-around" v-if="view==='timing'">
            <template v-for="(hour,index) in hrs">
                <div class="relative flex flex-col justify-center items-center border rounded m-1 py-4 px-12" :key="'hour_' + index">
                    <button class="bg-gray-100 p-2 rounded border border-gray-800 hover:bg-gray-500 text-xl font-bold cursor-pointer" @click="current=index,detail=!detail">{{hour.time}}</button>
                    <button :class="'text-3xl font-bold w-20 h-20 mt-2 flex items-center justify-center rounded cursor-pointer ' + status(hour.items)" @click="current=index,modal=!modal">{{hour.items}}</button>
                </div>
            </template>
        </div>
        <div v-if="view==='list'">
            <template v-for="(hour,index) in hrs">
                <div :key="'line_' + index" v-if="hour.items">
                    
                    <template v-for="(reservation,i) in hour.reservations">
                        <div :key="'res_' + i"  class="w-full flex flex-row justify-between items-center border-b text-left p-2">
                            <div class="w-1/2 text-left px-4 font-bold">{{hour.time}}</div>
                            <div class="w-1/3 text-left px-4 uppercase">{{reservation.name}}</div>
                            <div class="w-1/3 text-left px-4">{{reservation.qty}}</div>
                        </div>
                    </template>
                </div>
            </template>
        </div>
        <div v-if="view==='calendar'">
            <vue-cal style="height:550px" 
                :events="calEvents" 
                :disable-views="['years', 'year']"
                :time-from="17 * 60" 
                :time-to="23 * 60" 
                :time-step="5" 
                :hide-weekdays="[1]"></vue-cal>   
        </div>
        <v-modal :modal="modal" @close="modal=!modal" @click="createReservation">
            <div slot="content" class="flex flex-row justify-center p-8 text-center w-full">
                <div class="w-full">
                    <input type="text" placeholder="nome" class="border rounded mt-2 p-2" v-model="currentName"/>
                    
                </div>
            </div>
        </v-modal>
        <div v-if="view==='slices'">
            <v-slices/>
        </div>

        <div class="fixed bg-gray-200 right-0 top-0 h-screen w-full bg-white border-l md:w-1/4" v-if="detail && hrs">
            <p>{{$dFormat($store.getters.currentDate)}}</p>
            <p class="text-xl uppercase">Prenotazioni ore {{hrs[current].time}}</p>
            <template v-for="(reservation,index) in hrs[current].reservations">
                <div :key="'row_' + index" class="flex flex-row justify-between items-center border-b p-2 m-2">
                    <div class="w-2/3 text-left">{{reservation.name}}</div>
                    <div class="w-1/3">{{reservation.qty}}</div>
                    <div class="w-1/3 bg-red-700 text-white"><i class="material-icons cursor-pointer">delete</i></div>
                </div>
            </template>
            <button class="absolute bottom-0 right-0 text-xs bg-gray-500 m-1 p-2 border rounded" @click="detail=!detail">Chiudi</button>
        </div>
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
    name: 'Dashboard',
    components: {
        VueCal
    },
    data:()=>({
        workDate: null,
        hrs: null,
        xHour: 10,
        reservations:null,
        modal: false,
        slices: false,
        current:null,
        stepper:null,
        slices:[null,null,null,null,null,null,null,null],
        currentName:'',
        detail: false,
        today: null,
        list: false,
        calendar: false,
        events: [],
        view: 'timing'
    }),
    computed:{
        calEvents(){
            return this.events
        }
    },
    methods: {
        setView(view){
            this.view = view
        },
        createReservation(){
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
                console.log ( created )
            })
        },
        addQty(nr){
            this.stepper = nr
        },
        addSlice(slice){
            this.slices[this.$store.getters.currentSlice] = slice
            this.$store.dispatch('SetSlices',this.slices)
        },
    
        addItems(){
            let vm = this
            this.hrs[this.current].items += this.stepper
            this.hrs[this.current].reservations.push (
                { 
                    name: this.currentName ,
                    qty: this.stepper 
                }
            )
            this.currentName = ''
            let line = this.hrs[this.current]
            this.$api.service('reservations').find ( {
                query : {
                    date: vm.today,
                    time: line.time
                }
            }).then ( resp=> {
                if ( resp.total ){
                    let id = resp.data[0].id

                    this.$api.service ( 'reservations' ).patch(id,{
                        reservations: JSON.stringify(line.reservations),
                        items: line.items
                    }).then ( updated => {
                        console.log ( updated )
                    })
                } else {
                    this.$api.service ( 'reservations' ).create({
                        date: vm.today,
                        time: line.time,
                        items: line.items,
                        reservations: JSON.stringify(line.reservations)
                    }).then ( created => {
                        console.log ( 'created=>' , created )
                    })
                }
            })
            this.modal = !this.modal
            this.stepper = 0
        },
        status(nr){
            
            if ( nr === 10 ){
                return 'bg-red-500 text-white'
            }
            if ( nr > 5 ){
                return 'bg-orange-500 text-black'
            }
            if ( nr > 0 ){
                return 'bg-green-500 text-black'
            }
            return 'bg-gray-200 text-black'
        },
        addReservation(i){
            this.hrs[i].items++
        },
        removeReservation(i){
            this.hrs[i].items > 0 ? this.hrs[i].items-- : null
        },
         getImage(i){
            let slice = this.$store.getters.slices[i]
            return slice ? 'background:url(' + slice.image + '); background-size:cover;' : ''
        },
        getSlice(slice){
            return slice ? slice.name : ''
        },
        selectedSlice(i){
            return i === this.$store.getters.currentSlice ? 'border-4 border-red-700' : 'border'
        },
        getHours(){
            let vm = this
            let hour = 1700
            let hours = []
            let multiplier = 0
            
            for ( var n=0 ; n <24 ; n++ ){
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
                        reservations:[]
                    }
                )
               
            }
            this.hrs = hours
            
            /*

            this.$api.service('reservations').find({
                query: {
                    date: vm.today,
                    $limit: 100
                }
            }).then ( resp => {
                if ( !resp.total ){
                    hours.forEach ( hr => {
                        this.$api.service('reservations').create( {
                            date: vm.today,
                            time: hr.time,
                            items: hr.items,
                            reservations: ''
                        }).then ( resp => {
                            console.log ( resp )
                        })
                    })
                } else {
                    vm.importData(resp.data)
                }
            })
            */
        },
        getToday(d){
            let today = new Date();
            let year = today.getFullYear()
            let month = this.padDate(today.getMonth()+1)
            let day = this.padDate(today.getDate())
            this.today = year+'-'+month+'-'+day
            this.$store.dispatch('SetCurrentDate',this.today)
        },
        importData(data){
            this.hrs = []
            data.forEach ( hour => {
                let resJSON = []
                hour.reservations ? resJSON = JSON.parse(hour.reservations) : null
                this.hrs.push ( 
                    {
                        date: hour.date,
                        time: hour.time,
                        items: hour.items,
                        reservations: resJSON
                    }
                )
                if ( hour.items ){
                    resJSON.forEach ( res => {
                        console.log ( res )
                        this.events.push (
                            {
                                start: hour.date + ' ' + hour.time.replace('.',':'),
                                end: hour.date + ' ' +  (Number(hour.time)+0.05).toFixed(2).toString().replace('.',':') ,
                                title: res.name,
                                content: res.qty,
                                class: 'reservation'
                            }
                        )
                    })
                
                }
            })
        },
        calendarEvents(data){
            this.events = []
            data.forEach ( hour => {
                this.events.push (
                            {
                                start: hour.date + ' ' + hour.time.replace('.',':'),
                                end: hour.date + ' ' +  (Number(hour.time)+0.05).toFixed(2).toString().replace('.',':') ,
                                title: hour.name,
                                content: hour.items,
                                class: 'reservation'
                            }
                        )
                /*        
                let resJSON = []
                hour.reservations ? resJSON = JSON.parse(hour.reservations) : null
                if ( hour.items ){
                    resJSON.forEach ( res => {
                        console.log ( res )
                        this.events.push (
                            {
                                start: hour.date + ' ' + hour.time.replace('.',':'),
                                end: hour.date + ' ' +  (Number(hour.time)+0.05).toFixed(2).toString().replace('.',':') ,
                                title: res.name,
                                content: res.qty,
                                class: 'reservation'
                            }
                        )
                    })
                
                }
                */
            })
        },
        padDate(num){
            if ( num < 10 ){
                return '0' + num
            } else {
                return num
            }
        },
        onCellClick (d) {
            this.$currentDate(d)
            this.initDashboard()
            
        },
        initDashboard(){
            let vm = this
            this.getHours()
            this.$api.service('reservations').find({
                query: {
                    items : {
                        $gt: 0
                    },
                    $limit: 200
                }
            }).then(resp=>{
                vm.calendarEvents(resp.data)
                resp.data.forEach ( res => {
                    vm.hrs.forEach ( (hr,index) => {
                        if ( res.date === hr.date && res.time === hr.time ){
                            vm.hrs[index] = {
                                date: res.date,
                                time: res.time,
                                items: res.items,
                                reservations: JSON.parse(res.reservations)
                            }
                        }
                    })
                })
                this.view = 'timing'
                console.log ( vm.hrs )
                //console.log ( 'events=>' , resp)
            })
        }
    },
    beforeMount(){
        let vm = this
        this.getToday()
        this.initDashboard()
    }
}
</script>
<style>
.reservation {
    min-height: 2rem;
}
.reservation > div {
    font-size: .7rem;
}
.reservation > .vuecal__event-time {
    display: none;
}
</style>