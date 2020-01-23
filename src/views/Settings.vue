<template>
    <div class="w-full p-4">
        <div class="w-full p-2 text-left">
            <span class="tagged cursor-pointer mr-2" @click="view='shop'">Negozio</span>
            <span class="tagged cursor-pointer" @click="view='password'">Cambia password</span>
        </div>
        <div class="w-1/2 flex pb-4 flex-col border rounded m-auto" v-if="view==='shop'">
            <div class="title">Impostazioni Negozio</div>
            <template v-for="(field,index) in fields">
                <div :key="'field_' + index" class="flex flex-row items-center justify-between p-4">
                    <div class="flex-0">{{field.label}}</div>
                    <input type="text" class="w-64" v-model="settings[field.name]"/>
                </div>
            </template>
            <div class="row justify-center">
                <button class="btn-blue" @click="save()">Salva</button>
            </div>
        </div>
        <div class="w-1/2 flex flex-col pb-4 border rounded m-auto" v-if="view==='password'">
            <div class="title">Cambia Password</div>
                <div class="flex flex-row items-center justify-between p-4">
                    <div>Nuova Password</div>
                    <input type="password" v-model="password"/>
                </div>
                <div class="flex flex-row items-center justify-between p-4">
                    <div>Conferma Password</div>
                    <input type="password" v-model="password_confirm"/>
                </div>
                <div class="text-xs pb-2">La nuova password sarà attiva al prossimo accesso</div>
                <div class="row justify-center">
                    <button class="btn-blue" @click="verifyPassword">Salva</button>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
  name: 'Settings',
  data:()=>({
      settings:null,
      view: 'shop',
      days: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
      password: '',
      password_confirm: '',
      fields: [
          {
              name: 'email',
              label: 'Email notifiche'
          },
          {
              name: 'start_time',
              label: 'Inizio prenotazioni ore'
          },
          {
              name: 'end_time',
              label: 'Fine prenotazioni ore'
          },
          {
              name: 'item_per_hour',
              label: 'Max qta per slot'
          }
      ]
  }),
  beforeMount(){
      this.settings = this.$store.getters.settings
  } ,
  methods:{
      save(){
          this.$api.service('settings').patch ( this.settings.id , {
              start_time: this.settings.start_time,
              end_time: this.settings.end_time,
              item_per_hour: this.settings.item_per_hour
          }).then ( patched => {
              this.$store.dispatch('SetSettings',patched)
          })
      },
      verifyPassword(){
          if (  this.password === this.password_confirm ){
              this.password.length < 7 ? this.$notify('La password deve essere di almeno 6 caratteri','error') : this.savePassword()
          } else {

              this.$notify('Le password non coincidono','error')
          }
      },
      savePassword(){
          this.$api.service('users').patch ( this.$store.getters.user.user.user.id , {
              password: this.password
          }).then ( patched => {
              this.$notify ( 'Password modificata correttamente' )
          })
      }
  }
}
</script>