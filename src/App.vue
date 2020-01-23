<template>
  <div id="app">
    <div v-if="$store.getters.logged" id="nav" class="flex flex-row items-center bg-blue-800 p-2 text-left">
      <div class="w-2/3 flex flex-row items-center">
        <router-link to="/">
          <img alt="FamilyPizza" class="h-12 w-12 mr-4" src="https://storage.googleapis.com/ghostfood-539ae.appspot.com/images/logo.png">
        </router-link> 
        <router-link to="/prenotazioni" class="menu" title="Prenotazioni"><i class="material-icons">query_builder</i></router-link>
        <router-link to="/shop" class="menu" title="Crea Ordine"><i class="material-icons">assignment</i></router-link>
        <router-link to="/data" class="menu" title="Cambia data"><i class="material-icons">calendar_today</i></router-link>
        <router-link to="/prodotti" class="menu" title="Gestisci prodotti"><i class="material-icons">view_list</i></router-link>
        <router-link to="/impostazioni" class="menu" title="Impostazioni"><i class="material-icons">settings_applications</i></router-link>
      </div>
      <div class="w-1/3 text-right text-white items-center flex flex-row justify-end" v-if="$store.getters.logged">
        <span v-if="$store.getters.currentDate" class="bg-blue-700 text-blue-300 rounded p-1 cursor-pointer" @click="$router.push('data')"><span class="text-xs">Data Lavoro</span> {{$dFormat($store.getters.currentDate)}}</span> 
        
        <i class="material-icons cursor-pointer ml-2" @click="$logout()" title="Esci">lock</i>
      </div>
    </div>
    <router-view/>
    <div :class="'fixed w-full bottom-0 left-0 p-4 z-10 text-xl ' + notify" v-if="$store.getters.notify.status">
      {{$store.getters.notify.title}}
    </div>
  </div>
</template>
<script>
import Dashboard from '@/views/Dashboard.vue'
export default {
  name: 'App',
  components: {
    Dashboard
  },
  computed:{
    notify(){
      return this.$store.getters.notify.error ? 'bg-red-300' : 'bg-green-300'
    }
  },
  mounted(){
    !this.$store.getters.currentDate ? this.$currentDate() : null

    this.$api.service('reservations').on( 'created' , (created) => {
      this.$notify ( 'Creata prenotazione ' + created.name )
    })

     this.$api.service('reservations').on( 'patched' , (patched) => {
      this.$notify ( 'Modificata prenotazione ' + patched.name )
    })

    this.$api.service('products').on( 'patched' , (patched) => {
      this.$notify ( 'Prodotto salvato => ' + patched.name )
      this.$products()
    })

    this.$api.service('settings').on( 'patched' , (settings) => {
      this.$notify ( 'Impostazioni salvate' )
    })

  }
}
</script>