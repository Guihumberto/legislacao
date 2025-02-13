<template>
    <v-expand-transition>
        <v-sheet
            class="mx-auto mt-3"
            elevation="2"
            rounded="xl"
            v-if="!aggsStore.readLoad && termsSignificantes.length"
        >
            <v-sheet
            class="py-1 px-5 bg-primary text-left"
            rounded="t-xl"
            > <h1 class="text-overline">Termos Relevantes relacionados a pesquisa</h1>
            </v-sheet>

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
        </v-sheet>
        <!-- <v-card variant="flat" v-if="!aggsStore.readLoad">
            <v-card-title>
                <h1 class="text-overline">Termos Relevantes relacionados a pesquisa</h1>
            </v-card-title>
                <v-card-text>
                    <v-col cols="auto">
                        <v-chip 
                            density="comfortable"
                            color="grey-lighten-2"  variant="elevated"
                            @click="addSearch(item.key)" class="mr-1 mb-1" v-for="item, i in termsSignificantes" :key="i">
                            <v-icon icon="mdi-magnify" start></v-icon>
                            {{item.key}}</v-chip>
                    </v-col>
                </v-card-text>
        </v-card> -->
    </v-expand-transition>
</template>

<script setup>
    import { onMounted, computed, ref } from 'vue';

    import { useAggsStore } from '@/store/AggsStores';
    const aggsStore = useAggsStore()

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

    const termsSignificantes = computed(() => {
        const list = aggsStore.readAggsTermsSearch.filter(item => item.key !== props.firstSearch)
        return list
    })
    
    const emits = defineEmits(['addSearch'])

    onMounted( async() => {
        await aggsStore.getAggsTermsSearch(props.terms)
    })

    const addSearch =(item) => {
        if(itemExiste(item)){
            console.log('item', termsAddSearch.value);
            // const newTerms = props.terms.split(' ').filter(item => item !== item).join(' ')
            // console.log('teste', props.terms);
            // emits('addSearch', newTerms)
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