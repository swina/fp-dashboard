<template>
   <svgicon
    :name="icon"
    :width="size"
    :height="size"
    @click="$emit('click')"
    ></svgicon> 
</template>

<script>
export default {
    props: {
        icon: { type: String , required: false , default: 'chevron-left'},
        size: { type: String , required: false , default: "24" }
    }
}
</script>