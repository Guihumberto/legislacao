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
      <ComfirmDelete :doc="id" />
  </template>
  
  <script setup>
    import { provide, ref, watch } from 'vue';
    
    import ComfirmDelete from './comfirmDelete.vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    const userAreaStore = useUserAreaStore()
  
    const items = ([
         { title: 'Excluir' }
    ])

    const dialog = ref(false)
    const confirmacao = ref(false)

    provide('dialog', dialog)
    provide('confirmacao', confirmacao)

    const props = defineProps({
        id: Object
    })

    const removeFav = () => {
        dialog.value = true
    } 

    watch(confirmacao, (newConfirm) => {
       props.id.fav = false
       userAreaStore.saveFavoritos(props.id)
    })


  </script>
  
  <style lang="scss" scoped>
  
  </style>
  