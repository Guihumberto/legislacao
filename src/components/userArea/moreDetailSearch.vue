<template>
    <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            color="grey"
            v-bind="props"
            variant="text"
            icon="mdi-dots-vertical"
            title="compartilhar"
          >
          </v-btn>
        </template>
        <v-list class="my-0 py-0">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
            @click="detailMore()"
          >
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
        <v-dialog v-model="dialog">
          <div class="d-flex justify-center">
            <v-card width="500">
              <v-card-title>Detalhes da busca</v-card-title>
              <v-card-text>
                Campo de busca: {{ search.text_search }} <br>
                <span v-if="search.years.length"> Período: {{ search.years }} <br></span> 
                <span v-if="search.years.sources"> Fonte: {{ search.sources }} <br></span> 
                Precisão: {{ search.precision ? "sim" : 'Não' }} <br>
                {{ search.termos == 2 ? "Termos" : "Frase exata" }} <br>
                {{ search.date }} <br>
              </v-card-text>
            </v-card>
          </div>
        </v-dialog>
  </template>
  
  <script setup>
    import { ref } from 'vue';

    const dialog = ref(false)
    
    const items = ([
         { title: 'Mais detalhe da busca' }
    ])

    const props = defineProps({
        search: Object
    })

    const detailMore = () => {
       dialog.value = true
    } 


  </script>
  
  <style lang="scss" scoped>
  
  </style>
  