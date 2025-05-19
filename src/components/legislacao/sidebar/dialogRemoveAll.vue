<template>
    <div class="text-center pa-4">
      <v-btn @click="dialog = true">
        Open Dialog
      </v-btn>
  
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          prepend-icon="mdi-update"
          text="Isso excluíra definiticamente este registro da sua busca."
          title="Excluir Registro"
        >
          <template v-slot:actions>
            <v-btn @click="dialog = false">cancelar</v-btn>
            <v-btn
              class="ms-auto"
              text="Excluir"
              @click="dialog = false"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>

<script setup>

</script>

<style scoped>

</style>