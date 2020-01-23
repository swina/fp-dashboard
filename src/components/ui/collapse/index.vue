<template>
    <div>
        <div class="flex flex-wrap items-center py-2 bg-grey-light">
            <div class="flex w-3/4 py-4 pl-2" @click="collapse">
                <slot name="title"/>
            </div>
            <div class="flex w-1/4 justify-end pr-2 py-4 z-10">
                <v-icon-mood class="stroke-current text-primary" @click="collapse" :icon="icon"/>
            </div>
            <div ref="collapsable" class="w-full collapsable">
                <div class="text-left py-4 bg-white">
                    <slot name="collapsed"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data:()=>({
        icon: 'chevron-down'
    }),
    methods:{
        collapse(){
            if ( this.$refs.collapsable.className === 'w-full collapse' ){
                this.$refs.collapsable.className = 'w-full collapsable'
                this.icon = 'chevron-down'
            } else {
                this.icon = 'chevron-up'
                this.$refs.collapsable.className = 'w-full collapse'

            }
        }
    }
}
</script>
