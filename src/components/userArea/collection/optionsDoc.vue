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
            <template v-slot:prepend
            > <v-icon>{{ item.icon }}</v-icon> </template>
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
    import ComfirmDelete from './../comfirmDelete.vue';
    const userAreaStore = useUserAreaStore()

    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()

    const dialog3 = ref(false)
    const dialog2 = ref(false)
    const dialog = ref(false)
    const confirmacao = ref(false)

    provide('dialog2', dialog2)
    provide('dialog', dialog)
    provide('confirmacao', confirmacao)
    
    const items = ([
         { id:1, title: 'Abrir Documento', icon: 'mdi-open-in-new' },
         { id: 2, title: 'Copiar Link', icon: 'mdi-content-copy' },
         { id:3, title: 'Excluir', icon: 'mdi-delete' }
    ])

    const props = defineProps({
        document: Object
    })

    const actions = (action) => {
        if(action == 3) dialog.value = true
        if(action == 2) copyLink()
        if(action == 1) dialog2.value = true
        if(action == 3) dialog3.value = true
    } 

    const copyLink = () => {
      navigator.clipboard.writeText(`https://legislacao.estudodalei.com.br/document/${props.document.id}`)
      snackStore.activeSnack('Link copiado', 'success')
    }

    watch(confirmacao, (newConfirm) => {
      props.document.active = false
      userAreaStore.editDoc(props.document)
    })


  </script>
  
  <style lang="scss" scoped>
  
  </style>
  