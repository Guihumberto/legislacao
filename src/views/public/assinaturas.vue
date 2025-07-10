<template>
  <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
                <v-container class="py-6 my-5">
                    <h1 class="text-h3 font-weight-bold text-center mb-4">Planos e Preços</h1>
                    <p class="text-body-1 text-medium-emphasis text-center mx-auto mb-12" style="max-width: 800px;">
                    Escolha o plano perfeito que se adapta às suas necessidades. Todos os planos incluem funcionalidades incríveis para impulsionar seu sucesso.
                    </p>

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
                </v-container>
            </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import PricingCard from '@/components/concursos/public/PricingCard.vue'; // Importe o componente


import { useGeralStore } from '@/store/GeralStore';    
import { useRouter } from 'vue-router';
const geralStore = useGeralStore()
const router = useRouter()

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

<style>
/* Estilos globais para a página, se necessário */
body {
  font-family: 'Roboto', sans-serif;
}
</style>