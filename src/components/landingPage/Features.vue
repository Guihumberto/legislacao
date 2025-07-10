<template>
  <v-sheet class="py-16" color="grey-lighten-4">
    <v-container>
      <div class="text-center mb-16">
        <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-4 mb-6">
          Recursos que Fazem a <span class="text-blue">Diferença</span>
        </h2>
        <p
          class="text-h6 font-weight-regular text-grey-darken-1 mx-auto"
          style="max-width: 700px"
        >
          Uma suíte completa de ferramentas alimentadas por IA para revolucionar
          sua preparação para concursos e exames da OAB.
        </p>
      </div>

      <v-row>
        <v-col
          v-for="(feature, index) in features"
          :key="index"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-card
            class="feature-card text-center pa-4 fill-height"
            elevation="0"
            border
          >
            <div class="d-flex justify-center mb-6">
              <v-sheet
                color="blue"
                rounded="lg"
                class="d-flex align-center justify-center pa-6 feature-icon-sheet"
              >
                <v-icon :icon="feature.icon" size="40" color="white"></v-icon>
              </v-sheet>
            </div>
            <v-card-title
              class="text-h6 font-weight-bold text-grey-darken-4 mb-2 feature-title text-wrap"
              >{{ feature.title }}</v-card-title
            >
            <v-card-text class="text-body-1 text-grey-darken-1">
              {{ feature.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";

const features = ref([
  {
    icon: "mdi-book-open-page-variant-outline",
    title: "Estudo Inteligente da Legislação",
    description:
      "Navegue e estude toda a legislação brasileira com recursos de busca avançada e organização inteligente.",
  },
  {
    icon: "mdi-file-document-edit-outline",
    title: "Gerador de Questões IA",
    description:
      "Crie questões personalizadas para qualquer artigo da norma usando nossa IA avançada.",
  },
  {
    icon: "mdi-database-import-outline",
    title: "Importação de Questões",
    description:
      "Importe automaticamente questões de todas as principais bancas examinadoras via IA.",
  },
  {
    icon: "mdi-text-box-search-outline",
    title: "Resumos Automáticos",
    description:
      "Gere resumos precisos e didáticos de qualquer dispositivo legal ou tema jurídico.",
  },
  {
    icon: "mdi-calendar-text-outline",
    title: "Comentários por Dispositivo",
    description:
      "Acesse comentários especializados para cada artigo e dispositivo legal.",
  },
  {
    icon: "mdi-cards-outline",
    title: "Flashcards Inteligentes",
    description:
      "Crie e estude com flashcards gerados automaticamente para otimizar sua memorização.",
  },
  {
    icon: "mdi-sitemap-outline",
    title: "Mapas Mentais IA",
    description:
      "Visualize conexões entre temas jurídicos com mapas mentais gerados por inteligência artificial.",
  },
  {
    icon: "mdi-gavel",
    title: "Conexão Jurisprudencial",
    description:
      "Conecte-se diretamente com a jurisprudência relevante para cada tema estudado.",
  },
]);
</script>

<style scoped>
.feature-card {
  transition: all 0.3s ease-in-out;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
}
.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  background-color: white;
}
.feature-icon-sheet {
  transition: transform 0.3s ease-in-out;
}
.feature-card:hover .feature-icon-sheet {
  transform: scale(1.1);
}
.feature-title {
  transition: color 0.3s ease-in-out;
}
.feature-card:hover .feature-title {
  color: #1976d2; /* Cor azul do Vuetify */
}
</style>