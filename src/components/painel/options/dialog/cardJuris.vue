<template>
  <!-- Header com controles de navegação -->
  <v-card class="navigation-header mb-4" elevation="1">
    <v-card-text class="py-3">
        <div class="d-flex justify-space-between align-center">
            <!-- Informações de posição -->
            <div class="position-info">
                <v-chip color="primary" variant="outlined">
                    {{ currentIndex + 1 }} de {{ jurisprudencias.length }}
                </v-chip>
            </div>

            <!-- Controles de navegação -->
            <div class="navigation-controls">
            <v-btn
                icon="mdi-chevron-double-left"
                variant="outlined"
                size="small"
                :disabled="currentIndex === 0"
                @click="goToFirst"
                class="mr-1"
            ></v-btn>
            
            <v-btn
                icon="mdi-chevron-left"
                variant="outlined"
                size="small"
                :disabled="currentIndex === 0"
                @click="goToPrevious"
                class="mr-2"
            ></v-btn>

            <v-btn
                icon="mdi-chevron-right"
                variant="outlined"
                size="small"
                :disabled="currentIndex === jurisprudencias.length - 1"
                @click="goToNext"
                class="mr-1"
            ></v-btn>

            <v-btn
                icon="mdi-chevron-double-right"
                variant="outlined"
                size="small"
                :disabled="currentIndex === jurisprudencias.length - 1"
                @click="goToLast"
            ></v-btn>
            </div>
        </div>

    <!-- Barra de progresso -->
        <v-progress-linear
            :model-value="progressValue"
            color="primary"
            height="4"
            rounded
            class="mt-3"
        ></v-progress-linear>
    </v-card-text>
  </v-card>
  
  <v-card
    class="sumula-card"
    elevation="2"
    :class="{ 'favorited': isFavorited }"
  >
    <!-- Header com título e botão de favoritar -->
    <v-card-title class="d-flex justify-space-between align-center pa-4">
      <div class="title-section">
        <div class="d-flex flex-wrap flex-column mb-5">
            <h3 class="text-h6 font-weight-bold text-primary mb-1" style="white-space: nowrap;">
              {{ currentCard?.acao || currentCard.title }}
            </h3>
            <p>{{ currentCard?.tese }}</p>
        </div>
        <v-chip
          :color="getOrgaoColor(currentCard?.orgao)"
          variant="outlined"
          size="small"
          class="font-weight-medium"
        >
          <v-icon start size="small">mdi-gavel</v-icon>
          {{ currentCard?.orgao }}
        </v-chip>
         <v-chip
          :color="getRecorrenteColor(currentCard?.nivel)"
          variant="outlined"
          size="small"
          class="font-weight-medium ml-2"
        >
          <v-icon start size="small">mdi-arrow-top-right-thin-circle-outline</v-icon>
          {{ currentCard?.nivel }} recorrente
        </v-chip>
      </div>
      
      <v-btn
        :icon="isFavorited ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="isFavorited ? 'red' : 'grey'"
        variant="text"
        size="large"
        @click="toggleFavorite"
        class="favorite-btn"
      >
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Conteúdo do texto -->
    <v-card-text class="pa-4">
      <div class="texto-content">
        <p class="text-body-1 line-height-relaxed mb-0">
          {{ currentCard?.texto }}
        </p>
        <div class="text-right mt-5">
            <small>{{ currentCard?.orgao }}: {{ currentCard?.ministro }}</small>
        </div>
      </div>
    </v-card-text>

    <!-- Footer com informações adicionais -->
    <v-card-actions class="px-4 pb-4">
      <v-spacer></v-spacer>
      <v-btn
        variant="outlined"
        size="small"
        prepend-icon="mdi-share-variant"
        @click="compartilhar"
      >
        Compartilhar
      </v-btn>
      <v-btn
        variant="outlined"
        size="small"
        prepend-icon="mdi-content-copy"
        @click="copiarTexto"
      >
        Copiar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
    import { ref, computed } from 'vue'

    // Props do componente
    const props = defineProps({
        jurisprudencias: {
            type: Array,
            required: true
        },
        favorito: {
            type: Boolean,
            default: false
        }
    })

    const currentIndex = ref(0)
    const currentCard = computed(() => props.jurisprudencias[currentIndex.value])

    // Emits
    const emit = defineEmits(['toggle-favorite', 'share', 'copy'])

    // Estado reativo
    const isFavorited = ref(props.favorito)

    // Computed
    const getOrgaoColor = computed(() => {
        return (orgao) => {
            const cores = {
            'STF': 'deep-purple',
            'STJ': 'indigo',
            'TST': 'blue',
            'TRT': 'light-blue',
            'TJSP': 'green',
            'TJRJ': 'teal',
            'TJMG': 'orange',
            'TJRS': 'amber'
            }
            return cores[orgao] || 'primary'
        }
    })

    const getRecorrenteColor = computed(() => {
        return (nivel) => {
            const cores = {
                'pouco': 'deep-purple',
                'medio': 'indigo',
                'muito': 'red',
            }
            return cores[nivel] || 'primary'
        }
    })

    // Métodos
    const toggleFavorite = () => {
        isFavorited.value = !isFavorited.value
        emit('toggle-favorite', {
            titulo: currentCard.value.title,
            orgao: currentCard.value.title,
            favorited: isFavorited.value
        })
    }

    const compartilhar = () => {
        emit('share', {
            titulo: currentCard.value.title,
            orgao: currentCard.value.orgao,
            texto: currentCard.value.texto
        })
    }

    const copiarTexto = async () => {
        try {
            const textoCompleto = `${currentCard.value.title}\n${currentCard.value.orgao}\n\n${currentCard.value.texto}`
            await navigator.clipboard.writeText(textoCompleto)
            emit('copy', { success: true })
        } catch (error) {
            emit('copy', { success: false, error })
        }
    }

    const progressValue = computed(() => {
        if (props.jurisprudencias.length <= 1) return 100
        return ((currentIndex.value + 1) / props.jurisprudencias.length) * 100
    })

    // Métodos de navegação
    const goToNext = () => {
        if (currentIndex.value < props.jurisprudencias.length - 1) {
            currentIndex.value++
            emitIndexChanged()
        }
    }

    const goToPrevious = () => {
        if (currentIndex.value > 0) {
            currentIndex.value--
            emitIndexChanged()
        }
    }

    const goToFirst = () => {
        currentIndex.value = 0
        emitIndexChanged()
    }

    const goToLast = () => {
        currentIndex.value = props.jurisprudencias.length - 1
        emitIndexChanged()
    }

    const goToIndex = (index) => {
        if (index >= 0 && index < props.jurisprudencias.length) {
            currentIndex.value = index
            emitIndexChanged()
        }
    }
    // Emitir mudança de índice
    const emitIndexChanged = () => {
        // emit('index-changed', {
        //     index: currentIndex.value,
        //     juris: currentCard.value
        // })
    }
</script>

<style scoped>
    .sumula-card {
        transition: all 0.3s ease;
        border-radius: 12px;
        margin-bottom: 16px;
    }

    .sumula-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important;
    }

    .sumula-card.favorited {
        border-left: 4px solid #f44336;
    }

    .title-section {
        flex: 1;
    }

    .favorite-btn {
        transition: all 0.2s ease;
    }

    .favorite-btn:hover {
        transform: scale(1.1);
    }

    .texto-content {
        background: rgba(0,0,0,0.02);
        border-radius: 8px;
        padding: 16px;
        border-left: 3px solid var(--v-theme-primary);
    }

    .line-height-relaxed {
        line-height: 1.7;
    }

    .text-primary {
    color: rgb(var(--v-theme-primary)) !important;
    }

    /* Animação para o coração */
    @keyframes heartbeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    .favorite-btn:active {
    animation: heartbeat 0.3s ease;
    }

    /* Responsividade */
    @media (max-width: 600px) {
        .v-card-title {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
        }
        
        .favorite-btn {
            align-self: flex-end;
        }
    }
</style>