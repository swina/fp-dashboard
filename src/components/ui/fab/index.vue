<template>
    <button :class="css" @click="$emit('click')">
        <slot name="btn"/>
    </button>
</template>

<script>
export default {
   
    props :{
        css: { type: String , required: false , default : 'bg-primary text-2xl w-12 h-12 text-secondary shadow pin-b pin-r' }
    }
}
</script>