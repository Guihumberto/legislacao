<template>
  <div>
     <v-btn
        @click.stop="dialog = true"
        color="grey darken-3"
        variant="text"
        prepend-icon="mdi-information"
    >
        DETALHES
    </v-btn>

    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-notebook"
        :text="concurso.descricao"
        :title="concurso.titulo"
      >
        <div class="my-5 px-5">
            Banca: <br>
            Vagas: <br>
            Data da prova: <br>
        </div>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Fechar"
            @click="dialog = false"
          ></v-btn>
          <v-btn @click="$router.push('homepainel/concurso/1')">Ir</v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  const dialog = ref(false)

  const props = defineProps({
        concurso: {
            type: Object,
            required: true
        }
  })
</script>