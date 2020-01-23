<template>
  <transition name="fade">
  <div v-if="modal" class="fixed top-0 left-0 flex flex-wrap h-screen w-full items-center">
    <div class="w-full pin-t pin-l fixed flex flex-wrap h-screen bg-black opacity-50 z-1" @click="closeMe">
        
    </div> 
    <div class="w-full flex flex-wrap items-center justify-center h-screen fixed pin-t pin-l">
       

      <div :class="'w-full flex flex-wrap mx-4 bg-white shadow-lg rounded-lg z-10 ' + size">
        <slot name="header"></slot>
        <slot name="sidebar"></slot>
        <slot name="content"></slot>
        <div class="w-full h-16 flex flex-wrap items-end">
            <div v-if="close && ok" class="w-full">
              <button class="w-1/2 text-center py-4 border-r border-t border-primary uppercase" type="default" background="#ddd" @click="$emit('close')">Chiudi</button>
              <button class="w-1/2 text-center py-4 border-t uppercase" type="default" background="#ddd" @click="doClick">OK</button>
            </div>
            <div v-if="!ok" class="w-full">
              <button v-if="close" class="w-full text-center rounded-bl rounded-br py-4 border-t uppercase" type="default" background="#ddd" @click="$emit('close')">Chiudi</button>
            </div>
            <div v-if="ok && !close" class="w-full">
              <button class="w-full text-center py-4 border-t border-primary uppercase" type="default" background="#ddd" @click="$emit('click')">OK</button>
            </div>
        </div>
      </div>
        

    </div>
  </div>
  </transition>
</template>

<script>
export default {
  props : {
    modal: { type: Boolean, required: true, default: false },
    close: { type: Boolean, required: false , default: true },
    ok: { type: Number, required: false , default: 1 },
    fullwidth: { type: Boolean , required: false , default: false },
    width: { type: String , required: false, default: '320px' },
    height: { type: String , required: false, default: '320px'},
    orientation: { type: String , required: false, default: 'landscape' }
  },
  computed:{
    size(){
      return this.fullwidth ? 'h-64 m-8' : 'md:w-1/2 lg:w-1/3 xl:w-1/4'
    }
  },
  methods:{
    closeMe(){
      console.log ( 'to close')
      this.$emit('close')
    },
    doClick(){
      console.log ( 'clicked ok')
      this.$emit('click')
    }
  }
}
</script>
