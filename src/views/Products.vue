<template>
<div class="w-full flex flex-col md:flex-row flex-wrap pb-20">
    <!--
        <div class="w-full flex flex-row justify-end p-2">
            <span title="Lista" @click="view='list'"><i class="material-icons fab">list</i></span>
            <span title="Foto" class="ml-2" @click="view='photo'"><i class="material-icons fab">image</i></span>
        </div>
    -->    
    <div class="w-full md:w-1/3 p-2">
        <div class="w-full flex flex-row items-center justify-between">
            <i class="material-icons fab" @click="nextPage(0)">keyboard_arrow_left</i>
            <div class="text-xl font-bold">Listino<p class="text-xs">Trascina il prodotto a destra per modificarlo</p></div>
            <i class="material-icons fab" @click="nextPage(1)">keyboard_arrow_right</i>
        </div>
        <draggable :list="products" title="" :group="{ name: 'gusti', pull: 'clone', put: false }" class="flex flex-row flex-wrap">
            <template  v-for="(product,index) in products">
                <transition name="collapse">
                <div v-if="index >= startIndex && index < (startIndex+10)" :class="'hover:bg-gray-300 cursor-move flex ' + layout" :key="'product_' + index" :title="product.name">
                    
                    <div class="text-left">
                        <span v-if="view==='list'">{{product.name}}</span>
                    </div>
                    <div v-if="!parseInt(product.sale)" class="text-xs">&euro; {{product.price}}</div>
                    <div v-if="parseInt(product.sale)" class="text-xs text-red-500">&euro; {{product.sale}}</div>
                </div>
                </transition>
            </template>
        </draggable>

    </div>
    <div class="w-full md:w-2/3 p-2 border-l-4 border-dashed">
        <div class="text-xl font-bold">Prodotto</div>
        <draggable :list="slices" group="gusti" class="w-full flex flex-row flex-wrap" @change="log">
            <div v-if="slices[0]" class="w-full">
                <template v-for="(field,index) in fields">
                     <div :key="'field_' + index" class="w-full flex flex-col">
                         
                        <div v-if="field.type === 'text' || field.type === 'textarea'" class="w-full flex flex-row flex-wrap text-left pb-2 items-center">
                            <div class="w-1/3">{{field.label}}</div>
                            <input class="w-2/3" type="text" v-model="slices[0][field.name]"/>
                        </div>
                        
                        <div v-if="field.type === 'list'" class="w-full flex flex-row flex-wrap text-left pb-2 items-center">
                            <div class="w-1/3">{{field.label}}</div>
                            <div class="w-2/3">
                                <select v-model="slices[0][field.name]">
                                    <template v-for="(list,i) in liste[field.name]">
                                        <option :value="list">{{list}}</option>
                                    </template>
                                </select>
                                <!--
                                <div class="flex items-center"><span class="tagged bg-green-300"><span class="tagged bg-green-300">{{slices[0][field.name]}}</span> <i class="material-icons">remove_circle</i></span></div>
                                <template v-for="(list,i) in liste[field.name]">
                                    <span v-if="list!=slices[0][field.name]" :key="'list_' + field.name + '_' + i" class="tagged">{{list}}</span>
                                </template>
                                -->
                                <!--<input type="text" v-model="slices[0][field.name]"/>-->
                            </div>
                        </div>

                        <div v-if="field.type === 'image'" class="w-full flex flex-row flex-wrap text-left pb-2 items-center">
                            <div class="w-1/3">{{field.label}}</div>
                            <div class="w-2/3 flex flex-col">
                                <img class="w-32 h-32" :src="slices[0][field.name]" v-if="slices[0][field.name]"/>
                                <input class="w-full text-xs" type="text" v-model="slices[0][field.name]"/>
                            </div>
                        </div>

                        <div v-if="field.type === 'boolean'" class="w-full flex flex-row flex-wrap text-left pb-2 items-center">
                            <div class="w-1/3">{{field.label}}</div>
                            <div class="w-2/3 flex flex-col">
                                <input class="checkbox" type="checkbox" v-model="slices[0][field.name]" :checked="slices[0][field.name]"/>
                            </div>
                        </div>
                     </div>
                </template>
            </div>
            
        </draggable>
    </div>
    <div class="fixed bottom-0 left-0 w-full border-t bg-blue-300 items-center flex flex-row">
        
        <div class="w-full text-2xl text-right flex flex-row justify-end items-center">
            <button v-if="slices[0]" class="w-1/5 bg-red-700 text-white p-2 text-center" @click="save">Salva</button>
        </div>
    </div>
</div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
    name: 'Products',
    components : {
        draggable
    },
    data:()=>({
        view: 'list',
        startIndex: 0,
        endIndex: 10,
        products:[],
        slices:[],
        liste: {
            category:[],
            gusti:[]
        },
        fields: [
             {
                name: 'name' ,
                label: 'Nome',
                type: 'text',
                len: 255
            },
            {
                name: 'category',
                label: 'Categoria',
                type: 'list',
                list: 'categories',
                len: 45
            },
           
            {
                name: 'description',
                label: 'Descrizione',
                type: 'textarea',
                len: 1048
            },
            {
                name: 'price',
                label: 'Prezzo',
                type: 'text',
                len: 12
            },
            {
                name: 'sale',
                label: 'Prezzo scontato',
                type: 'text',
                len: 12
            },
            {
                name: 'image',
                label: 'Foto',
                type: 'image',
            },
            {
                name: 'active',
                label: 'Attivo',
                type: 'boolean'
            }
        ],
        cartTotal: 0
    }),
    computed:{
        layout(){
            return this.view === 'photo' ? 'flex-col text-xs' : 'flex-row  w-full justify-between border-b p-3'
        },
        iconLayout(){
            return this.view === 'photo' ? 'absolute top-0 left-0 p-1 m-1' : ''
        },
        listCol(){
            return this.view === 'photo' ? '' : 'w-2/3 text-left'
        },
    },
    methods:{
        nextPage(flag){
            if ( !flag ) {
                this.startIndex > 0 ? this.startIndex = this.startIndex-10 : this.startIndex = 0
            }
            if ( flag ){
                this.startIndex + 10 < this.products.length ? this.startIndex = this.startIndex+10 : null
            }
        },
        log(evt){
            this.slices.pop()
        },
        getImage(i){
            let slice = this.slices[i]
            return slice ? 'background:url(' + slice.image + '); background-size:cover;' : ''
        },
        save(){
            let product = this.slices[0]
            if ( this.slices[0].active ){
                product.active = 1
            } else {
                product.active = 0
            }
            let id = this.slices[0].id
            delete product.id
            this.$api.service('products').patch ( id , product ).then ( patched => {
                console.log ( 'product patched' )
            })
        }
    },
    mounted(){
        this.products = this.$store.getters.products
        this.slices.push(this.products[0])
        this.$store.getters.cart.items.length ? this.slices = this.$store.getters.cart.items : null
        this.liste.category =  this.$arrayGroup(this.products,'category').keys
    }
}
</script>