<template>
  <!-- Rounded switch -->
  <div class="switch__container" style="">
    <div class="switch__label" :style="{color:color}">{{label}}</div>
    <label class="switch">
      <input type="checkbox" class="switch__input" :checked="checked" @change="trigger">
      <span :class="'slider ' + is_rounded" :style="style"></span>
    </label>
  </div>
</template>

<script>
export default {
  data:()=>({
    status: false,
    is_checked:null
  }),
  computed:{
    is_rounded(){
      if ( this.round ){
        return 'round'
      }
      return ''
    },
    style(){
      return {
        "background" : this.checked ? this.color + '!important;' : '#ccc',
      }
    }
  },
  props: {
    label: { type: String, required: false , default: '' },
    checked: { type: Boolean , required: false , default: false },
    round: { type: Boolean , required: false, default: true },
    color: { type: String , required: false , default: 'green' },
    binded: { type: Object , required: false , default:()=>{}}
  },
  methods: {
    trigger (e) {
      if ( this.binded ){
        this.$emit('change', e.target.checked , this.binded )//e.target.checked)
     }
    }
  },
}
</script>
<style scoped>
.switch__container {
  width:100%;
  display:flex;
  align-items:center;
  justify-content:flex-start;
  padding:1rem 0 1rem 0;
}

.switch__label {
  margin-right:1rem;
  text-align:left;
  display:inline-block;
}


/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  justify-content: flex-end;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(116, 177, 124);
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 21px;
  width: 21px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 0px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 30px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
