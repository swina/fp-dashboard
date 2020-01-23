<template>
    <div class="w-full flex flex-wrap p-0 items-center justify-center">
        <div v-if="label" class="mr-2">{{label}}</div>
        <div class="border py-2 px-3 bg-buttons" @click="stepMe(-1)"><button :disabled="disable">-</button></div>
        <input class="border-t border-b px-5 py-2 w-16 text-center" readonly :value="step" @input="handleInput"/>
        <div class="border py-2 px-3 bg-buttons" @click="stepMe(1)"><button :disabled="disable">+</button></div>
    </div>
</template>

<script>
export default {
    data:()=>({
    step: 1,
  }),
  props: {
    value : { type: [String,Number] },
    label: { type: String, required: false, default: ''},
    disable: { type: Boolean , required: false , default: false },
    min: { type: [String,Number] , required: false, default: '1'},
    max: { type: [String,Number] , required: false, default: '10'},
  },
  watch:{
    value(val){
      this.step = val
    }
  },
  methods: {
    stepMe(val){
      this.step += parseInt(val)
      if ( parseInt(this.step) <= this.min ){
        this.step = parseInt(this.min)
      }
      if ( parseInt(this.step) >= this.max ){
        this.step = parseInt(this.max)
      }
      this.$emit('input',this.step)
    },
    handleInput(e){
      this.$emit('input',e)
    }
  },
  mounted(){
    this.step = this.value
  }
    
}
</script>