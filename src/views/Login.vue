<template>
    <div class="w-full bg-blue-800 h-screen flex">
        <div class="w-1/3 flex flex-col  m-auto border rounded">
            <div class="title bg-blue-600 text-blue-200">Login</div>
            <template v-for="(field,index) in fields">
                <div :key="'field_' + index" class="flex flex-row justify-between p-4">
                    <div class="w-1/5 text-left">{{field.label}}</div>
                    <input :type="field.type" v-model="field.value" :placeholder="field.label"/>
                </div>
            </template>
            <div class="row justify-center p-4">
                <button class="btn-blue" @click="login">Login</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data:()=>({
      settings:null,
      fields: [
          {
              name: 'email',
              label: 'Utente',
              value: '',
              type: 'text'
          },
          {
              name: 'password',
              label: 'Password',
              value: '',
              type: 'password'
          }
      ]
  }),
  methods:{
      login(){
          this.$login( this.fields[0].value , this.fields[1].value )
      }
  }
}
</script>