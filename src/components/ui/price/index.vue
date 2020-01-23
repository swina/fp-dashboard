<template>
    <div class="text-xl">
        <span v-if="!total.discount">{{$tr('currency')}}{{total.price.toFixed(2)}}</span>
        <span v-else>
            <span class="line-through text-xs pr-2">{{$tr('currency')}}{{parseFloat(price.price).toFixed(2)}}</span>
            <span class="text-error">{{$tr('currency')}}{{total.price.toFixed(2)}}</span>
        </span>
        <!--
        <span v-if="!parseInt(price.sale_price)">{{$tr('currency')}}{{parseFloat(price.price).toFixed(2)}}</span>
        <span v-if="parseInt(price.sale_price)">
            <span class="line-through text-xs pr-2">{{$tr('currency')}}{{parseFloat(price.price).toFixed(2)}}</span>
            <span class="text-error">{{$tr('currency')}}{{parseFloat(price.sale_price).toFixed(2)}}</span>
        </span>
        -->
    </div>
</template>

<script>
export default {
    computed:{
        total(){
            return {
                price: parseFloat(this.price.sale_price) ? parseFloat(this.price.sale_price)*parseFloat(this.price.qty) : parseFloat(this.price.price)*parseFloat(this.price.qty),
                discount: parseFloat(this.price.sale_price) ? true : false
            }
        }
    },
    props: {
        price : { type: Object , required: false , default:()=>{qty:1}}
    }
} 
</script>