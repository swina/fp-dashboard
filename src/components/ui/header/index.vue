<template>
    <div class="flex flex-wrap w-full items-center fixed pin-t pin-l h-12 bg-header p-2 text-secondary">
        <div class="w-1/4 flex justify-start">
            <v-icon-mood :icon="icon" @click="navigate"/>
        </div>
        <div class="w-1/2 flex justify-center">{{title}}</div>
        <div class="w-1/4 flex justify-end"><v-icon-mood v-if="$store.getters.cart.items.length" class="stroke-current text-white" size="30" icon="shopping-cart" @click="$router.push('/cart')"/>
        </div>
    </div>
</template>

<script>
export default {
    computed:{
        icon(){
            if ( this.$route.path === '/' ){
                return 'bars'
            }
            return 'chevron-left'
        },
        title(){
            return process.env.VUE_APP_APPNAME
        }
    },
    methods:{
        navigate(){
            if ( this.$route.path === '/' ){
                this.$router.push('/tables')
            } else {
                this.$router.go(-1)
            }
            
        }
    }
}
</script>