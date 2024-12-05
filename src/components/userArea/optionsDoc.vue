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
            @click="actions(item.id)"
          >
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog
          v-model="dialog2"
          activator="parent"
          max-width="1080"
      >
        <DocumentOpen :docs="document" />
    </v-dialog>
    <ComfirmDelete :doc="document" />
  </template>
  
  <script setup>
    import { ref, provide, watch } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    import DocumentOpen from './documentOpen.vue';
    import ComfirmDelete from './comfirmDelete.vue';
    const userAreaStore = useUserAreaStore()

    const dialog2 = ref(false)
    const dialog = ref(false)
    const confirmacao = ref(false)

    provide('dialog', dialog)
    provide('confirmacao', confirmacao)
    
    const items = ([
         {id:1, title: 'Abrir Documento' },
         {id:2, title: 'Excluir' }
    ])

    const props = defineProps({
        document: Object
    })

    const actions = (action) => {
        if(action == 2) {
          dialog.value = true
        }

        if(action == 1) {
          dialog2.value = true
        }
    } 

    watch(confirmacao, (newConfirm) => {
      props.document.active = false
      userAreaStore.removeDoc(props.document)
    })


  </script>
  
  <style lang="scss" scoped>
  
  </style>
  