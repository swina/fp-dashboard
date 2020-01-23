<template>
    <div class="w-full flex flex-wrap items-center p-1">
        <div class="w-1/3 md:w-1/4 lg:w-1/4 xl:w-1/5 p-3">
            <slot name="title"/>
        </div>
        <div class="w-2/3 md:w-3/4 lg:w-3/4 xl:w-4/5 flex flex-wrap p-3">
            <div class="w-3/4 flex justify-start"><slot name="content"/></div>
            <div class="w-1/4 flex justify-end">
                <button v-if="action" class="text-xs h-6 p-1 rounded bg-lighter text-black" @click="$emit('click')"><slot name="button">{{$tr('change')}}</slot></button>
                <slot name="right"/>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: { action: { required: false , type: Boolean , default : false}}
}
</script>