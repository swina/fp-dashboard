<template>
<div>
    <div class="w-full flex flex-row flex-wrap">
        <template v-for="(slice,index) in $store.getters.slices">
            <div :style="getImage(index)" :title="getSlice(slice)" :class="'m-2 flex items-center text-center text-2xl w-24 h-24 p-4 ' + selectedSlice(index)" :key="'slice__0' + index">
                <div class="w-full" @click="$store.dispatch('SetCurrentSlice',index)">{{index+1}}</div>
            </div>
        </template>

    </div>
    </div>
</template>

<script>
export default {
    name: 'Slices',
    data:()=>({
        slices: []
    }),
    computed:{
        style(){
            let slice = this.$store.getters.slices[this.$store.getters.currentSlice]
            console.log ( slice )
            return  slice ? 'background:url(' + slice.image + '); background-size:cover;' : ''
        }
    },
    methods:{
        getImage(i){
            let slice = this.$store.getters.slices[i]
            return slice ? 'background:url(' + slice.image + '); background-size:cover;' : ''
        },
        getSlice(slice){
            return slice ? slice.name : ''
        },
        selectedSlice(i){
            return i === this.$store.getters.currentSlice ? 'border-4 border-red-700' : 'border'
        }
    }
}
</script>