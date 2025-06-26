<template>
  <div class="educational-cards-container">
    <div class="cards-grid">
      <div
        v-for="(item, index) in posts"
        :key="index"
        class="card-wrapper"
      >
        <v-card
          class="educational-card"
          elevation="2"
        >
        <v-card-text v-if="false">
          <MapMindInteractive :post="item" />
        </v-card-text>
          <!-- Header do Card -->
          <v-card-title class="pb-2 text-wrap">
            <div class="d-flex align-center justify-space-between w-100">
              <v-chip
                :color="getDisciplineColor(item.disciplina)"
                variant="tonal"
                size="small"
                class="mb-2"
              >
                {{ item.disciplina }}
              </v-chip>
              <small class="text-overline">{{ item?.createdAt }}</small>
              <v-btn
                icon
                size="small"
                variant="text"
                @click.stop="toggleFavorite(index)"
              >
                <v-icon :color="favorites.has(index) ? 'red' : 'grey'">
                  {{ favorites.has(index) ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </div>
            <h3 class="title-text">{{ item.titulo }}</h3>
          </v-card-title>

          <!-- Conteúdo do Card -->
          <v-card-text class="pt-0">
            <div>
               Artigos Ref: 
               <v-chip 
                density="compact" color="success"
                v-if="item.arts.length" v-for="art, a in item.arts" :key="a" class="mr-1">{{ art }}</v-chip> 
                <v-chip  density="compact" color="success" v-else>{{ item.art }}</v-chip>
            </div>
            <!-- Palavras-chave -->
            <div class="mb-4">
              <v-chip-group>
                <v-chip
                  v-for="palavra in item?.palavras_chaves?.slice(0, showAllKeywords.has(index) ? item.palavras_chaves?.length : 4)"
                  :key="palavra"
                  size="x-small"
                  variant="outlined"
                  color="primary"
                >
                  {{ palavra }}
                </v-chip>
                <v-chip
                  v-if="item?.palavras_chaves?.length > 4 && !showAllKeywords.has(index)"
                  size="x-small"
                  variant="text"
                  @click.stop="toggleKeywords(index)"
                >
                  +{{ item?.palavras_chaves?.length - 4 }} mais
                </v-chip>
              </v-chip-group>
            </div>

            <!-- Texto resumido -->
            <div class="text-body-1 mb-4 line-height-relaxed text-content"  v-html="getTextPreview(item?.texto || item?.texto_explicativo, expanded.has(index)) "> 
            </div>
            <v-btn
              v-if="item?.texto?.length | item?.texto_explicativo?.length > 200"
              variant="text"
              size="small"
              color="primary"
              class="pa-0 ml-1"
              @click.stop="toggleExpanded(index)"
            >
              {{ expanded.has(index) ? 'Ver menos' : 'Ver mais' }}
            </v-btn>

            <!-- Questões -->
            <div class="questions-section">
              <div class="d-flex align-center mb-2">
                <v-icon size="small" color="primary" class="mr-2">mdi-format-list-checks</v-icon>
                <span class="text-subtitle-2 font-weight-medium">
                  {{ item?.questoes?.length }} quest{{ item?.questoes?.length > 1 ? 'ões' : 'ão' }}
                </span>
              </div>

               <!-- Ações do Card -->
              <v-card-actions class="pt-0">
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click.stop="toggleQuestions(index)"
                >
                  <v-icon size="small" class="mr-1">
                    {{ showQuestions.has(index) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                  {{ showQuestions.has(index) ? 'Ocultar' : 'Ver' }} questões
                </v-btn>
                
                <v-spacer></v-spacer>
                
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click.stop="shareCard(item)"
                >
                  <v-icon size="small">mdi-share-variant</v-icon>
                </v-btn>
              </v-card-actions>
              
              <v-expand-transition>
                <div v-if="showQuestions.has(index)">
                  <v-card
                    v-for="(questao, qIndex) in item.questoes"
                    :key="qIndex"
                    variant="outlined"
                    class="mb-3 question-card"
                  >
                    <v-card-text class="pa-3">
                      <p class="text-body-2 font-weight-medium mb-3">
                        {{ questao.enunciado }}
                      </p>
                      
                      <div class="alternatives mb-3">
                        <div
                          v-for="(alternativa, altKey) in questao.alternativas"
                          :key="altKey"
                          class="alternative-item mb-2"
                          :class="getAlternativeClass(index, qIndex, altKey)"
                          @click="selectAlternative(index, qIndex, altKey)"
                        >
                          <v-radio-btn
                            :model-value="userAnswers.get(`${index}-${qIndex}`) === altKey"
                            :disabled="showAnswers.has(`${index}-${qIndex}`)"
                            color="primary"
                            class="mr-2"
                          ></v-radio-btn>
                          <div class="alternative-content">
                            <span class="alternative-letter">{{ altKey.toUpperCase() }})</span>
                            <span class="alternative-text">{{ alternativa }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="question-actions mb-3">
                        <v-btn
                          v-if="userAnswers.has(`${index}-${qIndex}`) && !showAnswers.has(`${index}-${qIndex}`)"
                          variant="text"
                          color="primary"
                          size="small"
                          @click="revealAnswer(index, qIndex, questao.resposta_correta)"
                        >
                          Ver Resposta
                        </v-btn>
                        
                        <v-btn
                          v-if="showAnswers.has(`${index}-${qIndex}`)"
                          variant="outlined"
                          size="small"
                          @click="resetQuestion(index, qIndex)"
                          class="ml-2"
                        >
                          Tentar Novamente
                        </v-btn>
                      </div>

                      <v-expand-transition>
                        <div v-if="showAnswers.has(`${index}-${qIndex}`)" class="answer-section">
                          <div class="result-feedback mb-3">
                            <v-chip
                              :color="getResultColor(index, qIndex, questao.resposta_correta)"
                              variant="tonal"
                              size="small"
                              class="mb-2"
                            >
                              <v-icon size="small" class="mr-1">
                                {{ getResultIcon(index, qIndex, questao.resposta_correta) }}
                              </v-icon>
                              {{ getResultText(index, qIndex, questao.resposta_correta) }}
                            </v-chip>
                          </div>
                          
                          <div class="correct-answer mb-2">
                            <span class="text-subtitle-2 font-weight-medium">
                              Resposta Correta: {{ questao.resposta_correta.toUpperCase() }}
                            </span>
                          </div>
                          
                          <div class="justification">
                            <p class="text-body-2 text-medium-emphasis">
                              <strong>Justificativa:</strong> {{ questao.justificativa }}
                            </p>
                          </div>
                        </div>
                      </v-expand-transition>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </div>
          </v-card-text>    
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import MapMindInteractive from './mapMindInteractive.vue'

  // Props
  const props = defineProps({
    posts: {
      type: Array,
      required: true,
      default: () => []
    }
  })

  // Estados reativos
  const expanded = reactive(new Set())
  const showQuestions = reactive(new Set())
  const showAllKeywords = reactive(new Set())
  const favorites = reactive(new Set())
  const userAnswers = reactive(new Map())
  const showAnswers = reactive(new Set())

  // Funções
  const toggleExpanded = (index) => {
    if (expanded.has(index)) {
      expanded.delete(index)
    } else {
      expanded.add(index)
    }
  }

  const toggleQuestions = (index) => {
    if (showQuestions.has(index)) {
      showQuestions.delete(index)
    } else {
      showQuestions.add(index)
    }
  }

  const toggleKeywords = (index) => {
    if (showAllKeywords.has(index)) {
      showAllKeywords.delete(index)
    } else {
      showAllKeywords.add(index)
    }
  }

  const toggleFavorite = (index) => {
    if (favorites.has(index)) {
      favorites.delete(index)
    } else {
      favorites.add(index)
    }
  }

  const selectAlternative = (cardIndex, questionIndex, alternative) => {
    const questionId = `${cardIndex}-${questionIndex}`
    if (!showAnswers.has(questionId)) {
      userAnswers.set(questionId, alternative)
    }
  }

  const revealAnswer = (cardIndex, questionIndex, correctAnswer) => {
    const questionId = `${cardIndex}-${questionIndex}`
    showAnswers.add(questionId)
  }

  const resetQuestion = (cardIndex, questionIndex) => {
    const questionId = `${cardIndex}-${questionIndex}`
    userAnswers.delete(questionId)
    showAnswers.delete(questionId)
  }

  const getAlternativeClass = (cardIndex, questionIndex, alternative) => {
    const questionId = `${cardIndex}-${questionIndex}`
    const userAnswer = userAnswers.get(questionId)
    const isAnswerRevealed = showAnswers.has(questionId)
    
    if (!isAnswerRevealed) {
      return {
        'alternative-selectable': true,
        'alternative-selected': userAnswer === alternative
      }
    }
    
    const correctAnswer = props.posts[cardIndex].questoes[questionIndex].resposta_correta
    
    return {
      'alternative-correct': alternative === correctAnswer,
      'alternative-incorrect': userAnswer === alternative && alternative !== correctAnswer,
      'alternative-disabled': true
    }
  }

  const getResultColor = (cardIndex, questionIndex, correctAnswer) => {
    const questionId = `${cardIndex}-${questionIndex}`
    const userAnswer = userAnswers.get(questionId)
    return userAnswer === correctAnswer ? 'success' : 'error'
  }

  const getResultIcon = (cardIndex, questionIndex, correctAnswer) => {
    const questionId = `${cardIndex}-${questionIndex}`
    const userAnswer = userAnswers.get(questionId)
    return userAnswer === correctAnswer ? 'mdi-check-circle' : 'mdi-close-circle'
  }

  const getResultText = (cardIndex, questionIndex, correctAnswer) => {
    const questionId = `${cardIndex}-${questionIndex}`
    const userAnswer = userAnswers.get(questionId)
    return userAnswer === correctAnswer ? 'Parabéns! Resposta correta!' : 'Resposta incorreta'
  }

  const getTextPreview = (text, isExpanded) => {
    if (isExpanded || text?.length <= 200) {
      return text
    }
    return text?.substring(0, 200) + '...'
  }

  const getDisciplineColor = (disciplina) => {
    const colors = {
      'Direito Tributário': 'blue',
      'Direito Constitucional': 'green',
      'Direito Administrativo': 'orange',
      'Direito Civil': 'purple',
      'Direito Penal': 'red',
      'Direito Processual': 'teal'
    }
    return colors[disciplina] || 'grey'
  }

  const shareCard = (item) => {
    if (navigator.share) {
      navigator.share({
        title: item.titulo,
        text: item.texto.substring(0, 100) + '...',
        url: window.location.href
      })
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(item.titulo + '\n\n' + item.texto)
    }
  }
</script>

<style scoped>
.educational-cards-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.cards-grid {
  display: grid;
  gap: 16px;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  grid-auto-rows: max-content;
  align-content: start;
}

.card-wrapper {
  width: 100%;
  min-height: fit-content;
}

.educational-card {
  width: 100%;
  border-radius: 16px !important;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.educational-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.title-text {
  font-size: 1.1rem;
  line-height: 1.3;
  font-weight: 600;
  color: rgb(15, 20, 25);
}

.questions-section {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  padding: 12px;
}

.question-card {
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.8);
}

.alternative-item {
  display: flex;
  align-items: flex-start;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.alternative-selectable {
  cursor: pointer;
}

.alternative-selectable:hover {
  background: rgba(25, 118, 210, 0.04);
}

.alternative-selected {
  background: rgba(25, 118, 210, 0.08);
  border: 1px solid rgba(25, 118, 210, 0.3);
}

.alternative-correct {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.alternative-incorrect {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.5);
}

.alternative-disabled {
  pointer-events: none;
}

.alternative-content {
  display: flex;
  align-items: flex-start;
  flex: 1;
}

.alternative-letter {
  min-width: 20px;
  font-weight: 600;
  color: rgb(83, 100, 113);
}

.alternative-text {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgb(15, 20, 25);
}

.answer-section {
  background: rgba(76, 175, 80, 0.05);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.result-feedback {
  text-align: center;
}

.question-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.v-chip-group {
  gap: 4px;
}

.v-card-actions {
  padding: 8px 16px 16px 16px;
}

.line-height-relaxed {
  line-height: 1.6;
  letter-spacing: 0.02em;
}

::v-deep(.text-content p) {
  margin-bottom: 1.5em;
}

/* Responsividade baseada no container pai */
@container (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .educational-cards-container {
    padding: 12px;
  }
  
  .title-text {
    font-size: 1rem;
  }
  
  .alternative-text {
    font-size: 0.8rem;
  }
}

@container (min-width: 769px) and (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@container (min-width: 1201px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

/* Fallback para navegadores que não suportam container queries */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  
  .educational-cards-container {
    padding: 12px !important;
  }
  
  .title-text {
    font-size: 1rem !important;
  }
  
  .alternative-text {
    font-size: 0.8rem !important;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
  }
}

/* Para containers muito pequenos */
@container (max-width: 400px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .educational-cards-container {
    padding: 8px;
  }
  
  .educational-card {
    border-radius: 12px !important;
  }
}

/* Para containers muito grandes */
@container (min-width: 1600px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}
</style>