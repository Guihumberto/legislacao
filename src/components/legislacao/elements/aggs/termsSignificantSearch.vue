<template>
    <v-expand-transition>
        <v-card variant="flat" v-if="!aggsStore.readLoad">
                <h1 class="text-h6">Termos Relevantes relacionados a pesquisa</h1>
                <v-card-text>
                    <v-chip 
                        density="comfortable"
                        color="success"  variant="outlined"
                        @click="addSearch(item.key)" class="mr-1 mb-1" v-for="item, i in aggsStore.readAggsTermsSearch" :key="i">
                        <v-icon icon="mdi-magnify" start></v-icon>
                        {{item.key}}</v-chip>
                </v-card-text>
        </v-card>
    </v-expand-transition>
</template>

<script setup>
    import { onMounted } from 'vue';

    import { useAggsStore } from '@/store/AggsStores';
    const aggsStore = useAggsStore()

    const props = defineProps({
        terms: String
    })
    
    const emits = defineEmits(['addSearch'])

    onMounted( async() => {
        await aggsStore.getAggsTermsSearch(props.terms)
    })

    const addSearch =(item) => {
        emits('addSearch', item)
    }

   


  
   
</script>

<style scoped>

</style>