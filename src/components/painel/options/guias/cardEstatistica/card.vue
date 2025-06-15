<template>
  <div 
    :style="{ transform: `scale(${scaleValue})` }"
    style="transform-origin: top left;"
  >
    <v-card 
      class="mx-auto stats-card" 
      elevation="8"
      :style="{ background: cardGradient }"
      width="400px"
    >
      <!-- Header do Card -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon color="primary" size="28" class="mr-3">mdi-poll</v-icon>
          <span class="text-h6 font-weight-bold">Estatísticas</span>
        </div>
        <v-chip 
          :color="getPerformanceColor()" 
          variant="flat" 
          size="small"
          class="font-weight-bold"
        >
          {{ getPerformanceLabel() }}
        </v-chip>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Conteúdo Principal -->
      <v-card-text class="pa-6" style="min-height: 500px;">
        <div class="mb-5">
          <b>{{ item.cardItem.disciplina }}</b> <br>
          {{ item.cardItem.title }}
        </div>
        <!-- Progresso Circular Principal -->
        <div class="text-center mb-6">
          <v-progress-circular
            :model-value="successPercentage"
            :size="120"
            :width="12"
            :color="getPerformanceColor()"
            class="mb-4"
          >
            <div class="text-center">
              <div class="text-h4 font-weight-bold">{{ Math.round(successPercentage) }}%</div>
              <div class="text-caption text-medium-emphasis">Taxa de Acerto</div>
            </div>
          </v-progress-circular>
        </div>

        <!-- Grid de Estatísticas -->
        <v-row class="mb-4">
          <!-- Acertos -->
          <v-col cols="12" sm="4">
            <v-card 
              variant="tonal" 
              color="success"
              class="text-center pa-2 stat-mini-card"
              @click="showCorrectDetails = !showCorrectDetails"
              style="cursor: pointer;"
            >
              <v-icon size="32" class="mb-2">mdi-check-circle</v-icon>
              <div class="text-h5 font-weight-bold text-success">{{ stats.total_correct }}</div>
              <div class="text-body-2 text-medium-emphasis">Acertos</div>
            </v-card>
          </v-col>
          <!-- Erros -->
          <v-col cols="12" sm="4">
            <v-card 
              variant="tonal" 
              color="error"
              class="text-center pa-2 stat-mini-card"
              @click="showErrorDetails = !showErrorDetails"
              style="cursor: pointer;"
            >
              <v-icon size="32" class="mb-2">mdi-close-circle</v-icon>
              <div class="text-h5 font-weight-bold text-error">{{ stats.total_incorrect }}</div>
              <div class="text-body-2 text-medium-emphasis">Erros</div>
            </v-card>
          </v-col>
          <!-- Total -->
           <v-col cols="12" sm="4">
            <v-card 
              variant="tonal" 
              color="warning"
              class="text-center pa-2 stat-mini-card"
              @click="showDetails = !showDetails"
              style="cursor: pointer;"
              v-if="stats?.total_partial"
            >
              <v-icon size="32" class="mb-2">mdi-fraction-one-half</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.total_partial }}</div>
              <div class="text-body-2 text-medium-emphasis">Parcial</div>
            </v-card>
            <v-card 
              variant="tonal" 
              color="primary"
              class="text-center pa-2 stat-mini-card"
              @click="showDetails = !showDetails"
              style="cursor: pointer;"
              v-else
            >
              <v-icon size="32" class="mb-2">mdi-format-list-numbered</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
              <div class="text-body-2 text-medium-emphasis">Total</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Barra de Progresso Linear -->
        <div class="mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-medium">Progresso Geral</span>
            <span class="text-body-2 text-medium-emphasis">
              {{ stats.total_correct + stats.total_incorrect + stats?.total_partial  }}/{{ stats.total }}
            </span>
          </div>
          <v-progress-linear
            :model-value="progressPercentage"
            :color="getPerformanceColor()"
            height="8"
            rounded
            striped
          ></v-progress-linear>
        </div>

        <!-- Detalhes Expansíveis -->
        <v-expand-transition>
          <div v-if="showDetails">
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <v-icon color="success" size="20">mdi-trending-up</v-icon>
                  <div class="text-caption">Melhor Streak</div>
                  <div class="text-body-1 font-weight-bold">{{ bestStreak }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <v-icon color="info" size="20">mdi-clock-outline</v-icon>
                  <div class="text-caption">Última Atividade</div>
                  <div class="text-body-1 font-weight-bold">{{ lastActivity }}</div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Ações -->
      <v-card-actions class="pa-4">
        <v-btn
          @click="resumoTexto(stats.questoes, item.typeGuide)"
          color="primary"
          variant="elevated"
          class="flex-grow-1"
          prepend-icon="mdi-play-circle"
          disabled
        >
          Continuar Estudos
        </v-btn>
        
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="primary"
              variant="text"
              icon="mdi-dots-vertical"
              class="ml-2"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item @click="resetStats">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-refresh</v-icon>
                Resetar Estatísticas
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="exportStats">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-download</v-icon>
                Exportar Dados
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareStats">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-share</v-icon>
                Compartilhar
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-actions>
    </v-card>

    <!-- Snackbar para feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, inject, watch } from 'vue'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const scaleValue = ref(1) // 80% do tamanho original

const rightWidth = inject('rightWidth')

watch(rightWidth, (newWidth) => {
  if(rightWidth.value < 600) {
    scaleValue.value = 0.8
  } else{
    scaleValue.value = 1
  }
})

// Emits
const emit = defineEmits(['resumo-texto'])

// Reactive data
const showDetails = ref(false)
const showCorrectDetails = ref(false)
const showErrorDetails = ref(false)
const bestStreak = ref(5) // Simulado - você pode calcular isso baseado nos dados reais
const lastActivity = ref('Hoje')
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Computed
const stats = computed(() => {
  return tratarQuestoesFlashCards(props.item)
})

const successPercentage = computed(() => {
  if (stats.value.total === 0) return 0
  return stats.value?.total_partial 
  ? ((stats.value.total_correct + (stats.value.total_partial/2)) / stats.value.total) * 100
  : (stats.value.total_correct / stats.value.total) * 100
})

const progressPercentage = computed(() => {
  if (stats.value.total === 0) return 0
  return stats.value?.total_partial 
  ? ((stats.value.total_correct + stats.value.total_incorrect + stats.value.total_partial) / stats.value.total) * 100
  : ((stats.value.total_correct + stats.value.total_incorrect) / stats.value.total) * 100
})

const cardGradient = computed(() => {
  const percentage = successPercentage.value
  if (percentage >= 80) {
    return 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)'
  } else if (percentage >= 60) {
    return 'linear-gradient(135deg, #fff3e0 0%, #fefefe 100%)'
  } else {
    return 'linear-gradient(135deg, #ffebee 0%, #fefefe 100%)'
  }
})

// Methods
const getPerformanceColor = () => {
  const percentage = successPercentage.value
  if (percentage >= 80) return 'success'
  if (percentage >= 60) return 'warning'
  return 'error'
}

const getPerformanceLabel = () => {
  const percentage = successPercentage.value
  if (percentage >= 90) return 'Excelente'
  if (percentage >= 80) return 'Muito Bom'
  if (percentage >= 70) return 'Bom'
  if (percentage >= 60) return 'Regular'
  return 'Precisa Melhorar'
}

const resumoTexto = (questoes, typeGuide) => {
  emit('resumo-texto', questoes, typeGuide)
}

const resetStats = () => {
  // Implementar lógica de reset
  snackbar.value = {
    show: true,
    text: 'Estatísticas resetadas com sucesso!',
    color: 'success'
  }
}

const exportStats = () => {
  // Implementar lógica de export
  const data = {
    total: stats.value.total,
    acertos: stats.value.total_correct,
    erros: stats.value.total_incorrect,
    porcentagem: Math.round(successPercentage.value),
    data: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'estatisticas-questoes.json'
  a.click()
  URL.revokeObjectURL(url)
  
  snackbar.value = {
    show: true,
    text: 'Estatísticas exportadas!',
    color: 'info'
  }
}

const shareStats = async () => {
  const shareData = {
    title: 'Minhas Estatísticas de Estudo',
    text: `Consegui ${stats.value.total_correct} acertos em ${stats.value.total} questões (${Math.round(successPercentage.value)}% de aproveitamento)!`,
  }
  
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: copiar para clipboard
      await navigator.clipboard.writeText(shareData.text)
      snackbar.value = {
        show: true,
        text: 'Estatísticas copiadas para a área de transferência!',
        color: 'success'
      }
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Erro ao compartilhar',
      color: 'error'
    }
  }
}

// Assumindo que você já tem essa função implementada
const tratarQuestoesFlashCards = (item) => {
  const { total, total_correct, total_incorrect, total_partial } = item
  return {
    total,
    total_correct,
    total_incorrect,
    total_partial,
    questoes: []
  }
}

// Lifecycle
onMounted(() => {
  // Animação de entrada suave
  setTimeout(() => {
    showDetails.value = false
  }, 1000)
})

</script>

<style scoped>
.card-container {
  width: 100%;
  overflow: hidden;
}
.stats-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.stat-mini-card {
  transition: all 0.2s ease;
  border-radius: 12px !important;
}

.stat-mini-card:hover {
  transform: scale(1.02);
}

.v-progress-circular {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.v-card-title {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.v-card-actions {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}
</style>