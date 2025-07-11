<template>
    <v-btn
      @click="dialog = true"
      color="red"
      prepend-icon="mdi-youtube"
    >
      Demonstração
    </v-btn>

  <v-dialog v-model="dialog" max-width="900px">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start color="red">mdi-youtube</v-icon>
        <span class="text-h6">Demonstração</span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="dialog = false"
        ></v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-responsive :aspect-ratio="16/9">
          <iframe
            v-if="dialog"
            width="100%"
            height="100%"
            :src="videoUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </v-responsive>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

// Controle de estado para o diálogo
const dialog = ref(false);

// ID do vídeo do YouTube a ser exibido
const videoId = 'h7JDeHcEAlU'; // ID extraído da URL https://www.youtube.com/watch?v=h7JDeHcEAlU

// URL computada para o iframe. Retorna uma string vazia quando o diálogo está fechado
// para garantir que o vídeo pare de tocar em segundo plano.
const videoUrl = computed(() => {
  return dialog.value ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
});
</script>

<style scoped>
/* Estilos para garantir que o conteúdo do card não tenha preenchimento extra */
.v-card-text {
  padding: 0 !important;
}
</style>