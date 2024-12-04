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
            @click="removeFav()"
          >
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
  </template>
  
  <script setup>
    import { ref } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    const userAreaStore = useUserAreaStore()
    
    const items = ([
         { title: 'Excluir' }
    ])

    const props = defineProps({
        id: Object
    })

    const removeFav = () => {
        props.id.fav = false
        userAreaStore.saveFavoritos(props.id)
    } 


  </script>
  
  <style lang="scss" scoped>
  
  </style>
  