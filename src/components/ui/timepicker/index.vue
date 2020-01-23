<template>
    <div class="w-full flex flex-wrap text-center justify-center">
        <div class="w-full p-4 px-6" @click="show=!show"><input readonly class="outline-none border rounded border-light p-4 px-6 -ml-4 shadow-lg " v-model="time"/><span class="justify-end text-xs rounded-full border border-light p-2 -ml-10"><v-icon-mood class="stroke-current" size="12" icon="chevron-down"/></span></div>
        <transition name="fade">
        <div class="relative w-64 flex flex-wrap justify-center -mt-32 bg-secondary z-10 shadow-lg" v-if="show">
            <div class="absolute pin-t pin-r mx-2" @click="show=!show"><v-icon-mood class="stroke-current" size="10" icon="close"/></div>    
            <div class="w-32 p-4 text-center border border-light">
                {{$tr('HH')}}
                <div class="h-48 w-full overflow-y-scroll">
                    <template v-for="n in end_hour">
                        <div class="w-full" :key="'h_' + n" v-if="n >= (start_hour+1)">
                            <input v-if="parseInt(hours) != (n-1)" class="p-2 outline-none focus:bg-primary focus:text-secondary text-center w-full" readonly :value="n-1" @click="setHours(n-1)"/>
                            <input v-else class="p-2 outline-none bg-primary text-secondary text-center w-full" readonly :value="n-1" @click="setHours(n-1)"/>
                        </div>
                    </template>
                </div>
            </div>
            <div class="w-32 p-4 text-center border-b border-t border-r border-light">
                <span class="border-light">{{$tr('mm')}}</span>
                <div class="h-48 w-full overflow-y-scroll">
                <template v-for="m in (60/range_minutes)">
                <div class="w-full" :key="'m_' + m">
                    <!--<input class="p-2 outline-none active:bg-primary active:text-secondary focus:bg-primary focus:text-secondary text-center w-full" readonly value="00" v-if="m === 1"/>-->
                    <input v-if="parseInt(minutes) != (m-1)*10" class="p-2 outline-none focus:bg-primary focus:text-secondary text-center w-full" readonly :value="(m-1)*10" @click="setMinutes(m)" />
                    <input v-else class="p-2 outline-none bg-primary text-secondary text-center w-full" readonly :value="(m-1)*10"  @click="setMinutes(m)"/>
                </div>
                </template>
                </div>
            </div>
        </div>
        </transition>
    </div>
</template>

<script>
export default {
    data:()=>({
        n:0,
        show: false,
        hours: 0,
        minutes: 0,
        time:null
    }),
    props:{
        range_hours: { type: Array , required: false, default:()=>[0,24]},
        range_minutes: { type: [String,Number] , required: false, default: 10 } ,
        //time: { type: String , required: false , default: '00:00' }
    },
    computed:{
        start_hour(){
            return parseInt(this.range_hours[0])
        },
        end_hour(){
            return parseInt(this.range_hours[1])
        }
    },
    methods:{
        setHours(val){
            this.hours = val
            this.time = this.hours + ':' + this.minutes
            this.$emit('input',this.time)
        },
        setMinutes(val){
            this.minutes = (val-1)*10
            this.show = false
            this.time = this.hours + ':' + this.minutes
            this.$emit('input',this.time)
        },
    }
}
</script>