import Vue from 'vue'
import store from '@/store'
import router from '../router'

export default {
  install: function (Vue) {

    Vue.prototype.$isLogged = function(path='/login'){
      console.log ( 'checking is logged')
      this.$api.authenticate()
      .then( response => {
        console.log ( response )
        //this.accessToken = response.accessToken
        return this.$api.passport.verifyJWT(response.accessToken);
      }).then(payload => {
        console.log ( payload )
        return this.$api.service('users').get(payload.userId);
      }).then(user => {
        console.log ( user , 'is authenticated' )
        store.commit('user',user)
      }).catch(error=>{
        this.$router.push(path)
        console.log('error',error)
      })
    }

    Vue.prototype.$logout = function(){
        this.$api.logout()
        store.commit('user',{})
        store.dispatch('SetLogged',false)
        router.push('login')
    }

    Vue.prototype.$login = function(email='',password='',path='/'){
      console.log ( email, password)
      let err = ''
      this.$api.authenticate({
        email: email,
        password: password,
        strategy: 'local'
      }).then(user => {
        console.log ( user , 'is authenticated' )
        store.commit('user',user)
        store.dispatch('SetLogged',true)
        this.$router.push(path)
        this.$api.service('settings').find().then(response=>{
          console.log ( 'settings' , response.data )
          store.dispatch('SetSettings',response.data[0])
        })
        this.$api.service('products').find({query:{type:'gusto',$sort:{name:1}}}).then(response=>{
          store.dispatch('SetProducts',response.data)
          console.log ( 'loaded products ...')
        }).catch(error=>{
          console.log ( error )
        })  
      }).catch(error=>{
        console.log ( error )
        return error
      })
    }

    Vue.prototype.$register = function(form,path='/login'){
      let new_user = form
      delete new_user.password_confirm
      new_user.wishes = null
      new_user.admin = false
      return new Promise((resolve, reject) => {
        this.$api.service('users').create(new_user).then(result=>{
          this.$login(form.email,form.password)
          resolve(true)
        }).catch(error=>{
          let err
          if ( error.message.indexOf('duplicate key') ){
            err = this.$tr('email exists')
          } else {
            err = this.$tr('general error') + ' (' + error.code + ')'
          }
          reject(err)
        })
      })
    }

  }
}
