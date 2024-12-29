<template>
      <v-menu location="top">
        <template v-slot:activator="{ props }">
          <v-btn density="compact" variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            link
             @click="actions(item.id)"
          >
            <template v-slot:prepend>
                <v-icon>
                    {{ item.icon }}
                </v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <ComfirmDelete :doc="document" />
  </template>
  <script setup>
        import ComfirmDelete from '@/components/userArea/comfirmDelete.vue';
        import { ref, provide, watch } from 'vue';

        const items = [
          // { id:1, title: 'Editar', icon: 'mdi-pencil'},
          { id:2, title: 'Excluir', icon: 'mdi-delete' },
        ]

        const dialog = ref(false)
        const confirmacao = ref(false)

        provide('dialog', dialog)
        provide('confirmacao', confirmacao)

        const props = defineProps({
            document: true
        })

        const actions = (action) => {
              if(action == 2) {
                dialog.value = true
              }

              if(action == 1) {
                // dialog2.value = true
                console.log('editar')
              }
        } 

        const emit = defineEmits(['apagarRef', 'apagarRefDoc'])

        watch(confirmacao, (newConfirm) => {
          if(typeof props.document === 'string') emit("apagarRef", props.document)
          if(typeof props.document === 'object') emit("apagarRefDoc", props.document)
        })

  </script>