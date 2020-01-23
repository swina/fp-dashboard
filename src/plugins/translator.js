import Vue from 'vue'
import store from '@/store'
import utils from '@/plugins/utils'

export default {
  install: function (Vue) {

    Vue.prototype.$translations = function(){
      return new Promise((resolve, reject) => {
        this.$api.service('translations')
          .find()
          .then(
            result=> {
              this.$store.commit('translations',result.data)
              resolve(true)
            }
          )
          .catch(()=>reject)
      })
    }

    Vue.prototype.$t = function (key, replacements = {} ) {
      if ( store.state.user.translations ){
        if ( store.state.user.translations.length   ){
          var translations = store.state.user.translations[0].terms
          if ( translations ){
            if ( translations[key] ){
              return translations[key]
            } else {
              return key
            }
          } else {
            return key
          }
        }
      }
    }

    Vue.prototype.$tr = function (key, replacements = {} ) {
      if ( store.state.user.translations ){
        if ( store.state.user.translations.length   ){
          var translations = store.state.user.translations[0].terms
          if ( translations ){
            if ( translations[key] ){
              return translations[key]
            } else {
              return key
            }
          } else {
            return key
          }
        }
      }
    }

    Vue.prototype.$tFC = function (key, replacements = {} ) {
      if ( store.state.user.translations ){
        if ( store.state.user.translations.length   ){
          var translations = store.state.user.translations[0].terms
          if ( translations ){
            if ( translations[key] ){
              return utils.strCase(translations[key])
            } else {
              return utils.strCase(key)
            }
          } else {
            return utils.strCase(key)
          }
        }
      }
    }

    Vue.prototype.$tUC = function (key, replacements = {} ) {
      console.log ( key )
      if ( store.state.user.translations && key ){
        if ( store.state.user.translations.length   ){
          var translations = store.state.user.translations[0].terms
          if ( translations ){
            if ( translations[key] ){
              return translations[key].toUpperCase()
            } else {
              return key.toUpperCase()
            }
          } else {
            return key.toUpperCase()
          }
        } else {
          return key
        }
      }
      return key
    }


  }
}
