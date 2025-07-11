<template>
  <div class="text-center pa-4">
    <v-btn @click="dialog = true" color="primary">
      INÍCIO RÁPIDO
    </v-btn>
  </div>

  <v-dialog
    v-model="dialog"
    persistent
    max-width="800px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Guia Rápido</span>
      </v-card-title>

      <v-card-text>
        <v-stepper
          v-model="step"
          :items="tutorialSteps.map(s => s.title)"
          show-actions
          alt-labels
        >
          <template v-slot:item="{ item }">
            <v-card variant="text">
                {{ item }}
              <v-row class="ma-4" align="center" justify="center">
                <v-col cols="12">
                  <v-img
                     :src="tutorialSteps[step - 1]?.image"
                    height="250px"
                    contain
                    class="rounded-lg"
                  ></v-img>
                </v-col>
                <v-col cols="12">
                  <h2 class="text-h6 mb-3">{{ tutorialSteps[step - 1]?.title }}</h2>
                  <p class="text-body-1" v-html="tutorialSteps[step - 1]?.description ">
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </template>

          <template v-slot:actions="{ prev, next }">
            <v-card-actions class="px-4 pb-4">
              <v-btn
                @click="prev"
                :disabled="step === 1"
              >
                Anterior
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                v-if="step < tutorialSteps.length"
                @click="next"
                color="primary"
           
              >
                Próximo
              </v-btn>
              <div v-else class="d-flex ga-2">
                  <v-btn
                    @click="finishTutorial"
                    color="success"
                  >
                    Finalizar
                  </v-btn>
                   <v-checkbox
                    v-model="dontShowAgain"
                    label="Não mostrar novamente"
                    hide-details
                    color="error"
                    density="compact"
                  ></v-checkbox>
              </div>

              
            </v-card-actions>
          </template>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import step2 from '/steps/Step2.png';
import step3 from '/steps/Step3.png';
import step4 from '/steps/Step4.png';
import step5 from '/steps/step5.png';


const dialog = ref(false); // Controla a visibilidade do diálogo
const step = ref(1); // Controla a etapa atual do stepper
const dontShowAgain = ref(false); // Controla se o usuário não deseja mais ver o tutorial

// Conteúdo de cada etapa do tutorial
// Usei placeholders do Unsplash para as imagens. Substitua pelas URLs das suas imagens.
const tutorialSteps = ref([
  {
    id: 1,
    title: '1. Iniciando com o "Estudo da Lei"',
    description: `
        Primeiro, você irá escolher a norma desejada, depois importá-la para sua área e, finalmente, poderá utilizá-la. A área <b>"Minhas Normas"</b> é onde ficam todas as normas que você já adicionou.
        <br> <b>Obs.</b> As normas que você importa são suas, e nao podem ser modificadas ou visualizadas por outros usuários a não ser que você compartilhe com autorização.
        `,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600'
  },
  {
    id: 2,
    title: '2. Como Escolher a Norma',
    description: 'Navegue pela nossa biblioteca de normas. Você pode usar a barra de pesquisa ou os filtros por categoria para encontrar a norma específica que você deseja iniciar o estudo.',
    image: step2
  },
  {
    id: 3,
    title: '3. Como Importar a Norma',
    description: 'Após encontrar a norma desejada, clique no botão <b>"Importar"</b>. Ela será automaticamente adicionada à sua área pessoal <b>"Minhas Normas"</b> para fácil acesso.',
    image: step3
  },
  {
    id: 4,
    title: '4. Como Acessar a Norma',
    description: 'Vá para a seção <b>"Minhas Normas"</b> no barra lateral esquerda. É necessário fazer login antes. Lá, você verá uma lista de todas as suas normas importadas. É possível organiza-las em pastas. Clique em qualquer uma delas para abrir e começar a usar.',
    image: step4
  },
  {
    id: 5,
    title: '5. Explore a Área de Estudo',
    description: 'A área de estudo é onde a mágica acontece. Aqui você pode ler a norma, fazer anotações, destacar trechos importantes e usar as ferramentas interativas, gerar questões, mapas mentais e tudo que o sistema oferece.',
    image: step5
  }
]);

/**
 * Retorna o conteúdo da etapa com base no seu ID (valor).
 * @param {number} stepValue - O ID da etapa atual.
 */


/**
 * Fecha o diálogo e reseta o passo para o início.
 */
const finishTutorial = () => {
  dialog.value = false;
  // Opcional: resetar para o primeiro passo na próxima vez que abrir
  setTimeout(() => {
    step.value = 1;
  }, 300); // Pequeno delay para a animação de fechar
};

watch(dontShowAgain, (newValue) => {
    localStorage.setItem('tutorialShown', newValue);
})


const showTutorialAutomatic = () => {
    setTimeout(() => {
        dialog.value = true;
    }, 1000);
}

onMounted(() => {
    const tutorialShown = localStorage.getItem('tutorialShown');
    if (tutorialShown !== 'true') {
      showTutorialAutomatic()
    }
});
</script>

<style scoped>
/* Estilos opcionais para customizar o componente */
.v-card-title {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
.text-body-1 {
  line-height: 1.6;
}
</style>