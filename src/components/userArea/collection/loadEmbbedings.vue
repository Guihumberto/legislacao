<template>
    <div class="text-center pa-4">
      <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
      >  
        <v-card
          prepend-icon="mdi-upload"
          text="Estamos preaprando a legislação para o chat arcádio."
          title="Aguarde..."
        >
          <template v-slot:actions>
            <v-progress-linear
                class="mr-10"
                color="cyan"
                indeterminate
            ></v-progress-linear>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </template>

  <script setup>
    import { inject } from 'vue';
    const dialog = inject('dialog')
    
  </script>