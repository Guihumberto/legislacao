<template>
    <v-expand-transition>
        <v-sheet
            class="mx-auto my-3"
            elevation="1"
            rounded="xl"
            v-if="!aggsStore.readLoad && termsSignificantes.length"
        >
            <v-sheet
            class="py-1 px-5 bg-blue-lighten-2 text-left d-flex justify-space-between align-center"
            rounded="t-xl"
            > 
                <h1 class="text-overline text-white">Termos Relevantes relacionados a pesquisa</h1>
                <v-btn color="white" variant="text" :icon="hidden ? 'mdi-window-minimize' : 'mdi-window-maximize'" @click="hidden = !hidden"></v-btn>
            </v-sheet>
            <v-expand-transition>
                <div v-if="hidden">
                    <div class="pa-4">
                        <v-chip-group
                            selected-class="text-primary"
                            column multiple
                            v-model="listSelect"
                        >
                            <v-chip
                                filter
                                v-for="item, i in termsSignificantes" :key="i"
                                @click="addSearch(item.key)"
                            >
                            {{ item.key }}
                            </v-chip>
                        </v-chip-group>
                    </div>
                </div>
            </v-expand-transition>
        </v-sheet>
    </v-expand-transition>
</template>

<script setup>
    import { onMounted, computed, ref } from 'vue';

    import { useAggsStore } from '@/store/AggsStores';
    const aggsStore = useAggsStore()

    const hidden = ref(true)   
    const listSelect = ref([])
    const listSelectText = ref([])

    const props = defineProps({
        terms: String,
        firstSearch: String
    })

    const termsAddSearch = computed(() => {
        return props.terms
        ? props.terms.split(' ')
        : []
    })

    const normalizarTexto = (texto) => {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const termsSignificantes = computed(() => {
        if(props.firstSearch.includes(' ')){
            const list_words = props.firstSearch.split(' ')
            return aggsStore.readAggsTermsSearch.filter( x => !list_words.some( y => normalizarTexto(y) == normalizarTexto(x.key)))
        }
    
        return aggsStore.readAggsTermsSearch.filter(item => normalizarTexto(item.key) !== normalizarTexto(props.firstSearch))
       t
    })
    
    const emits = defineEmits(['addSearch', 'renewSearchText'])

    onMounted( async() => {
        await aggsStore.getAggsTermsSearch(props.terms)
    })

    const addSearch =(item) => {
        if(itemExiste(item)){
            const newTerms = termsAddSearch.value.filter(x => x !== item).join(' ')
            emits('renewSearchText', newTerms)
            listSelectText.value = listSelectText.value.filter(x => x !== item)
            return
        }  
        listSelectText.value.push(item)
        emits('addSearch', item)
    }

    const itemExiste = (item) => {
        return listSelectText.value.includes(item)
    } 
   
</script>

<style scoped>

</style>