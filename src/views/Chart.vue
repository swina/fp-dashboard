<template>
    <div class="w-full flex flex-col">
          <div class="w-full flex flex-row items-center bg-blue-300">
            <!-- current date -->
            <div class="w-full md:w-1/3 text-2xl text-left pl-2 cursor-pointer items-center" v-if="$store.getters.currentDate" title="Cambia data">
                <span class="text-sm">Periodo dal {{$dFormat($dateFormat(from))}} al {{$dFormat($dateFormat(to))}}</span>
            </div>
            <!-- title -->
            <div class="w-full md:w-1/3 text-2xl text-center">Analisi Ordini</div>
            <!-- views -->
            <div class="w-full md:w-1/3 text-right">
                
                <i class="material-icons cursor-pointer p-2" @click="setView('calendar')" title="Cambia periodo">calendar_today</i>
            </div>
        </div>

        <div :style="style" class="w-full flex flex-col text-center m-auto py-10">
            <div class="text-md"><span class="tagged">Venduto (pezzi)</span></div>
            <div id="chart_0" serial="chart_0" class="chart_0 m-auto px-8"></div>
            
            <div class="text-md"><span class="tagged">Venduto (&euro;)</span></div>
            <div id="chart_1" serial="chart_1" class="chart_1 m-auto  px-8"></div>

            <div class="text-md"><span class="tagged">Prodotti Venduti</span></div>
            <div id="chart_2" serial="chart_2" class="chart_2 m-auto  px-8"></div>

            <div v-if="sortedProducts" class="w-3/4 m-auto border p-4">
                <template v-for="(product,index) in sortedProducts">
                    <div :key="'line_' + index" class="w-full border-b flex flex-row justify-start text-left">
                        <div class="w-3/4">{{product.name}}</div>
                        <div class="">{{product.tot}}</div>
                    </div>
                </template>
            </div>
        </div>

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
</template>

<script>
import 'rockiot-ui/build/rockiot.ui.min'
import '../plugins/rockiot.chart'

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
    name: 'Analysis',
    components: {
        VueCal
    },
    data:()=>({
        view: 'chart',
        items:[],
        from: new Date(),
        to: new Date(),
        chart: null,
        chartData:{
            data: [],
            labels: [],
            options: {
                width: '900px',
                height: '300px',
                low: 0,
                fullWidth: true,
                axisY: {
                    onlyInteger: true,
                    offset: 10
                },
                divisor: 4,
                chartPadding: {
                    right: 20,
                    left: 40
                },
                showArea: false,
                showLine: true,
                showPoint: true,
            }
        },
        sortedProducts: null
    }),
    computed:{
        style(){
            return this.view != 'chart' ? 'display:none;' : ''
        }
    },
    beforeMount(){
        let d = new Date()
        d.setDate( d.getDate()-7 )
        this.from = d
        this.getOrders()
       
    },
    methods:{
        setView(v){
            this.view = v
            this.chart = null
        },
        dateFrom (d) {
            this.from = d
        },
        dateTo (d) {
            this.to = d
        },
        getOrders(){
            this.$ordersByPeriod(this.from,this.to,1).then ( resp => {
            
                this.items = resp.data.map ( order => { return order.items })
                this.serie_1 = this.$arrayGroup ( resp.data , 'date' , 'items' )
                this.serie_1.keys.push(null)
                this.serie_1.sums.push(null)

                this.serie_2 = this.$arrayGroup ( resp.data , 'date' , 'total' )
                this.serie_2.keys.push(null)
                this.serie_2.sums.push(null)


                this.labels = resp.data.map ( order => { return order.date.split('-')[2] })
                
                new Rockiotchart.Line ( '.chart_0', {
                    labels: this.serie_1.keys.map((label,index)=>{ 
                        if ( label ) { 
                            return this.$dayFormat(label) + ' (' + this.serie_1.sums[index] + ')'
                        } else { 
                            return ''
                        }
                    }),
                    series: [
                        this.serie_1.sums
                    ]
                },this.chartData.options)
                this.chartData.options.showArea = true
                this.chartData.options.showPoint = false
                new Rockiotchart.Bar ( '.chart_1', {
                    labels: this.serie_2.keys.map((label,index)=>{ 
                        if ( label ) { 
                            return this.$dayFormat(label) + ' (' + this.serie_2.sums[index] + ')'
                        } else { 
                            return ''
                        }
                    }),
                    series: [
                        this.serie_2.sums
                    ]
                },this.chartData.options)

                
                this.serie_3 = this.serializeProducts(resp.data)
                this.sortedProducts = this.serie_3.sums.map ((summ,index)=>{
                    return {
                        tot: parseInt(summ) , 
                        name: this.serie_3.keys[index] 
                    }
                })


                this.sortedProducts = this.sortedProducts.sort( (a,b) => parseInt(a.tot) < parseInt(b.tot) ? 1 : -1 ) 
                new Rockiotchart.Bar ( '.chart_2', {
                    labels: this.sortedProducts.map(a=>{return a.name.substring(0,5)}),
                    series: [
                        this.sortedProducts.map(a=>{return a.tot})
                    ]
                },this.chartData.options)
                this.view = 'chart'
            })
        },
        serializeProducts(data){
            let products = data.map ( order => {
                return JSON.parse(order.reservations)
            })
            products = products.reduce ( (a,b) => a.concat(b) , [] )
            products = this.$arrayGroup ( products , 'name' , 'active' ) 
            return products
        }
    }
}
</script>
