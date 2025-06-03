<template>
    <div>
        <v-btn
            @click="dialog = true"
            variant="text"
            color="primary"
        >Abrir</v-btn>
        <v-dialog v-model="dialog" max-width="1000">
            <v-card color="blue-grey-lighten-5">
                <v-card-title class="bg-primary d-flex align-center justify-space-between"> 
                    <div class="d-flex align-center ga-2">
                        <v-icon size="1.5rem">{{ conteudo.icon }}</v-icon> 
                        {{ conteudo.disciplina }} 
                    </div>
                    <v-btn density="compact" icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
                </v-card-title>
                 <v-card-text>
                    <div class="pa-2">
                        <v-form class="mt-5">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        label="Orgão"
                                        :items="listOrgaos"
                                        v-model="selected"
                                        variant="outlined"
                                        density="compact"
                                        hide-details    
                                        clearable
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-btn-toggle
                                        v-model="toggle"
                                        divided
                                        density="compact"
                                        color="primary"
                                        mandatory 
                                    >
                                        <v-btn><v-icon>mdi-view-list</v-icon></v-btn>
                                        <v-btn><v-icon>mdi-card-bulleted-outline</v-icon></v-btn>
                                    </v-btn-toggle>
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                     <v-checkbox v-model="soFavs" hide-details label="Apenas favoritados"></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-form>
                    </div>
                </v-card-text>
                <v-card-text class="overflow-auto" style="max-height: 800px;">
                    <div class="jurisprudence-container" v-if="toggle == 0">
                        <h1 class="text-h6 mb-5">{{ conteudo.title }} </h1>
                        <v-card 
                            v-for="(item, i) in sumulas" 
                            :key="i" 
                            :class="cardClassesA(i)"
                            class="jurisprudence-card mb-4"
                            
                            elevation="2"
                            :variant="isFavorited(i) ? 'tonal' : 'elevated'"
                        >
                        <!-- Header com ícone de favorito -->
                        <div class="card-header d-flex align-center justify-space-between pa-4 pb-2">
                            <div class="orgao-section">
                            <v-chip 
                                :color="isFavorited(i) || soFavs ? 'red' : 'primary'" 
                                variant="flat" 
                                size="small"
                                class="orgao-chip"
                            >
                                <v-icon start size="small">mdi-gavel</v-icon>
                                {{ item.orgao }}
                            </v-chip>
                            </div>
                            
                            <v-icon 
                            v-if="isFavorited(i) || soFavs"
                            color="red-darken-2"
                            size="small"
                            class="favorite-indicator"
                            >
                            mdi-heart
                            </v-icon>
                        </div>

                        <!-- Título e Tese -->
                        <v-card-title class="px-4 py-2">
                            <div class="title-section">
                            <h3 class="text-h6 font-weight-medium mb-1">
                                {{ item.title }}
                            </h3>
                            <p class="text-subtitle-1 text-medium-emphasis font-weight-regular">
                                {{ item.tese }}
                            </p>
                            </div>
                        </v-card-title>

                        <!-- Conteúdo -->
                        <v-card-text class="px-4 pb-4">
                            <div class="texto-content">
                            <p class="text-body-1 line-height-relaxed">
                                {{ item.texto }}
                            </p>
                            </div>
                        </v-card-text>

                        <!-- Borda inferior para favoritos -->
                        <div 
                            v-if="isFavorited(i)" 
                            class="favorite-border"
                        ></div>
                        </v-card>
                    </div>
                    <CardJuris
                        v-if="toggle == 1"
                        :jurisprudencias="sumulas"
                        :title="conteudo.title"
                        :favGravados="jurisSumulasGravadas"
                        :sofavs="soFavs"
                        @toggle-favorite="onToggleFavorite"
                        @share="onShare"
                        @copy="onCopy"
                    />
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn 
                        @click="$emit('concluir', conteudo)" 
                        :color="conteudo.concluido ? 'error' : 'success'"
                        :prepend-icon="conteudo.concluido ? 'mdi-close-box-outline' : 'mdi-checkbox-marked-circle-outline'"
                    >{{ conteudo.concluido ? 'Desmarcar como Concluído' : 'Concluir Atividade' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';

    import { useOptionsStore } from '@/store/concursos/OptionsStore';
    const optionsStore = useOptionsStore()

    import CardJuris from './cardJuris.vue';

    const dialog = ref(false)
    
    const props = defineProps({
        conteudo: {
            type: Object,
            default: {
                id: null
            },
        },
    })

    const selected =  ref('')
    const view = ['list', 'grid']
    const toggle = ref(1)
    const soFavs = ref(false)

    const listOrgaos = computed(() => {
        const list =  props.conteudo.sumulas.map(item => item.orgao)
        return [...new Set(list)]
    })

    const sumulas = computed(() => {
        let sumulas = props.conteudo.sumulas
        if(selected.value) {
            sumulas = sumulas.filter(item => item.orgao === selected.value)
        }
        if(soFavs.value) {
            sumulas = sumulas.filter((item, index) => jurisSumulasGravadas.value.includes(index));

        }
        return sumulas
    })

    const onToggleFavorite = async (data) => {
        await optionsStore.favSumulas({...props.conteudo, favoriteSumulas: data.favorited})
    }

    const onShare = (data) => {
        console.log('Compartilhar:', data)
        // Implementar funcionalidade de compartilhamento
        if (Navigator.share) {
                Navigator.share({
                title: data.titulo,
                text: data.texto
            })
        }
    }

    const onCopy = (result) => {
        if (result.success) {
            console.log('Texto copiado com sucesso!')
            // Mostrar snackbar de sucesso
        } else {
            console.error('Erro ao copiar:', result.error)
        }
    }

    const jurisSumulasGravadas = computed(() => {
        const select = optionsStore.readSumulasControle.find(item => item.guia_id === props.conteudo.id)
        return select ? select?.favoriteSumulas : []
    })

    const isFavorited = (index) => {
        return jurisSumulasGravadas.value.includes(index)
    }

    const cardClassesA = (index) => {
        return soFavs.value 
        ? 'favorited-card'
        :{
            'favorited-card': isFavorited(index),
            'regular-card': !isFavorited(index)
        }
    }
    
  
</script>

<style scoped>
.text{
    margin: 1rem 2rem;
    line-height: 1.8;
    background: rgb(245, 243, 243);
    padding: 1rem;
}
.jurisprudence-container {
  max-width: 100%;
}

.jurisprudence-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px !important;
  position: relative;
  overflow: hidden;
}

.jurisprudence-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.favorited-card {
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.05) 0%, 
    rgba(255, 193, 7, 0.02) 100%
  );
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.regular-card {
  background: rgba(var(--v-theme-surface));
}

.card-header {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.orgao-chip {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.favorite-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.title-section h3 {
  color: rgba(var(--v-theme-on-surface), 0.87);
  line-height: 1.3;
}

.title-section p {
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 0;
  font-style: italic;
}

.texto-content {
  position: relative;
}

.line-height-relaxed {
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.favorite-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(238, 96, 31, 0.8) 0%, 
    rgba(255, 106, 7, 0.281) 100%
  );
}

/* Responsividade */
@media (max-width: 600px) {
  .jurisprudence-card {
    margin-bottom: 12px;
  }
  
  .card-header {
    padding: 12px 16px 8px 16px;
  }
  
  .title-section h3 {
    font-size: 1.1rem;
  }
}

/* Modo escuro */
.v-theme--dark .favorited-card {
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.08) 0%, 
    rgba(255, 193, 7, 0.03) 100%
  );
  border-color: rgba(255, 193, 7, 0.3);
}

.v-theme--dark .card-header {
  background: rgba(var(--v-theme-surface-bright), 0.05);
}
</style>