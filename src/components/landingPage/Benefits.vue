<template>
  <v-sheet class="py-16" color="white">
    <v-container>
      <div class="text-center mb-16">
        <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-4 mb-6">
          Perfeito Para Cada <span class="text-blue">Perfil</span>
        </h2>
        <p
          class="text-h6 font-weight-regular text-grey-darken-1 mx-auto"
          style="max-width: 700px"
        >
          Independente do seu objetivo, temos as ferramentas certas para
          acelerar seu sucesso.
        </p>
      </div>

      <v-row>
        <v-col
          v-for="(type, index) in userTypes"
          :key="index"
          cols="12"
          md="4"
        >
          <v-card
            class="fill-height benefit-card"
            :style="{ '--benefit-color': type.mainColor }"
            elevation="0"
            :color="type.bgColor"
          >
            <v-card-text class="pa-8">
              <v-sheet
                :color="type.mainColor"
                height="48"
                width="48"
                rounded="lg"
                class="d-flex align-center justify-center mb-6"
              >
                <span class="text-white font-weight-bold text-h6">{{
                  index + 1
                }}</span>
              </v-sheet>

              <h3 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">
                {{ type.title }}
              </h3>
              <p class="text-body-1 text-grey-darken-1 mb-6">
                {{ type.subtitle }}
              </p>

              <v-list :bg-color="type.bgColor" class="pa-0 mb-8">
                <v-list-item
                  v-for="(benefit, benefitIndex) in type.benefits"
                  :key="benefitIndex"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-icon
                      icon="mdi-check-circle"
                      :color="type.mainColor"
                      class="mr-3"
                    ></v-icon>
                  </template>
                  <v-list-item-title class="text-body-1 text-grey-darken-2">{{
                    benefit
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-btn
                :color="type.mainColor"
                block
                size="large"
                class="font-weight-bold"
                >Experimente Grátis</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";

const userTypes = ref([
  {
    title: "Concurseiros",
    subtitle: "Acelere sua aprovação",
    benefits: [
      "Questões específicas por banca e cargo",
      "Estatísticas de cobrança por tema",
      "Simulados personalizados",
      "Cronograma de estudos inteligente",
    ],
    mainColor: "blue",
    bgColor: "blue-lighten-5",
  },
  {
    title: "Advogados OAB",
    subtitle: "Domine o exame da Ordem",
    benefits: [
      "Questões OAB de todas as fases",
      "Jurisprudência atualizada",
      "Peças processuais comentadas",
      "Dicas práticas para 2ª fase",
    ],
    mainColor: "yellow-darken-3",
    bgColor: "yellow-lighten-5",
  },
  {
    title: "Profissionais",
    subtitle: "Mantenha-se atualizado",
    benefits: [
      "Atualizações legislativas automáticas",
      "Análises práticas de mudanças",
      "Resumos executivos",
      "Alertas personalizados",
    ],
    mainColor: "green",
    bgColor: "green-lighten-5",
  },
]);
</script>

<style scoped>
.benefit-card {
  border: 1px solid #eee;
  transition: all 0.3s ease-in-out;
  border-top: 4px solid var(--benefit-color);
}
.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
}
</style>