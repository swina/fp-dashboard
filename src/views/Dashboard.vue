<template>
    <div class="p-4 w-full flex flex-col flex-wrap ">
        <div class="w-full flex flex-row items-center mt-10 mb-8 cursor-pointer text-white">
            <div class="icon-box hover:bg-red-500" @click="$router.push('prenotazioni')">
                <i class="material-icons m-auto text-5xl" title="Prenotazioni">query_builder</i>
                <div class="text-xs">Prenotazioni</div>
            </div>
            <div class="icon-box hover:bg-red-500" @click="$router.push('shop')">
                <i class="material-icons m-auto text-5xl" title="Listino">assignment</i>
                <div class="text-xs">Crea Ordine</div>
            </div>
            <div class="icon-box hover:bg-red-500" @click="$router.push('ordini')">
                <i class="material-icons m-auto text-5xl" title="Gestione Prodotti">dynamic_feed</i>
                <div class="text-xs">Ordini</div>
            </div>
            <div class="icon-box hover:bg-red-500" @click="$router.push('prodotti')">
                <i class="material-icons m-auto text-5xl" title="Gestione Prodotti">view_list</i>
                <div class="text-xs">Listino</div>
            </div>
             <div class="icon-box hover:bg-red-500" @click="$router.push('analisi')">
                <i class="material-icons m-auto text-5xl" title="Analisi">bar_chart</i>
                <div class="text-xs">Analisi</div>
            </div>
            <div class="icon-box hover:bg-red-500" @click="$router.push('impostazioni')">
                <i class="material-icons m-auto text-5xl" title="Impostazioni">settings_applications</i>
                <div class="text-xs">Impostazioni</div>
            </div>
        </div>
        <div class="w-full flex flex-row">
            <div class="w-full md:w-1/2 mt-10" v-if="reservations">
                <div class="text-md pb-4"><span class="tagged">Prenotazioni <span v-if="$store.getters.currentDate">{{$dFormat($store.getters.currentDate)}}</span></span></div>
                <template v-for="(reservation,index) in $store.getters.reservations">
                    <div class="flex flex-row flex-wrap justify-between border-b text-left p-2" :key="'res_' + index">
                            <div class="w-8 text-xl">
                                {{reservation.id}}
                            </div>
                            <div class="w-8">
                                <!--{{reservation.date.split('-')[2]}}-{{reservation.date.split('-')[1]}} - -->
                                <span class="tagged text-xl">{{reservation.time}}</span>
                            </div>
                            <div class="w-1/5 uppercase">{{reservation.name}}</span></div>
                            <div class="w-2/5">
                                <template v-for="(item,i) in JSON.parse(reservation.reservations)">
                                    <div :key="'line_' + index + '_' + i" class="w-full flex flex-row justify-between">
                                        <div>{{item.name}}</div> 
                                        <div>{{item.price}}</div>
                                    </div>
                                </template>
                                <div class="w-full text-right font-bold pt-2">
                                    &euro; {{reservation.total}}
                                </div>
                            </div>
                        </div>
                </template>
            </div>
            <div class="w-full md:w-1/2 flex flex-col text-center m-auto py-10">
                <div class="text-md"><span class="tagged">Venduto &euro; ultimi 7gg</span></div>
                <div id="chart_0" serial="chart_0" class="chart_0 m-auto px-8"></div>
            </div>
        </div>
    </div>    
</template>
<script>
import 'rockiot-ui/build/rockiot.ui.min'
import '../plugins/rockiot.chart'

export default {
    name: 'Dashboard',
    data:()=>({
        reservations: [],
        from: new Date(),
        to: new Date(),
        chartData:{
            data: [],
            labels: [],
            options: {
                width: '400px',
                height: '240px',
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
    }),
    beforeMount(){
        this.$reservations()
        let d = new Date()
        d.setDate( d.getDate()-7 )
        this.from = d
        this.getOrders()
    },
    methods:{
         getOrders(){
            this.$ordersByPeriod(this.from,this.to,1).then ( resp => {
            
                this.items = resp.data.map ( order => { return order.items })
                this.serie_1 = this.$arrayGroup ( resp.data , 'date' , 'total' )
                this.serie_1.keys.push(null)
                this.serie_1.sums.push(null)
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
    },
    mounted(){
        this.reservations = this.$store.getters.reservations
    }
}
</script>