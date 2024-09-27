<template>
    <div class="text-center pa-4">
      <v-btn prepend-icon="mdi-information-outline" @click="dialog = true" variant="text" color="primary" class="text-capitalize">
        <small>Sobre</small> 
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-information-outline"
          text="O Sistema de Avaliação de Desempenho Individual da SEFAZ MA é uma aplicação desenvolvida internamente pela COTEC."
          title="Sobre"
        >
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Fechar"
              @click="dialog = false"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>