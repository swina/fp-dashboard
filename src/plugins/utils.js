import Vue from 'vue'
import store from '@/store'

function padNumber(num,str){
  if ( num < 10 ){
      return str + num
  } else {
      return num
  }
}

function closeNotify (){
  store.dispatch ( 'CloseNotify' )
}

export default {
  install: function (Vue) {
    Vue.prototype.$notify = function ( msg = '' , error='' ){
      store.dispatch ( 'SetNotify' , {
        status: true,
        title: msg,
        error: error
      })
      window.setTimeout( closeNotify , 3000 )
    }

    Vue.prototype.$dFormat = function(d='2020-01-01'){
      //d format must be YYYY-MM-DD
      return d.split('-')[2] + ' ' + store.getters.months[parseInt(d.split('-')[1])-1] + ' ' + d.split('-')[0]
    }

    Vue.prototype.$currentDate = function(d=new Date()){
      let today = new Date(d);
      let year = today.getFullYear()
      let month = padNumber(today.getMonth()+1,'0')
      let day = padNumber(today.getDate(),'0')
      store.dispatch('SetCurrentDate' , year+'-'+month+'-'+day)
    }

    Vue.prototype.$reservationsDate = function(d=new Date()){
      let today = new Date(d);
      let year = today.getFullYear()
      let month = padNumber(today.getMonth()+1,'0')
      let day = padNumber(today.getDate(),'0')
      return year+'-'+month+'-'+day
    }

    Vue.prototype.$month = function (month=0){
      return store.getters.months[month]
    }

    Vue.prototype.$setCSS = function( selector , property , value ){
      return selector + '{' + property + ':' + value + ';}'
    }

    Vue.prototype.$style = function( css_rules ){
      var sheet = document.createElement('style')
      sheet.innerHTML = css_rules
      document.body.appendChild(sheet);
    }

    Vue.prototype.$styleProp = function(selector,css_rules){
      let css = ''
      css += Object.keys(css_rules).map(property=>{
        return selector + '{' + property + ':' + css_rules[property] + ';}'
      })
      var sheet = document.createElement('style')
      sheet.innerHTML = css.replace(',','')
      document.body.appendChild(sheet);
    }

    Vue.prototype.$price = function ( item ) {
      let price = this.$tr('currency')
      parseFloat(item.sale_price) > 0 ? price += parseFloat(item.sale_price).toFixed(2) : price += parseFloat(item.price).toFixed(2)
      return price
    }

    Vue.prototype.$fullprice = function (item){
      let price = this.$tr('currency')
      parseFloat(item.sale_price) > 0 ? price += parseFloat(item.price).toFixed(2) : price = ''
      return price
    }

    Vue.prototype.$productPrice = function(item){
      if ( parseFloat(item.sale_price) > 0 ){
        return this.$tr('currency') + '<span class="price">' + parseFloat(item.sale_price).toFixed(2) + '</span><span class="striked-price">' + parseFloat(item.price).toFixed(2) + '</span>'
      }
      return this.$tr('currency') + '<span class="price">' + parseFloat(item.price).toFixed(2) + '</span>'
    }

    Vue.prototype.$salecolor = function (value){
      if ( parseFloat(value) > 0 ){
        return 'error--text'
      }
    },

    Vue.prototype.$totalQty = function ( item , qty = 1 , currency = true ) {
      let price = this.$tr('currency')
      currency ? price = this.$tr('currency') : price = ''
      parseFloat(item.sale_price) > 0 ? price += (parseFloat(item.sale_price)*qty).toFixed(2) : price += (parseFloat(item.price)*qty).toFixed(2)
      return price
    }

    Vue.prototype.$itemVariationPrice = function ( item , variations , qty=1 ){
      let base_price = 0
      let price = 0
      parseFloat(item.sale_price) > 0 ? price += (parseFloat(item.sale_price)*qty) : price += (parseFloat(item.price)*qty)
      if ( this.$store.state.shop.product.variations ){
        this.$store.state.shop.product.variations.map((variation)=>{
          price += parseFloat(variation.price)
        })
        //price = price.toFixed(2)
      }
      return this.$tr('currency') +  price.toFixed(2)
    }

    Vue.prototype.$discount = function ( item ){
      let discount = ''
      if ( parseFloat(item.sale_price) > 0 ){
        discount = ((parseFloat(item.price)-parseFloat(item.sale_price))/parseFloat(item.price))*100
        discount = '-' + parseInt(discount).toString()+'%'
      }
      return discount
    }



    Vue.prototype.$slug = function ( str ){
      if ( str ){
        return str.split(' ').join('-').toLowerCase().replace(/[^a-z0-9-]/gi,'');
      }
      return str
    }

    Vue.prototype.$arraySort = function ( arr , key , summ ){
      if ( arr != 'undefined' ){
        let sum_field
        let total = 0
        if ( summ ){
          sum_field = summ
        }
        let sorted = arr.sort((a,b) => a.nr < b.nr ? -1 : 1 )
        if ( sum_field ){
          sorted.map(item=>{
            total += parseFloat(item[key])
          })
        }
        return {
          sorted: sorted,
          total: total
        }
      }
      return null
    }

    Vue.prototype.$arrayGroup = function ( arr , key , summ = {} ){
      // @arr = array of objects (required)
      // @key = key to group (required)
      // @summ = key to sum
      // group array of objects on given key, sum on key , count for given key
      // return object grouped
      //    keys = grouped keys
      //    values = values for the each grouped keys
      //    sums = sum of values of field x for each grouped keys
      //    counters = counter for each grouped key
      if ( arr != 'undefined' ){
        let counter = 0
        let sums = []
        let counters = []
        let sum_field = summ
        let total = 0
        let grouped = arr.reduce((h, item) => Object.assign(h, { [item[key]]:( h[item[key]] || [] ).concat(item) }), {})
        let keys = Object.keys(grouped)
        if ( summ ){
          Object.values(grouped).map(item=>{
            total = 0
            counter = 0
            item.map(i=>{
              counter++
              total += parseFloat(i[sum_field])
            })
            sums.push(total)
            counters.push(counter)
          })
        }
        return {
          keys: Object.keys(grouped),
          values: Object.values(grouped),
          sums: sums,
          counters: counters
        }
      }
      return null
    }

    Vue.prototype.$dateFormat = function (d = new Date() , format = 'YYYY-MM-DD' ){
      let fdate = d.getFullYear() + '-' + ("00" + (d.getMonth()+1)).slice(-2) + '-' + ("00" + d.getDate()).slice(-2)
      if ( format === 'YYYY-MM-DD') {
        return fdate
      }
      if ( format === 'DD-MM-YYYY' ){
        return fdate.split('-')[2] + '-' + fdate.split('-')[1] + '-' + fdate.split('-')[0]
      }
      if ( format === 'MM-DD-YYYY'){
        return fdate.split('-')[1] + '-' + fdate.split('-')[2] + '-' + fdate.split('-')[0]
      }
    }

    Vue.prototype.$DateTimeFormat = function (d = new Date() , format = 'DD-MM-YYYY' ){
      if ( format === 'DD-MM-YYYY') {
        return ("00" + d.getDate()).slice(-2) + '-'
          + ("00" + (d.getMonth()+1)).slice(-2) + '-'
          + d.getFullYear() + ' '
          + ("00" + d.getHours()).slice(-2) + ':'
          + ("00" + d.getMinutes()).slice(-2)
      }
      if ( format === 'MM-DD-YYYY' ){
        return ("00" + (d.getMonth()+1)).slice(-2) + '-'
        + ("00" + d.getDate()).slice(-2) + '-'
        + d.getFullYear() + ' '
        + ("00" + d.getHours()).slice(-2) + ':'
        + ("00" + d.getMinutes()).slice(-2)
      }
    }

    Vue.prototype.$TimeFormat = function( d = new Date() ){
      return ("00" + d.getHours()).slice(-2) + ':' + ("00" + d.getMinutes()).slice(-2)
    }

    Vue.prototype.$idDate = function ( objectid ){
      var timestamp = objectid.toString().substring(0,8)

      var a = new Date(  parseInt( timestamp, 16 ) * 1000 );

      var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      if ( min < 10 ){
        min = '0'+min
      }
      var sec = a.getSeconds();
      var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min ;
      return time
    }

    Vue.prototype.$idDateNoTime = function ( objectid ){
      var timestamp = objectid.toString().substring(0,8)

      var a = new Date(  parseInt( timestamp, 16 ) * 1000 );

      var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      if ( min < 10 ){
        min = '0'+min
      }
      var sec = a.getSeconds();
      var time = date + '/' + month + '/' + year ;
      return time
    }

    Vue.prototype.$strToDate = function ( dt = '2018-01-01'){
      let d = dt.split('-')
      return new Date(d[0],parseInt(d[1])-1,d[2])
    }

    Vue.prototype.$noDayOfWeek = function( dt = new Date() , day ){
      if ( dt.getDay() != day ){
        return dt
      }
    }

    Vue.prototype.$hours = function ( minHour = 0 , maxHour = 24 , step = 10){
      let arr = []
      let hours = []
      let minutes = []
      for ( minHour ; minHour < maxHour ; minHour++ ){
        hours.push ( minHour.toString() )
      }
      arr.push ({
        values: hours,
        className: 'column1'
      })
      for ( var m=0 ; m < 60 ; m+=step ){
        minutes.push ( ('00' + m.toString()).slice(-2) )
      }
      arr.push({
        values: minutes,
        className: 'column2'
      })
      return arr
    }

    Vue.prototype.$strCase = function ( str ){
      if ( str ){

      var splitStr = str.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
         // You do not need to check if i is larger than splitStr length, as your for does that for you
         // Assign it back to the array
         splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
      }
      // Directly return the joined string
      return splitStr.join(' ');
      }
      return str
    }

    Vue.prototype.$resetStore = function(){
      console.log ( Object.keys(this.$store._mutations) )
      console.log ( this.$store )
      let aState = Object.keys( this.$store._modules.root.state)
      aState.map ( item => {
        console.log ( item , typeof this.$store._modules.root.state[item] )
      })
    }
  }
}
