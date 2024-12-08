<template>
    <v-expand-transition>
        <div v-if="load">
            Carregando...
        </div>
        <div class="mb-5" v-if="resultsSearch.length">
            <v-list class="ma-0 pa-0">
                <v-list-subheader>Resultado da Busca</v-list-subheader>
                <v-list-item 
                    v-for="item, i in resultsSearch.map(x => x._source)" :key="i"
                    link
                    :to="`text/${item.id}`"
                >
                {{ item.title }} <br>
                <small>{{item.tipo}}</small>
                <template v-slot:append>
                    <v-btn variant="text" icon="mdi-information"> 
                    </v-btn>
                </template>
                </v-list-item>
            </v-list>
        </div>
    </v-expand-transition>
</template>

<script setup>
    const props = defineProps({
        resultsSearch: Array, 
        load: Boolean
    })


   
</script>