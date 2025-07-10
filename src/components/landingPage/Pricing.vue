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
          <!-- <v-btn value="annual">Anual (20% off)</v-btn> -->
        </v-btn-toggle>
      </div>

      <v-row justify="center" align="stretch">
          <v-col cols="12" md="6" lg="4" v-for="plan in pricingPlans" :key="plan.title" class="mb-5">
              <PricingCard
                :title="plan.title"
                :price="plan.price"
                :description="plan.description"
                :features="plan.features"
                :buttonText="plan.buttonText"
                :isPopular="plan.isPopular"
                :isEnterprise="plan.isEnterprise"
                @button-click="handlePlanSelection(plan.title)"
              >
              <template #icon>
                  <v-icon :color="plan.isPopular ? 'primary' : 'grey-darken-1'" :icon="plan.icon" size="32"></v-icon>
              </template>
              </PricingCard>
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
import { ref } from 'vue';
import PricingCard from '@/components/concursos/public/PricingCard.vue'; // Importe o componente


import { useGeralStore } from '@/store/GeralStore';    
import { useRouter } from 'vue-router';
const geralStore = useGeralStore()
const router = useRouter()

const billingCycle = ref("monthly"); // 'monthly' or 'annual'
// Dados dos planos de preços
const pricingPlans = ref([
  {
    title: 'Básico',
    price: 'R$0,00',
    description: 'Ideal para quem está começando.',
    features: [
      'importar até 5 Normas',
      'Comentários',
      'Questões limitadas',
      'Resumos limitados',
      'Suporte básico por e-mail',
    ],
    buttonText: 'Começar Agora',
    isPopular: false,
    isEnterprise: false,
    icon: 'mdi-rocket-launch-outline' // Ícone do Material Design
  },
  {
    title: 'Pro',
    price: 'R$49',
    description: 'Perfeito para quem precisa de mais poder e suporte.',
    features: [
      'Tudo do Básico',
      'Importação ilimitada de normas',
      'Suporte prioritário',
      'Geração de questões',
      'Geração de resumos',
      'Geração de esquemas',
      'Análises em tempo real',
      'Estatísticas',
      'Colaboração em equipe'
    ],
    buttonText: 'Escolher o Pro',
    isPopular: true,
    isEnterprise: false,
    icon: 'mdi-star-circle-outline'
  },
  {
    title: 'Grupo',
    price: 'R$199',
    description: 'Adicione até 5 amigos.',
    features: [
      'Tudo do básico',
      'Tudo do Pro',
      'Valor Diferenciado',
      'Administre seu grupo',
    ],
    buttonText: 'Escolher Grupo',
    isPopular: false,
    isEnterprise: true,
    icon: 'mdi-account-multiple'
  }
]);

// Função para lidar com o clique no botão
const handlePlanSelection = (planTitle) => {
  if(planTitle == "Básico") {
    router.push('/login')
  } else {
    router.push(`/assinar?plan=${planTitle}`)
  }
}
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