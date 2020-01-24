<template>
    <div class="w-full">
        <div class="w-full flex flex-row items-center bg-blue-300">
            <!-- current date -->
            <div class="w-full md:w-1/3 text-2xl text-left pl-2 cursor-pointer items-center" @click="setView('selectDate')" v-if="$store.getters.currentDate" title="Cambia data">
                <span class="text-sm">Periodo dal {{$dFormat($dateFormat(from))}} al {{$dFormat($dateFormat(to))}}</span>
            </div>
            <!-- title -->
            <div class="w-full md:w-1/3 text-2xl text-center">Ordini - &euro; {{parseFloat(total).toFixed(2)}}</div>
            <!-- views -->
            <div class="w-full md:w-1/3 text-right">
                
                <i class="material-icons cursor-pointer p-2" @click="setView('calendar')" title="Cambia periodo">calendar_today</i>
            </div>
        </div>

        <template v-for="(order,index) in $store.getters.orders">
            <div v-if="view==='list'" class="flex flex-row flex-wrap justify-between border-b text-left p-2" :key="'res_' + index">
                <div class="w-full bg-gray-400 p-2 mb-1">{{order.date.split('-')[2]}} {{$store.getters.months[parseInt(order.date.split('-')[1])]}} {{order.date.split('-')[0]}}</div>
                <div class="w-8 text-xl">
                    {{order.id}}
                </div>
                <div class="flex-0">
                    <span class="">{{order.time}}</span>
                </div>
                <div class="flex-0">{{order.name}}</span></div>
                <div class="w-3/5">
                    <template v-for="(item,i) in JSON.parse(order.reservations)">
                        <div :key="'line_' + index + '_' + i" class="flex flex-row flex-wrap justify-between">
                            <div class="w-3/4">{{item.name}}</div>
                            <div v-if="!parseInt(item.sale)">&euro; {{item.price}}</div>
                            <div v-if="parseInt(item.sale)" class="text-red-500">&euro; {{item.sale}}</div>
                            
                        </div>
                    </template>
                </div>
            </div>
        </template>

        
        <div v-if="view==='calendar'" class="w-full flex flex-col text-center">

            <div class="w-full md:w-1/2 m-auto flex flex-row text-center justify-between">

                <vue-cal 
                hide-view-selector 
                :time="false" 
                style="height: 20rem;" 
                class="w-full m-4 md:w-1/4 vuecal--blue-theme" 
                default-view="month" 
                today-button
                xsmall
                @cell-click="dateFrom">
                </vue-cal>

                <vue-cal 
                hide-view-selector 
                :time="false" 
                style="height: 20rem;" 
                class="w-full m-4 md:w-1/4 vuecal--blue-theme" 
                default-view="month" 
                today-button
                xsmall
                @cell-click="dateTo">
                </vue-cal>
            </div>
            <div class="w-full flex flex-col">
                <div>
                    <button class="btn-blue" @click="getOrders">Vedi ordini</button>
                </div>
                <div>
                    <span v-if="from">{{$dFormat($dateFormat(new Date(from)))}}</span> 
                    <span v-if="to">- {{$dFormat($dateFormat(new Date(to)))}}</span>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
    name: 'Orders',
    components:{
        VueCal
    },
    data:()=>({
        view: 'list',
        from: null,
        to: new Date(),
        groupDay:null,
        orders: []
    }),
    computed:{
        
        total(){
            let tot = 0
            if ( this.orders ){
                this.orders.forEach(res=>{
                    tot += parseFloat(res.total)
                })
            }
            return tot
        }
    },
    methods:{
        setView(v){
            this.view = v
        },
        dateFrom (d) {
            this.from = d
        },
        dateTo (d) {
            this.to = d
        },
        day(date){
            
            if ( this.groupDay != date ){
                this.groupDay = date
                return date
            }
            return ''
        },
        ordersLastWeek(){
            let d = new Date()
            d.setDate(d.getDate()-7)
            console.log ( d )
            this.$orders(d)
            this.orders = this.$store.getters.orders
        },
        getOrders(){
            this.$ordersByPeriod ( this.from , this.to , 1 )
            this.orders = this.$store.getters.orders
            this.view = 'list'
        }
    },
    beforeMount(){
        let d = new Date()
        d.setDate( d.getDate()-7 )
        this.from = d
        this.$ordersByPeriod(this.from,this.to,1)
        this.orders = this.$store.getters.orders
        //this.orders = this.$store.getters.orders
    },
    mounted(){
    }
}
</script>