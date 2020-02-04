<template>
     <!-- change current date -->
        <div class="w-full text-center">
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
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
    name: 'Calendar',
    components: VueCal,
    data:()=>({

    }),
    methods:{
        onCellClick (d) {
            this.$currentDate(d)
        }
    }
}
</script>