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
          v-model="dialog"
          activator="parent"
          max-width="1080"
      >
        <DocumentOpen :docs="document" />
    </v-dialog>
  </template>
  
  <script setup>
    import { ref } from 'vue';

    import { useUserAreaStore } from '@/store/AreaUserStore';
    import DocumentOpen from './documentOpen.vue';
    const userAreaStore = useUserAreaStore()

    const dialog = ref(false)
    
    const items = ([
         {id:1, title: 'Abrir Documento' },
         {id:2, title: 'Excluir' }
    ])

    const props = defineProps({
        document: Object
    })

    const actions = (action) => {
        if(action == 2) {
          props.document.active = false
          userAreaStore.removeDoc(props.document)
        }

        if(action == 1) {
          dialog.value = true
        }
    } 


  </script>
  
  <style lang="scss" scoped>
  
  </style>
  