<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
             <div>
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.push('/homepainel')">voltar</v-btn>
             </div>
             <h1 class="text-h4 my-6 text-center grey--text text--darken-3">
                {{ $route.params.id }}
             </h1>
             <div v-if="lawStore.readLoad">
                Carregando...
             </div>
             <div class="laws-container">
                <v-fade-transition group>
                <v-card
                    v-for="item in listLaws"
                    :key="item.id"
                    class="law-card mb-4"
                    variant="outlined"
                    hover
                    @click="navigateToLaw(item.id)"
                >
                    <v-card-text class="pa-6">
                    <!-- Header com título e status -->
                    <div class="d-flex align-center justify-space-between mb-3">
                        <h3 class="law-title text-h6 font-weight-medium">
                        {{ item.title }}
                        </h3>
                        <v-chip
                        v-if="item.revogado"
                        color="warning"
                        variant="tonal"
                        size="small"
                        class="ml-2"
                        >
                        <v-icon start size="small">mdi-alert-circle</v-icon>
                        Revogado
                        </v-chip>
                    </div>

                    <!-- Informações principais -->
                    <div class="law-info mb-4">
                        <div class="info-grid">
                        <div class="info-item">
                            <v-icon class="info-icon" color="primary" size="small">mdi-file-document</v-icon>
                            <span class="info-label">Páginas:</span>
                            <span class="info-value">{{ item.total_pages }}</span>
                        </div>
                        
                        <div class="info-item">
                            <v-icon class="info-icon" color="primary" size="small">mdi-calendar</v-icon>
                            <span class="info-label">Ano:</span>
                            <span class="info-value">{{ item.ano }}</span>
                        </div>
                        
                        <div class="info-item">
                            <v-icon class="info-icon" color="primary" size="small">mdi-update</v-icon>
                            <span class="info-label">Atualização:</span>
                            <span class="info-value">{{ item.data_include }}</span>
                        </div>
                        </div>
                    </div>

                    <!-- Prévia do conteúdo -->
                    <div class="law-preview">
                        <p class="preview-text text-body-2 text-medium-emphasis mb-0">
                        {{ getPreviewText(item.description_norm) }}
                        </p>
                    </div>

                    <!-- Indicador de ação -->
                    <div class="d-flex justify-end mt-3">
                        <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        append-icon="mdi-arrow-right"
                        >
                        abrir
                        </v-btn>
                    </div>
                    </v-card-text>
                </v-card>
                </v-fade-transition>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter()

    import { useGeralStore } from '@/store/GeralStore';
    import { useLawStore } from '@/store/LawsStore';

    const geralStore = useGeralStore()
    const lawStore = useLawStore()

    const route = useRoute()
    const idDisciplina  = route.params.id

    const navigateToLaw = (id) => {
        router.push(`/avancado/${id}`)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
            })
        } catch (error) {
            return dateString
        }
    }

    const getPreviewText = (text) => {
        if (!text) return 'Sem descrição disponível'
        
        const words = text.split(' ')
        if (words.length <= 25) return text
        
        return words.slice(0, 25).join(' ') + '...'
    }


    const listLaws = ref([])

    const getLawsForDisciplinas = async (id) => {
        const list = await lawStore.getLawForDisciplines(id)
        listLaws.value = list
    }

    onMounted( async () => {
        await getLawsForDisciplinas(idDisciplina)
    })

</script>

<style scoped>
.laws-container {
  padding: 16px 0;
}

.law-card {
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.law-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgb(var(--v-theme-primary));
}

.law-title {
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
  margin: 0;
}

.law-info {
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: 16px;
  background: rgba(var(--v-theme-primary), 0.04);
  border-radius: 0 8px 8px 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.info-icon {
  opacity: 0.7;
}

.info-label {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  min-width: 80px;
}

.info-value {
  font-weight: 400;
}

.law-preview {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid rgba(var(--v-theme-secondary), 0.6);
}

.preview-text {
  line-height: 1.6;
  font-style: italic;
}

/* Responsividade */
@media (min-width: 600px) {
  .info-grid {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .info-item {
    flex: 1;
    justify-content: flex-start;
  }
}

/* Animações */
.v-enter-active,
.v-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.v-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Estados de foco para acessibilidade */
.law-card:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.law-card[tabindex="0"] {
  outline: none;
}
</style>