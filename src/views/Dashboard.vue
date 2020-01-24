<template>
    <div class="p-4 w-full flex flex-col flex-wrap">
        <div class="w-full flex flex-row items-center mt-10 mb-4 cursor-pointer text-white">
            <div class="bg-blue-600 h-24 w-24 border rounded flex flex-col flex-wrap m-auto items-center text-center" @click="$router.push('prenotazioni')">
                <i class="material-icons m-auto text-5xl" title="Prenotazioni">query_builder</i>
                <div class="text-xs">Prenotazioni</div>
            </div>
            <div class="bg-blue-600 h-24 w-24 border rounded flex flex-col flex-wrap m-auto items-center text-center" @click="$router.push('shop')">
                <i class="material-icons m-auto text-5xl" title="Listino">assignment</i>
                <div class="text-xs">Crea Ordine</div>
            </div>
            <div class="bg-blue-600 h-24 w-24 border rounded flex flex-col flex-wrap m-auto items-center text-center" @click="$router.push('ordini')">
                <i class="material-icons m-auto text-5xl" title="Gestione Prodotti">dynamic_feed</i>
                <div class="text-xs">Ordini</div>
            </div>
            <div class="bg-blue-600 h-24 w-24 border rounded flex flex-col flex-wrap m-auto items-center text-center" @click="$router.push('prodotti')">
                <i class="material-icons m-auto text-5xl" title="Gestione Prodotti">view_list</i>
                <div class="text-xs">Listino</div>
            </div>
            <div class="bg-blue-600 h-24 w-24 border rounded flex flex-col flex-wrap m-auto items-center text-center" @click="$router.push('impostazioni')">
                <i class="material-icons m-auto text-5xl" title="Impostazioni">settings_applications</i>
                <div class="text-xs">Impostazioni</div>
            </div>
        </div>
        <div class="w-full border mt-10" v-if="reservations">
            <div class="text-xl bg-gray-400">Prenotazioni/Ordini <span v-if="$store.getters.currentDate">{{$dFormat($store.getters.currentDate)}}</span></div>
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
    </div>    
</template>
<script>
export default {
    name: 'Dashboard',
    data:()=>({
        reservations: []
    }),
    beforeMount(){
        this.$reservations()
    },
    mounted(){
        this.reservations = this.$store.getters.reservations
    }
}
</script>