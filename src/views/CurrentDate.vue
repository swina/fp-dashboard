<template>
    <!-- change current date -->
        <div class="w-full pt-10 flex flex-col flex-wrap items-center text-center">
            <div class="title">Seleziona giorno di lavoro</div>
            <vue-cal 
            hide-view-selector 
            :time="false" 
            style="margin:0 auto;height: 20rem;" 
            class="w-full md:w-1/4 vuecal--blue-theme m-auto" 
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
    name: 'DateSelector',
    components: {
        VueCal
    },
    methods: {
        onCellClick (d) {
            this.$currentDate(d)
            this.$notify ( 'Selezionato giorno ' + this.$dFormat(this.$dateFormat(d)) )
            this.$router.push('/')
        }
    }    
}
</script>