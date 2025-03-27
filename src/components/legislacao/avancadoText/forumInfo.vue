<template>
      <v-btn @click="dialog = true" class="ml-1" variant="text" icon="mdi-help-circle"></v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-forum"
          text="A partir da norma, crie um grupo para comentar os dispositivos, fazer ou responder a perguntas, explicar artigos entre outras coisas."
          title="Abrir Discussão"
        >
            <v-card-text>
                <v-alert icon="mdi-wrench-outline">Em construção...</v-alert>
            </v-card-text>
            <template v-slot:actions>
                <v-btn
                class="ms-auto"
                text="Fechar"
                @click="dialog = false"
                ></v-btn>
            </template>
        </v-card>
      </v-dialog>
  </template>
  <script setup>
    import { ref } from 'vue'
  
    const dialog = ref(false)
  </script>