<template>
  <v-container class="d-flex justify-center align-start" style="min-height: 50vh;">
    <div class="flashcard-container">
        <!-- Header com progresso -->
        <div class="progress-header mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <h3 class="text-h6 font-weight-medium">
              Flash Cards
            </h3>
            <div class="text-caption text-medium-emphasis">
              {{ currentIndex + 1 }} de {{ flashcards.length }}
            </div>
          </div>
          
          <v-progress-linear
            :model-value="progressPercentage"
            color="primary"
            height="6"
            rounded
          ></v-progress-linear>
          
          <div class="d-flex justify-center mt-2">
            <small class="text-medium-emphasis">
              {{ progressPercentage.toFixed(0) }}% concluído
            </small>
          </div>
        </div>

        <!-- Card Principal -->
        <v-card
          class="flash-card mx-auto"
          width="600"
          min-height="400"
          elevation="8"
          :class="{ 'flipped': showAnswer }"
        >
          <!-- Pergunta -->
          <v-card-text 
            v-if="!showAnswer" 
            class="card-content d-flex flex-column justify-center align-center text-center"
          >
            <div class="question-section">
              <v-icon 
                icon="mdi-help-circle-outline" 
                size="48" 
                color="primary" 
                class="mb-4"
              ></v-icon>
              
              <h2 class="text-h5 mb-6 font-weight-medium">
                {{ currentCard?.pergunta }}
              </h2>
              
              <v-btn
                color="primary"
                size="large"
                variant="elevated"
                prepend-icon="mdi-eye"
                @click="revealAnswer"
                class="reveal-btn"
              >
                Ver Resposta
              </v-btn>
            </div>
          </v-card-text>

          <!-- Resposta -->
          <v-card-text 
            v-else 
            class="card-content d-flex flex-column"
          >
            <div class="answer-section flex-grow-1">
              <div class="d-flex align-center mb-4">
                <v-icon 
                  icon="mdi-lightbulb-outline" 
                  size="32" 
                  color="success" 
                  class="mr-3"
                ></v-icon>
                <h3 class="text-h6 font-weight-medium">Resposta</h3>
              </div>
              
              <!-- Pergunta pequena no topo -->
              <v-card 
                variant="outlined" 
                class="mb-4 question-reminder"
                color="grey-lighten-4"
              >
                <v-card-text class="py-2">
                  <small class="text-medium-emphasis">{{ currentCard?.pergunta }}</small>
                </v-card-text>
              </v-card>
              
              <!-- Resposta principal -->
              <div class="answer-text text-body-1 mb-6">
                {{ currentCard?.resposta }}
              </div>
            </div>

            <!-- Botões de avaliação -->
            <div class="evaluation-section">
              <v-divider class="mb-4"></v-divider>
              
              <p class="text-center text-body-2 text-medium-emphasis mb-4">
                Como você se saiu?
              </p>
              
              <div class="d-flex justify-center gap-3 flex-wrap">
                <v-btn
                  color="error"
                  variant="elevated"
                  prepend-icon="mdi-close-circle"
                  @click="evaluate('wrong')"
                  class="evaluation-btn"
                >
                  Errei
                </v-btn>
                
                <v-btn
                  color="warning"
                  variant="elevated"
                  prepend-icon="mdi-information"
                  @click="evaluate('partial')"
                  class="evaluation-btn"
                >
                  Acertei parcialmente
                </v-btn>
                
                <v-btn
                  color="success"
                  variant="elevated"
                  prepend-icon="mdi-check-circle"
                  @click="evaluate('correct')"
                  class="evaluation-btn"
                >
                  Acertei
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Controles de Navegação -->
        <div class="navigation-controls mt-4 d-flex justify-space-between align-center">
          <v-btn
            :disabled="currentIndex === 0"
            variant="outlined"
            prepend-icon="mdi-chevron-left"
            @click="previousCard"
            class="nav-btn"
          >
            Anterior
          </v-btn>

          <div class="d-flex gap-2">
            <v-btn
              variant="text"
              prepend-icon="mdi-refresh"
              @click="resetCurrentCard"
              size="small"
              :disabled="!showAnswer"
            >
              Resetar
            </v-btn>
            
            <v-btn
              variant="text"
              prepend-icon="mdi-shuffle-variant"
              @click="shuffleCards"
              size="small"
            >
              Embaralhar
            </v-btn>
          </div>

          <v-btn
            :disabled="currentIndex === flashcards.length - 1"
            variant="outlined"
            append-icon="mdi-chevron-right"
            @click="nextCard"
            class="nav-btn"
          >
            Próximo
          </v-btn>
        </div>

        <!-- Estatísticas -->
        <v-card 
          v-if="stats.total > 0" 
          variant="outlined" 
          class="mt-4 stats-card"
        >
          <v-card-text class="py-3">
            <div class="d-flex justify-center gap-6 text-center">
              <div>
                <div class="text-h6 text-success font-weight-bold">{{ stats.correct }}</div>
                <small class="text-medium-emphasis">Acertos</small>
              </div>
              <div>
                <div class="text-h6 text-warning font-weight-bold">{{ stats.partial }}</div>
                <small class="text-medium-emphasis">Parciais</small>
              </div>
              <div>
                <div class="text-h6 text-error font-weight-bold">{{ stats.wrong }}</div>
                <small class="text-medium-emphasis">Erros</small>
              </div>
              <div>
                <div class="text-h6 text-primary font-weight-bold">{{ stats.accuracy }}%</div>
                <small class="text-medium-emphasis">Precisão</small>
              </div>
            </div>
          </v-card-text>
        </v-card>
    </div>

    <!-- Feedback Toast -->
    <v-snackbar
      v-model="showFeedback"
      :color="feedbackColor"
      timeout="2000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon :icon="feedbackIcon" class="mr-2"></v-icon>
        {{ feedbackMessage }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue'

    // Props
    const props = defineProps({
        flashcards: {
            type: Array,
            required: true,
            default: () => []
        },
        flahscardsGravados: {
            type: Array,
            required: true,
            default: () => []
        }
    })

    // Emits
    const emit = defineEmits(['evaluate', 'cardChange', 'complete'])

    // State
    const currentIndex = ref(0)
    const showAnswer = ref(false)
    const showFeedback = ref(false)
    const lastEvaluation = ref(null)
    const evaluations = ref({}) // Armazena avaliações por índice do card

    // Computed
    const currentCard = computed(() => props.flashcards[currentIndex.value])

    const progressPercentage = computed(() => {
        if (props.flashcards.length === 0) return 0
        return ((currentIndex.value + 1) / props.flashcards.length) * 100
    })

    const stats = computed(() => {
        const evals = Object.values(evaluations.value)
        const total = evals.length
        const correct = evals.filter(e => e === 'correct').length
        const partial = evals.filter(e => e === 'partial').length
        const wrong = evals.filter(e => e === 'wrong').length
        const accuracy = total > 0 ? Math.round(((correct + partial * 0.5) / total) * 100) : 0
        
        return { total, correct, partial, wrong, accuracy }
    })

    const feedbackColor = computed(() => {
        switch (lastEvaluation.value) {
            case 'correct': return 'success'
            case 'wrong': return 'error'
            case 'partial': return 'warning'
            default: return 'primary'
        }
    })

    const feedbackIcon = computed(() => {
        switch (lastEvaluation.value) {
            case 'correct': return 'mdi-check-circle'
            case 'wrong': return 'mdi-close-circle'
            case 'partial': return 'mdi-information'
            default: return 'mdi-information'
        }
    })

    const feedbackMessage = computed(() => {
        switch (lastEvaluation.value) {
            case 'correct': return 'Parabéns! Você acertou! 🎉'
            case 'wrong': return 'Não desista! Continue praticando! 💪'
            case 'partial': return 'Boa! Você complementou a informação! 📚'
            default: return ''
        }
    })

    // Methods
    const revealAnswer = () => {
        showAnswer.value = true
    }

    const ansewersCards = ref([])

    const evaluate = (result) => {
        lastEvaluation.value = result
        showFeedback.value = true
        
        // Armazena a avaliação do card atual
        evaluations.value[currentIndex.value] = result

        const exist = ansewersCards.value.find(item => item.id === currentIndex.value)

        if(exist) {
          exist.response = result
        } else {
          ansewersCards.value.push({
            id: currentIndex.value,
            response: result
          })
        }

        emit('evaluate', ansewersCards.value)
        
        // Auto-avança para o próximo card após 1.5s se não for o último
        if (currentIndex.value < props.flashcards.length - 1) {
            setTimeout(() => {
                nextCard()
            }, 1500)
        } else {
            // Se for o último card, emite evento de conclusão
            setTimeout(() => {
                emit('complete', stats.value)
            }, 1500)
        }
    }

    const nextCard = () => {
        if (currentIndex.value < props.flashcards.length - 1) {
            currentIndex.value++
            resetCardState()
        }
    }

    const previousCard = () => {
        if (currentIndex.value > 0) {
            currentIndex.value--
            resetCardState()
        }
    }

    const resetCardState = () => {
        showAnswer.value = false
        lastEvaluation.value = null
    }

    const resetCurrentCard = () => {
        resetCardState()
        // Remove a avaliação do card atual
        delete evaluations.value[currentIndex.value]
    }

    const shuffleCards = () => {
        // Embaralha o array de flashcards
        const shuffled = [...props.flashcards].sort(() => Math.random() - 0.5)
        emit('cardChange', shuffled)
        currentIndex.value = 0
        resetCardState()
        evaluations.value = {}
    }

    // Watch para mudanças no índice do card
    watch(currentIndex, (newIndex) => {
        emit('cardChange', {
            currentIndex: newIndex,
            currentCard: currentCard.value,
            progress: progressPercentage.value
        })
    })

    // Atalhos de teclado
    const handleKeyPress = (event) => {
        if (event.key === 'ArrowRight' || event.key === ' ') {
            if (!showAnswer.value) {
                revealAnswer()
            } else if (currentIndex.value < props.flashcards.length - 1) {
                nextCard()
            }
        } else if (event.key === 'ArrowLeft') {
            previousCard()
        } else if (event.key === '1' && showAnswer.value) {
            evaluate('wrong')
        } else if (event.key === '2' && showAnswer.value) {
            evaluate('partial')
        } else if (event.key === '3' && showAnswer.value) {
            evaluate('correct')
        }
    }

    // Adiciona listeners de teclado
    document.addEventListener('keydown', handleKeyPress)

    onMounted(() => {
      if(props.flahscardsGravados.length) {
          ansewersCards.value = [ ...props.flahscardsGravados ]
          const max = ansewersCards.value.map( x => x.id ).reduce((a, b) => Math.max(a, b), 0) + 1
          //ir para o primeiro nao respondido
          max > props.flashcards.length ? currentIndex = max - 1 :  currentIndex.value = max - 1
          //gravar os ja respondidos
          ansewersCards.value.forEach(({ id, response }) => {
            evaluations.value[id] = response;
          });
      }
    })
</script>

<style scoped>
    .flashcard-container {
        max-width: 600px;
        width: 100%;
    }

    .progress-header {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        padding: 16px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .flash-card {
        border-radius: 16px !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.08) !important;
    }

    .flash-card:hover {
        transform: translateY(-2px);
        box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }

    .card-content {
    min-height: 350px;
    padding: 32px 24px !important;
    }

    .question-section {
        animation: fadeInUp 0.6s ease-out;
    }

    .answer-section {
     animation: fadeInUp 0.6s ease-out;
    }

    .question-reminder {
        background: rgba(0, 0, 0, 0.02) !important;
        border: 1px solid rgba(0, 0, 0, 0.08) !important;
    }

    .answer-text {
        line-height: 1.7;
        color: rgba(0, 0, 0, 0.87);
    }

    .reveal-btn {
        border-radius: 12px !important;
        padding: 12px 32px !important;
        font-weight: 500 !important;
        text-transform: none !important;
        letter-spacing: 0.5px !important;
        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
    }

    .reveal-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4) !important;
    }

    .evaluation-btn {
        border-radius: 12px !important;
        font-weight: 500 !important;
        text-transform: none !important;
        min-width: 120px !important;
        transition: all 0.2s ease !important;
    }

    .evaluation-btn:hover {
        transform: translateY(-1px);
    }

    .evaluation-section {
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        padding-top: 16px;
    }

    .navigation-controls {
        padding: 0 8px;
    }

    .nav-btn {
        border-radius: 12px !important;
        font-weight: 500 !important;
        text-transform: none !important;
    }

    .stats-card {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.05) !important;
        border-radius: 12px !important;
    }

    .gap-2 {
    gap: 8px;
    }

    .gap-3 {
        gap: 12px;
    }

    .gap-6 {
        gap: 24px;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 600px) {
        .flashcard-container {
            margin: 16px;
        }
        
        .flash-card {
            width: 100% !important;
        }
        
        .card-content {
            padding: 24px 20px !important;
        }
        
        .evaluation-btn {
            min-width: 100px !important;
            font-size: 0.875rem !important;
        }
        
        .navigation-controls {
            flex-direction: column;
            gap: 12px;
        }
        
        .nav-btn {
            width: 100%;
        }
    }
</style>