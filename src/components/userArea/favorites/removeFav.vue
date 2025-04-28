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
            @click="actionBtn(item.id)"
          >
            <template v-slot:prepend
            > <v-icon>{{ item.icon }}</v-icon> </template>
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <ComfirmDelete :doc="id" />
  </template>
  
  <script setup>
    import { provide, ref, watch } from 'vue';
    
    import ComfirmDelete from '../comfirmDelete.vue';

    import { useFavStore } from '@/store/FavStore';
    const favStore = useFavStore()

    import { useSnackStore } from '@/store/snackStore';
    const snackStore = useSnackStore()
  
    const items = ([
         { id: 1, title: 'Copiar Link', icon: 'mdi-content-copy' },
         { id: 2, title: 'Excluir', icon: 'mdi-delete' }
    ])

    const dialog = ref(false)
    const confirmacao = ref(false)

    provide('dialog', dialog)
    provide('confirmacao', confirmacao)

    const props = defineProps({
        id: Object
    })

    const actionBtn = (id) => {
      if(id == 1) copyLink()
      if(id == 2) removeFav()
    }

    const copyLink = () => {
      let section = props.id.section == 'law' ? 'text' : 'textpage'
      navigator.clipboard.writeText(`https://legislacao.estudodalei.com.br/${section}/${props.id.id}`)
      snackStore.activeSnack('Link copiado', 'success')
    }

    const removeFav = () => {
        dialog.value = true
    } 

    watch(confirmacao, async (newConfirm) => {
      await favStore.deleteFav(props.id.idU)
      props.id.fav = false
    })

  </script>
  
  <style lang="scss" scoped>
  
  </style>
  