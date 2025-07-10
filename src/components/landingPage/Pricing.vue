<template>
  <v-sheet class="py-16" color="grey-lighten-5">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold text-grey-darken-4 mb-6">
          Planos que Cabem no seu <span class="text-blue">Bolso</span>
        </h2>
        <p
          class="text-h6 font-weight-regular text-grey-darken-1 mx-auto mb-8"
          style="max-width: 700px"
        >
          Escolha o plano ideal para acelerar sua aprovação.
        </p>
        <v-btn-toggle v-model="billingCycle" mandatory variant="outlined" divided color="blue">
          <v-btn value="monthly">Mensal</v-btn>
          <v-btn value="annual">Anual (20% off)</v-btn>
        </v-btn-toggle>
      </div>

      <v-row justify="center" align="center">
        <v-col
          v-for="(plan, index) in plans"
          :key="index"
          cols="12"
          md="4"
        >
          <v-card
            class="pricing-card"
            :class="{ 'is-popular': plan.isPopular }"
            :elevation="plan.isPopular ? 8 : 2"
          >
            <v-chip
              v-if="plan.isPopular"
              color="blue"
              class="popular-chip font-weight-bold"
              label
              >Mais Popular</v-chip
            >

            <v-card-text class="pa-8">
              <div class="text-center mb-8">
                <h3 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">
                  {{ plan.name }}
                </h3>
                <p class="text-body-1 text-grey-darken-1 mb-4">
                  {{ plan.description }}
                </p>
                <div class="d-flex align-baseline justify-center">
                  <span class="text-h3 font-weight-bold text-grey-darken-4">{{
                    plan.price
                  }}</span>
                  <span class="text-body-1 text-grey-darken-1 ml-1">{{
                    plan.period
                  }}</span>
                </div>
              </div>

              <v-list bg-color="transparent" class="mb-8">
                <v-list-item
                  v-for="(feature, featureIndex) in plan.features"
                  :key="featureIndex"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-icon icon="mdi-check" color="green" class="mr-3"></v-icon>
                  </template>
                  <v-list-item-title class="text-body-1 text-grey-darken-2">{{
                    feature
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-btn
                :color="plan.isPopular ? 'blue' : 'grey-darken-3'"
                size="large"
                block
                class="font-weight-bold"
                >{{ plan.buttonText }}</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <div class="text-center mt-12">
         <p class="text-grey-darken-1 mb-4">Todos os planos incluem:</p>
         <div class="d-flex flex-wrap justify-center ga-6 text-sm text-grey-darken-2">
           <span>✓ 7 dias grátis</span>
           <span>✓ Cancele quando quiser</span>
           <span>✓ Suporte técnico</span>
           <span>✓ Atualizações gratuitas</span>
         </div>
       </div>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";

const billingCycle = ref("monthly"); // 'monthly' or 'annual'

const plans = ref([
  {
    name: "Básico",
    price: "R$ 29",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "100 questões geradas por mês",
      "Resumos básicos",
      "Acesso à legislação",
      "Suporte por email",
    ],
    isPopular: false,
    buttonText: "Começar Grátis",
  },
  {
    name: "Profissional",
    price: "R$ 79",
    period: "/mês",
    description: "Para concurseiros sérios",
    features: [
      "Questões ilimitadas",
      "Todos os recursos de IA",
      "Mapas mentais e flashcards",
      "Análise de desempenho",
      "Suporte prioritário",
      "Simulados personalizados",
    ],
    isPopular: true,
    buttonText: "Escolher Profissional",
  },
  {
    name: "Premium",
    price: "R$ 149",
    period: "/mês",
    description: "Solução completa",
    features: [
      "Todos os recursos Pro",
      "Mentoria com especialistas",
      "Cronograma personalizado",
      "Acesso antecipado a novos recursos",
      "API para integração",
      "Suporte 24/7",
    ],
    isPopular: false,
    buttonText: "Escolher Premium",
  },
]);
</script>

<style scoped>
.pricing-card {
  position: relative;
  transition: all 0.3s ease-in-out;
  border: 1px solid #e0e0e0;
}
.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}
.pricing-card.is-popular {
  border: 2px solid #1976d2; /* Cor azul do Vuetify */
  transform: scale(1.05);
}
.popular-chip {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}
</style>