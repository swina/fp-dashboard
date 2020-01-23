<template>
    <button class="fixed pin-b pin-l w-full flex flex-wrap items-center bg-primary text-secondary py-4 capitalize justify-center" @click="$emit('click')"><slot name="button"/></button>
</template>