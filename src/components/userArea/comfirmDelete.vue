<template>
    <v-dialog
    v-model="dialog"
    width="auto"
    >
        <v-card
            max-width="400"
            prepend-icon="mdi-delete"
            text="Tem certeza que deseja apagar esse registro?"
            title="Confirmação"
        >
        <v-card-text>
            <!-- <small class="pa-2 bg-blue-lighten-4">{{ doc.norma }}</small> -->
        </v-card-text>
            <template v-slot:actions>
            <v-btn
                class="ms-auto"
                text="Cancelar"
                prepend-icon="mdi-close"
                @click="dialog = false"
            ></v-btn>
            <v-btn
                class="ms-auto"
                color="red"
                prepend-icon="mdi-delete"
                text="Apagar o registro"
                @click="apagarRegistro()"
            ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
  <script setup>
    import { inject } from 'vue';

    const props = defineProps({
        doc:Object
    })

    const dialog = inject('dialog')
    const confirmacao = inject('confirmacao')

    const apagarRegistro = () => {
        confirmacao.value = true
        dialog.value = false
    }

  </script>